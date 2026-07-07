import { cn } from "@/lib/utils";
import { initialsFor } from "@/lib/testimonials";

interface AvatarProps {
  name: string;
  photo?: string;
  /** Pixel size of the square avatar. */
  size?: number;
  className?: string;
}

/**
 * Circular avatar — shows the uploaded photo when present, otherwise a
 * gradient tile with the person's initials.
 */
export function Avatar({ name, photo, size = 44, className }: AvatarProps) {
  const dimension = { width: size, height: size };

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URLs aren't valid for next/image
      <img
        src={photo}
        alt={name}
        style={dimension}
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-white/10",
          className
        )}
      />
    );
  }

  return (
    <span
      style={dimension}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-fuchsia-500 font-semibold text-white",
        className
      )}
    >
      <span style={{ fontSize: size * 0.36 }}>{initialsFor(name)}</span>
    </span>
  );
}
