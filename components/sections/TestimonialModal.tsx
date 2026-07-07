"use client";


import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import {
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  type TestimonialInput,
} from "@/lib/testimonials";

interface TestimonialModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after a successful submission. */
  onSubmitted?: () => void;
}

/**
 * Downscale a selected image to a small square JPEG data-URL so it stays well
 * under the server's size cap and never bloats the store.
 */
function fileToDataUrl(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That image could not be loaded."));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Image processing failed."));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const EMPTY = {
  name: "",
  company: "",
  role: "",
  rating: 0,
  message: "",
};

export function TestimonialModal({
  open,
  onClose,
  onSubmitted,
}: TestimonialModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset the form whenever the modal is (re)opened.
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setPhoto("");
      setStatus("idle");
      setError("");
      // Focus the first field once the dialog is painted.
      const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
      setError("");
    } catch {
      setError("Sorry, that image couldn't be processed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Please enter your full name.";
    if (form.rating < 1) return "Please choose a star rating.";
    if (form.message.trim().length < MESSAGE_MIN)
      return `Feedback must be at least ${MESSAGE_MIN} characters.`;
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStatus("loading");

    const payload: TestimonialInput = {
      name: form.name.trim(),
      company: form.company.trim() || undefined,
      role: form.role.trim() || undefined,
      rating: form.rating,
      message: form.message.trim(),
      photo: photo || undefined,
    };

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
      onSubmitted?.();
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-md transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-ink-soft/95 shadow-card backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {status === "done" ? (
              <div className="flex flex-col items-center px-8 py-14 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/15 text-accent-300"
                >
                  <Check className="h-8 w-8" />
                </motion.div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Thank you for sharing!
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                  Your testimonial has been posted and is now live on the site.
                  Thanks for sharing your experience!
                </p>
                <Button className="mt-8" onClick={onClose}>
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8">
                <h3
                  id="testimonial-modal-title"
                  className="text-2xl font-semibold tracking-tight text-white"
                >
                  Share your experience
                </h3>
                <p className="mt-1.5 text-sm text-white/55">
                  Tell others how Blockify has helped you focus.
                </p>

                {/* Photo + rating row */}
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-white/20 bg-white/[0.03] transition-colors hover:border-accent-500/50"
                    aria-label="Upload profile photo"
                  >
                    {photo ? (
                      <Avatar name={form.name || "You"} photo={photo} size={64} />
                    ) : (
                      <ImagePlus className="h-6 w-6 text-white/40 transition-colors group-hover:text-accent-300" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Profile photo
                    </p>
                    <p className="text-xs text-white/45">
                      Optional · square image works best
                    </p>
                    {photo && (
                      <button
                        type="button"
                        onClick={() => setPhoto("")}
                        className="mt-1 text-xs text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="tm-name"
                      className="mb-1.5 block text-sm font-medium text-white/80"
                    >
                      Full name <span className="text-accent-400">*</span>
                    </label>
                    <input
                      id="tm-name"
                      ref={firstFieldRef}
                      value={form.name}
                      maxLength={NAME_MAX}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jane Doe"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="tm-company"
                        className="mb-1.5 block text-sm font-medium text-white/80"
                      >
                        Company{" "}
                        <span className="text-white/35">(optional)</span>
                      </label>
                      <input
                        id="tm-company"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Acme Inc."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tm-role"
                        className="mb-1.5 block text-sm font-medium text-white/80"
                      >
                        Role <span className="text-white/35">(optional)</span>
                      </label>
                      <input
                        id="tm-role"
                        value={form.role}
                        onChange={(e) => update("role", e.target.value)}
                        placeholder="Product Designer"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-white/80">
                      Your rating <span className="text-accent-400">*</span>
                    </span>
                    <StarRating
                      value={form.rating}
                      onChange={(r) => update("rating", r)}
                      size={30}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tm-message"
                      className="mb-1.5 block text-sm font-medium text-white/80"
                    >
                      Feedback <span className="text-accent-400">*</span>
                    </label>
                    <textarea
                      id="tm-message"
                      value={form.message}
                      maxLength={MESSAGE_MAX}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Blockify has completely changed how I work…"
                      rows={4}
                      className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur-md transition-colors focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
                      required
                    />
                    <p className="mt-1 text-right text-xs text-white/35">
                      {form.message.length}/{MESSAGE_MAX}
                    </p>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="sm:w-auto"
                  >
                    {status === "loading" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {status === "loading" ? "Submitting…" : "Submit testimonial"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
