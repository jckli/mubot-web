'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Server, Activity, Users, Clock } from 'lucide-react';

interface ShardInfo {
  id: number;
  status: string;
  latency: number;
  servers: number;
  users: number;
}

interface StatusData {
  uptime: string;
  memory_usage_mb: number;
  total_servers: number;
  total_users: number;
  shards: ShardInfo[];
}

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StatusPage() {
  const { data, error, isLoading } = useSWR<StatusData>(
    '/api/status',
    fetcher,
    { refreshInterval: 5000 }
  );

  const loading = isLoading || (!data && !error);
  
  const sortedShards = data?.shards ? [...data.shards].sort((a, b) => a.id - b.id) : [];

  return (
    <main className="min-h-dvh flex flex-col p-4">
      {/* Top Left Navigation */}
      <div className="absolute top-4 left-4">
        <Link 
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-center py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-kgcs mb-2">Tsuuchi Status</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            All systems operational
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-secondary rounded-xl"></div>
            <div className="h-64 bg-secondary rounded-xl"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Global Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="p-4 rounded-xl border bg-card text-card-foreground">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Global Uptime</span>
                </div>
                <div className="text-lg font-bold">{data?.uptime}</div>
              </div>
              
              <div className="p-4 rounded-xl border bg-card text-card-foreground">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Server className="w-4 h-4" />
                  <span className="text-xs font-medium">Total Servers</span>
                </div>
                <div className="text-lg font-bold">{data?.total_servers.toLocaleString()}</div>
              </div>

              <div className="p-4 rounded-xl border bg-card text-card-foreground">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Total Users</span>
                </div>
                <div className="text-lg font-bold">{data?.total_users.toLocaleString()}</div>
              </div>

              <div className="p-4 rounded-xl border bg-card text-card-foreground">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-medium">Memory Usage</span>
                </div>
                <div className="text-lg font-bold">{data?.memory_usage_mb} MB</div>
              </div>

              <div className="p-4 rounded-xl border bg-card text-card-foreground">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Server className="w-4 h-4 opacity-50" />
                  <span className="text-xs font-medium">Total Shards</span>
                </div>
                <div className="text-lg font-bold">{data?.shards.length}</div>
              </div>
            </div>

            {/* Shard Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium">Shard ID</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Latency</th>
                      <th className="px-6 py-3 font-medium text-right">Servers</th>
                      <th className="px-6 py-3 font-medium text-right">Users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedShards.map((shard) => (
                      <tr key={shard.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">
                          {shard.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${shard.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${shard.status === 'Ready' ? 'bg-emerald-500' : 'bg-destructive'}`}></span>
                            {shard.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {shard.latency}ms
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          {shard.servers.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          {shard.users.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Floating Bottom Footer */}
      <div className="mt-auto pt-8 pb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">Terms</Link>
        <span className="opacity-50">•</span>
        <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">Privacy</Link>
      </div>
    </main>
  );
}
