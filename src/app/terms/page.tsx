import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service agreement for Tsuuchi Discord Manga Updates Bot.",
};

export default function TermsPage() {
  return (
    <main className="flex-1 flex flex-col pt-24 pb-12 px-4 md:px-6 max-w-xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-border/50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: 2026
          </p>
        </div>
      </div>

      <div className="space-y-8 text-sm">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Terms of Service (“Terms”) is a legal agreement between you and the Tsuuchi team (“we”, “us”, “our”). By using the Tsuuchi application (“Application”), you agree to these Terms. You acknowledge that you have read these Terms and agree to be bound by them.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            If you do not agree with (or cannot comply with) these Terms, you may not use the Application.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. Access to External Resources</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Service utilizes external resources, including content, data, links, and tools (“External Resources”), from third parties (such as MangaUpdates). External Resources are not under our control and we are not responsible for their availability or accuracy.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            In particular, the Application&apos;s main functions use third-party information to display manga chapter updates. The Tsuuchi team does not control or moderate images or third-party links displayed via external providers.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. Use by Minors</h2>
          <p className="text-muted-foreground leading-relaxed">
            Though use by minors is permitted, since the Tsuuchi team does not moderate the manga tracked by the bot, it is the responsibility of the user to ensure that titles tracked by the bot are appropriate for minors.
          </p>
          <div className="mt-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 text-amber-800 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-xs">
              If you are under the age of 18, you are prohibited from adding adult / 18+ manga to the bot and tracking them. Server owners must enforce NSFW channel flags.
            </span>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">4. Disclaimer of Warranty</h2>
          <p className="text-muted-foreground leading-relaxed uppercase text-xs">
            THESE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. THE TSUUCHI TEAM DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">5. Changes to Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to withdraw or amend our Application, and any service or material we provide via Application, in our sole discretion without notice. We will not be liable if for any reason all or any part of Application is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Application, or the entire Application, to users and servers.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">6. Amendments To Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically. Your continued use of the Application after any such changes constitutes your binding acceptance of the new Terms. If you do not agree to the new terms, you are no longer authorized to use Service.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">7. Acknowledgement</h2>
          <p className="text-muted-foreground leading-relaxed uppercase text-xs">
            BY USING THIS APPLICATION OR OTHER APPLICATION PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">8. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions, feedback, or requests, please contact us by email at: <a className="text-primary hover:underline" href="mailto:jack@jackli.dev">jack@jackli.dev</a>
          </p>
        </section>
      </div>
    </main>
  );
}
