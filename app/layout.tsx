import Link from "next/link";
import type { ReactNode } from "react";
import KeyboardUse from "../components/KeyboardUse";
import { LIVE_MESSAGE_ID } from "./constants";
import { TEXT } from "./text";
import "./globals.css";

export const metadata = { title: TEXT.siteTitle, description: TEXT.siteDescription };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KeyboardUse />

        <a href="#main" className="skip-link">
          {TEXT.skipLink}
        </a>

        <div className="site-header">
          <div className="wrap site-header__inner">
            <Link href="/air/search" className="brand">
              {TEXT.siteName}
            </Link>
            <div className="site-nav">
              <Link href="/air/search">{TEXT.nav.search}</Link>
              <Link href="/air/flights/karachi-to-dubai">{TEXT.nav.karachiDubai}</Link>
            </div>
          </div>
        </div>

        {/* an empty box that screen readers watch. Announce in RetryAndAnnounce.tsx fills it in */}
        <div id={LIVE_MESSAGE_ID} role="status" aria-live="polite" className="sr-only" />

        <div id="main" role="main" tabIndex={-1} className="wrap">
          {children}
        </div>
      </body>
    </html>
  );
}
