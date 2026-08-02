'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Github, Activity, LogIn } from 'lucide-react';
import PillButton from '../components/PillButton';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

        {/* Tomomai-style pill buttons */}
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

          <PillButton href="/api/auth/discord/start" isExternal={false}>
            <LogIn className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>Login with Discord</span>
          </PillButton>
        </div>

        {/* Status Link directly below main buttons */}
        <Link 
          href="/status"
          className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          <Activity className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>View Bot Status</span>
        </Link>

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
