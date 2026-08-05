import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GenericPageHeader from "../../components/GenericPageHeader";

export const metadata: Metadata = {
  title: "Tsuuchi",
  description: "Privacy Policy and data collection guidelines for Tsuuchi Discord Manga Updates Bot.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 flex flex-col pt-24 pb-12 px-4 md:px-6 max-w-xl mx-auto w-full space-y-8">
      {/* Header */}
      <GenericPageHeader 
        title="Privacy Policy"
        subtitle="Data collection, storage, and deletion practices."
      />

      <div className="space-y-8 text-sm">
        {/* Intro */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tsuuchi was developed as an open source application provided at no cost. This page informs users regarding our policies with the collection, use, and disclosure of Personal Information.
          </p>
        </section>

        {/* Collection */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. Information Collection & Use</h2>
          <p className="text-muted-foreground leading-relaxed">
            We store a minimal amount of data required to deliver notifications:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
            <li>Discord Server IDs & Target Channel IDs</li>
            <li>User IDs (for DM update notifications)</li>
            <li>Tracked Manga Titles & MangaUpdates IDs</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We <strong className="font-semibold text-foreground">do not</strong> store any personal information like usernames, profile pictures, or chat messages. All server watchlist data is stored securely in MongoDB database clusters.
          </p>
        </section>

        {/* Deletion */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. Data Deletion</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can remove your server or user data instantly through either of these methods:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
            <li><strong className="font-semibold text-foreground">Slash Command:</strong> Run the deletion commands provided by the bot.</li>
            <li><strong className="font-semibold text-foreground">Kick Bot:</strong> Removing or kicking Tsuuchi from your server automatically clears server configuration data.</li>
          </ul>
        </section>

      </div>
    </main>
  );
}
