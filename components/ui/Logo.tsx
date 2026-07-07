import Image from "next/image";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Show the "Blockify" wordmark next to the icon. */
  showWordmark?: boolean;
  /** Pixel size of the square logo mark. */
  size?: number;
  href?: string;
  className?: string;
}

/**
 * The single source of truth for the Blockify logo across the site.
 *
 * ── HOW TO CHANGE THE LOGO ────────────────────────────────────────────────
 *  • Easiest: replace /public/logo.svg with your own image (keep it square).
 *  • Using a PNG/JPG? Drop it in /public and change `LOGO_SRC` below.
 *  • Change the brand text? Edit `SITE.name` in lib/constants.ts.
 * ──────────────────────────────────────────────────────────────────────────
 */
const LOGO_SRC = "/logo.png";

export function Logo({
  showWordmark = true,
  size = 32,
  href = "#top",
  className,
}: LogoProps) {
  const content = (


    <>
      <Image
        src={LOGO_SRC}
        alt={`${SITE.name} logo`}
        width={size}
        height={size}
        priority
        className="rounded-lg shadow-glow-sm"
      />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-white">
          {SITE.name}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={`${SITE.name} home`}
        className={cn("flex items-center gap-2", className)}
      >
        {content}
      </a>
    );
  }

  return <span className={cn("flex items-center gap-2", className)}>{content}</span>;
}
