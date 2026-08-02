'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ExternalLink } from 'lucide-react';
import { useLanyard } from 'use-lanyard';

const DISCORD_ID = "326498384758308875";

export default function Footer() {
  const lanyard = useLanyard(DISCORD_ID);
  const user = lanyard.data?.discord_user;
  const status = lanyard.data?.discord_status || 'offline';

  const [gitInfo, setGitInfo] = useState<{version: string, commit: string} | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('https://api.github.com/repos/jckli/mangaupdates-bot/tags').then(r => r.json()),
      fetch('https://api.github.com/repos/jckli/mangaupdates-bot/commits/master').then(r => r.json())
    ]).then(([tags, commit]) => {
      const latestTag = tags[0]?.name || 'v3.0.0';
      const hash = commit.sha ? commit.sha.substring(0, 7) : '';
      if (hash) setGitInfo({ version: latestTag, commit: hash });
    }).catch(console.error);
  }, []);

  const statusColors: Record<string, string> = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-zinc-500'
  };

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    : 'https://cdn.discordapp.com/avatars/880694914365685781/afbcd6184ee3b21f2887d7c08c95a899.png?size=256';

  return (
    <div className="mt-auto pt-12 pb-4 flex flex-col items-center gap-4 w-full">
      <div className="flex flex-col items-center gap-2">
        <a 
          href="https://github.com/jckli" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-secondary hover:bg-accent px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-all"
        >
          <div className="relative flex items-center">
            <Image
              src={avatarUrl}
              alt="Developer Avatar"
              width={20}
              height={20}
              className="rounded-full"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${statusColors[status] || 'bg-zinc-500'}`}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1.5">
              developed with <Heart className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> by <span className="font-semibold text-foreground/90 group-hover:text-foreground">@jckli</span>
            </span>
          </div>
          <ExternalLink className="h-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">
          Terms
        </Link>
        <span className="opacity-50">•</span>
        <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">
          Privacy
        </Link>
        <span className="opacity-50">•</span>
        <a
          href="https://mangabaka.org/data/database"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline transition-colors"
        >
          Metadata: MangaBaka + MangaUpdates
        </a>

        {gitInfo && (
          <>
            <span className="opacity-50">•</span>
            <a 
              href={`https://github.com/jckli/mangaupdates-bot/commit/${gitInfo.commit}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors font-mono"
            >
              {gitInfo.version} ({gitInfo.commit})
            </a>
          </>
        )}
      </div>
    </div>
  );
}
