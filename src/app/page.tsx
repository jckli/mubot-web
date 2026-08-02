'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Github, Activity } from 'lucide-react';
import PillButton from '../components/PillButton';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function DiscordIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function Home() {
  const { data: statusData, error: statusError } = useSWR(
    '/api/status',
    fetcher,
    { refreshInterval: 60000 }
  );

  const isOnline = !!statusData && !statusError;

  return (
    <main className="flex-1 flex flex-col p-4">
      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center max-w-xl mx-auto w-full pt-8">
        
        {/* Avatar with Status Dot */}
        <div className="w-20 h-20 relative mb-2">
          <Image
            src="https://cdn.discordapp.com/avatars/880694914365685781/afbcd6184ee3b21f2887d7c08c95a899.png?size=1024"
            alt="Tsuuchi Logo"
            width={80}
            height={80}
            className="rounded-2xl border shadow-sm"
          />
          <div 
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${isOnline ? 'bg-emerald-500' : 'bg-destructive'}`}
            title={isOnline ? "All Systems Operational" : "Outage Detected"}
          />
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h1 className="text-3xl font-kgcs text-foreground tracking-wide">Tsuuchi 通知</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Track your favorite mangas, manhwas, or webtoons and get every new chapter sent to you instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full sm:w-auto">
          <PillButton 
            href="https://jackli.dev/mangaupdates" 
            variant="primary"
          >
            <span className="font-semibold">Invite Tsuuchi</span>
            <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </PillButton>

          <PillButton href="https://discord.gg/UcYspqftTF">
            <MessageCircle className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>Support</span>
          </PillButton>

          <PillButton href="https://github.com/jckli/mangaupdates-bot">
            <Github className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>GitHub</span>
          </PillButton>

        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <PillButton
            href="/api/auth/discord/start"
            isExternal={false}
            className="border-input bg-indigo-500/90 text-white hover:bg-indigo-500 hover:text-white dark:bg-indigo-500/80 dark:hover:bg-indigo-500"
          >
            <DiscordIcon className="h-4 w-4" />
            <span>Login with Discord</span>
          </PillButton>

          <Link
            href="/status"
            className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Activity className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>View Bot Status</span>
          </Link>
        </div>

        {/* Simple Features Box */}
        <div className="w-full text-left mt-8 p-5 rounded-xl border border-border/60 bg-secondary/30">
          <h2 className="text-sm font-semibold mb-3">Key Features</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside marker:text-primary/70">
            <li><strong>Wide Compatibility:</strong> Track practically any manga, manhwa, or doujin seamlessly powered by MangaUpdates.</li>
            <li><strong>Scan Group Filters:</strong> Tailor your alerts to only notify you when your preferred scanlation groups release.</li>
            <li><strong>Custom Routing:</strong> Direct alerts to specific channels with custom role pings.</li>
            <li><strong>Personal Notifications:</strong> Get chapter updates sent directly to your DMs for private tracking.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
