import { FileText } from "lucide-react";
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

type Props = {
  title: string;
  subtitle?: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rightSlot?: React.ReactNode;
};

/**
 * Panel editor (textarea) untuk Input & Output.
 * Output dibuat readOnly agar user tidak bingung mana yang sumber vs hasil.
 *
 * Opsi UI:
 * 1) "Lined paper" background agar area tidak terlihat kosong.
 * 2) Empty-state overlay khusus Output saat masih kosong.
 */
export function EditorPanel({
  title,
  subtitle,
  value,
  onChange,
  readOnly,
  placeholder,
  rightSlot,
}: Props) {
  const showEmptyOverlay = Boolean(readOnly && !value.trim());

  return (
    <section
      className="
        flex flex-col overflow-hidden rounded-2xl
        border border-[color:var(--border)]
        bg-[color:var(--surface)]
        shadow-[var(--shadow)]
      "
    >
      <header
        className="
          flex items-center justify-between gap-3
          border-b border-[color:var(--border)]
          px-4 py-3
        "
      >
        <div className="flex items-start gap-2">
          <div
            className="
              mt-0.5 rounded-xl
              border border-[color:var(--border)]
              bg-[color:var(--surface2)]
              p-2
            "
          >
            <FileText className="h-4 w-4 text-[color:var(--muted)]" />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-[color:var(--text)]">
              {title}
            </div>

            {subtitle ? (
              <div className="text-xs text-[color:var(--muted)]">
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        {rightSlot ? (
          <div className="shrink-0 text-xs text-[color:var(--muted)]">
            {rightSlot}
          </div>
        ) : null}
      </header>

      {/* Wrapper dibuat relative untuk overlay empty-state */}
      <div className="relative flex-1 p-3">
        <textarea
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={[
            geistMono.className,
            `
              h-[360px] w-full resize-none rounded-xl
              border border-[color:var(--border)]
              p-4 text-sm leading-relaxed
              text-[color:var(--text)]
              outline-none transition
              hover:border-[color:var(--accent)]
              focus:border-[color:var(--primary)]
              focus:ring-2 focus:ring-[color:var(--ring)]
            `,
            /**
             * Opsi 1: Lined paper background
             * (repeating-linear-gradient halus agar area editor tidak kosong)
             */
            `
              bg-[repeating-linear-gradient(
                to_bottom,
                var(--surface2),
                var(--surface2) 28px,
                rgba(0,0,0,0.03) 29px
              )]
            `,
            readOnly ? "opacity-95" : "",
          ].join(" ")}
        />

        {/* Opsi 2: Empty-state overlay khusus Output */}
        {showEmptyOverlay ? (
          <div
            className="
              pointer-events-none absolute inset-0
              flex items-center justify-center
              px-6 text-center
            "
          >
            <div
              className="
                rounded-2xl
                border border-dashed border-[color:var(--border)]
                bg-[color:var(--surface)]
                px-6 py-4
                shadow-sm
              "
            >
              <div className="mb-1 text-sm font-semibold text-[color:var(--text)]">
                Belum ada hasil
              </div>
              <div className="text-xs text-[color:var(--muted)]">
                Pilih format lalu klik{" "}
                <span className="font-semibold text-[color:var(--primary)]">
                  Convert
                </span>
                .
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
