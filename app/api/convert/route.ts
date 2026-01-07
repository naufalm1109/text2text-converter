import { MAX_BYTES } from "@/lib/constants";
import { TOOL_CONFIG, isToolKey, getExt, stripExt } from "@/lib/tool-config";

type CloudConvertJob = {
  data: {
    id: string;
    status: string;
    tasks: Array<any>;
  };
};

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function findTask(tasks: any[], name: string) {
  return tasks.find((t) => t.name === name);
}

export async function POST(req: Request) {
  try {
    const apiKey = mustEnv("CLOUDCONVERT_API_KEY");

    const form = await req.formData();
    const toolRaw = form.get("tool");
    const file = form.get("file");

    if (!isToolKey(toolRaw)) return jsonError("Invalid tool.");
    if (!(file instanceof File)) return jsonError("Missing file.");

    const cfg = TOOL_CONFIG[toolRaw];

    // Validate extension
    const ext = getExt(file.name);
    if (ext !== cfg.inputExt) {
      return jsonError(`Invalid file type. Only .${cfg.inputExt} allowed for ${cfg.title}.`);
    }

    // Validate size
    if (file.size > MAX_BYTES) {
      return jsonError(`File too large. Max size is ${MAX_BYTES} bytes.`, 413);
    }

    // 1) Create job with tasks: import/upload -> convert -> export/url
    const createJobRes = await fetch("https://api.cloudconvert.com/v2/jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        tasks: {
          "import-file": {
            operation: "import/upload",
          },
          "convert-file": {
            operation: "convert",
            input: "import-file",
            input_format: cfg.cloudConvertInputFormat,
            output_format: cfg.cloudConvertOutputFormat,
          },
          "export-file": {
            operation: "export/url",
            input: "convert-file",
            inline: false,
            archive_multiple_files: false,
          },
        },
      }),
    });

    if (!createJobRes.ok) {
      const text = await createJobRes.text();
      return jsonError(`CloudConvert job creation failed: ${text}`, 502);
    }

    const job: CloudConvertJob = await createJobRes.json();
    const jobId = job.data.id;

    // 2) Get upload task form (import/upload gives form URL + params)
    const importTask = findTask(job.data.tasks, "import-file");
    const uploadForm = importTask?.result?.form;
    if (!uploadForm?.url || !uploadForm?.parameters) {
      return jsonError("CloudConvert upload form not found.", 502);
    }

    // 3) Upload file to the signed URL
    const uploadBody = new FormData();
    for (const [k, v] of Object.entries(uploadForm.parameters)) {
      uploadBody.append(k, String(v));
    }
    uploadBody.append("file", file, file.name);

    const uploadRes = await fetch(uploadForm.url, {
      method: "POST",
      body: uploadBody,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      return jsonError(`CloudConvert upload failed: ${text}`, 502);
    }

    // 4) Poll job until finished/error
    let status = job.data.status;
    let latestJob = job;

    for (let i = 0; i < 60; i++) {
      // up to ~60 polls (with delay) — adjust later if needed
      const pollRes = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!pollRes.ok) {
        const text = await pollRes.text();
        return jsonError(`CloudConvert poll failed: ${text}`, 502);
      }

      latestJob = await pollRes.json();
      status = latestJob.data.status;

      if (status === "finished") break;
      if (status === "error") {
        return jsonError("Conversion failed on CloudConvert.", 502);
      }

      await sleep(1000);
    }

    if (status !== "finished") {
      return jsonError("Conversion timed out. Try a smaller file.", 504);
    }

    // 5) Get export URL
    const exportTask = findTask(latestJob.data.tasks, "export-file");
    const fileUrl = exportTask?.result?.files?.[0]?.url;
    if (!fileUrl) return jsonError("Export URL not found.", 502);

    // 6) Fetch converted file and stream back
    const outRes = await fetch(fileUrl);
    if (!outRes.ok) {
      const text = await outRes.text();
      return jsonError(`Failed to fetch converted file: ${text}`, 502);
    }

    const arrayBuf = await outRes.arrayBuffer();

    const base = stripExt(file.name);
    const outName = `${base}-converted.${cfg.outputExt}`;

    return new Response(arrayBuf, {
      status: 200,
      headers: {
        "content-type": cfg.outputMime,
        "content-disposition": `attachment; filename="${outName}"`,
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Server error.", 500);
  }
}
