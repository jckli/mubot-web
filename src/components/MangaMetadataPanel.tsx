import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";

export type MangaMetadata = {
  id: number;
  mangabaka_id?: number | null;
  title: string;
  description?: string | null;
  year?: string | null;
  rating?: number | null;
  kind?: string | null;
  status?: string | null;
  latest_chapter?: string | null;
  authors: string[];
  artists: string[];
  cover_url?: string | null;
};

const metadataButton = "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent";
const label = (value: string) => value.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function Description({ value }: { value: string }) {
  return <Markdown components={{ p: ({ children }) => <p className="mb-3 text-sm leading-6 text-muted-foreground last:mb-0">{children}</p>, ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground last:mb-0">{children}</ul>, ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-muted-foreground last:mb-0">{children}</ol> }}>{value}</Markdown>;
}

export default function MangaMetadataPanel({ manga }: { manga: MangaMetadata }) {
  const chapterLabel = manga.status?.toLowerCase() === "completed" ? "Total chapters" : "Latest chapter";
  const details = [
    manga.kind && ["Type", label(manga.kind)],
    manga.year && ["Year", manga.year],
    manga.rating != null && ["Rating", manga.rating.toFixed(2)],
    manga.status && ["Status", label(manga.status)],
    manga.latest_chapter && [chapterLabel, manga.latest_chapter],
    manga.authors.length && ["Author", manga.authors.join(", ")],
    manga.artists.length && ["Artist", manga.artists.join(", ")],
  ].filter(Boolean) as [string, string][];

  return <div className="space-y-5">
    <div className="flex gap-4">
      {manga.cover_url ? <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-secondary/40"><Image src={manga.cover_url} alt={`Cover for ${manga.title}`} fill sizes="96px" unoptimized className="object-cover" /></div> : null}
      <div className="min-w-0 space-y-2"><h3 className="text-lg font-semibold leading-tight">{manga.title}</h3>{details.length ? <dl className="space-y-1 text-sm text-muted-foreground">{details.map(([name, value]) => <div key={name}><dt className="sr-only">{name}</dt><dd><span className="text-foreground">{name}:</span> {value}</dd></div>)}</dl> : null}</div>
    </div>
    {manga.description ? <Description value={manga.description} /> : null}
    <div className="flex flex-wrap gap-2"><a href={`https://www.mangaupdates.com/series/${manga.id.toString(36)}`} target="_blank" rel="noreferrer" className={metadataButton}>MangaUpdates<ExternalLink className="size-3.5" /></a>{manga.mangabaka_id ? <a href={`https://mangabaka.org/${manga.mangabaka_id}`} target="_blank" rel="noreferrer" className={metadataButton}>MangaBaka<ExternalLink className="size-3.5" /></a> : null}</div>
  </div>;
}
