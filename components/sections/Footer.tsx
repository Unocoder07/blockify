import { Github, Twitter, Mail } from "lucide-react";
import { SITE, SOCIALS, NAV_LINKS, FOOTER_LINKS } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = 2026; // TODO: set dynamically at build if desired

  return (
    <footer className="relative border-t border-white/[0.06] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {SITE.description}
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href={SOCIALS.github} label="GitHub">
                <Github className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={SOCIALS.twitter} label="Twitter / X">
                <Twitter className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={SOCIALS.email} label="Email">
                <Mail className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Built for deep work.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-accent-500/40 hover:bg-accent-500/10 hover:text-white"
    >
      {children}
    </a>
  );
}
