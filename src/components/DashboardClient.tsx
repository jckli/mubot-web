"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { DashboardScope, MangaCard } from "../lib/dashboard-types";

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.2 } }),
};

const CardSkeletons = () =>
  Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="overflow-hidden rounded-xl border border-border/60 bg-card/60 animate-pulse">
      <div className="aspect-[3/4] bg-secondary/50" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-4/5 rounded bg-secondary/70" />
        <div className="h-3 w-1/2 rounded bg-secondary/50" />
      </div>
    </div>
  ));

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantedScope = searchParams.get("scope");
  const [scope, setScope] = useState<string | null>(wantedScope);
  const {
    data: scopes,
    error: scopesError,
    isLoading: isScopesLoading,
  } = useSWR<DashboardScope[]>("/api/dashboard/scopes", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!scopes?.length) return;
    const wanted = scopes.find((s) => s.scope === wantedScope)?.scope;
    setScope((current) =>
      wanted || scopes.find((s) => s.scope === current)?.scope || scopes[0].scope,
    );
  }, [scopes, wantedScope]);

  const mangaKey = scope ? `/api/dashboard/manga?scope=${encodeURIComponent(scope)}` : null;
  const {
    data: cards,
    error: cardsError,
    isLoading: isCardsLoading,
  } = useSWR<MangaCard[]>(mangaKey, fetcher, {
    revalidateOnFocus: false,
  });
  const active = useMemo(() => scopes?.find((s) => s.scope === scope), [scope, scopes]);

  const onScope = (next: string) => {
    if (next === scope) return;
    setScope(next);
    router.replace(`/dashboard?scope=${encodeURIComponent(next)}`, { scroll: false });
  };

  const rail = (items: DashboardScope[], mobile = false) => (
    <div
      className={`${
        mobile
          ? "flex overflow-x-auto gap-2 p-2"
          : "sticky top-4 flex flex-col gap-2 p-2 w-20 shrink-0"
      } rounded-2xl border border-border/60 bg-secondary/30`}
    >
      {items.map((s) => {
        const isActive = s.scope === scope;
        return (
          <motion.button
            key={s.scope}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onScope(s.scope)}
            className={`relative group flex ${mobile ? "min-w-12" : "w-full"} flex-col items-center gap-1 rounded-xl border px-2 py-2 text-[11px] transition-colors ${
              isActive
                ? "border-primary/50 bg-primary/15 text-foreground"
                : "border-border/40 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            title={s.label}
          >
            {s.iconUrl ? (
              <Image
                src={s.iconUrl}
                alt={s.label}
                width={32}
                height={32}
                className="rounded-md"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            )}
            <span className="truncate max-w-full">{s.type === "user" ? "Me" : s.label}</span>
          </motion.button>
        );
      })}
      <Link
        href="/"
        className={`group mt-1 flex ${mobile ? "min-w-12" : "w-full"} flex-col items-center gap-1 rounded-xl border border-border/40 bg-card/40 px-2 py-2 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors`}
      >
        <LogOut className="w-4 h-4" />
        <span>Home</span>
      </Link>
    </div>
  );

  const railSkeleton = (mobile = false) => (
    <div
      className={`${
        mobile
          ? "flex overflow-x-auto gap-2 p-2"
          : "sticky top-4 flex flex-col gap-2 p-2 w-20 shrink-0"
      } rounded-2xl border border-border/60 bg-secondary/30`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${mobile ? "min-w-12" : "w-full"} flex-col items-center gap-1 rounded-xl border border-border/40 bg-card/40 px-2 py-2 animate-pulse`}
        >
          <div className="w-8 h-8 rounded-md bg-secondary" />
          <div className="h-3 w-8 rounded bg-secondary" />
        </div>
      ))}
    </div>
  );

  if (scopesError || (!isScopesLoading && !scopes?.length)) {
    return (
      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto mt-8 rounded-xl border border-border/60 bg-secondary/30 p-6 text-center text-muted-foreground">
          {scopesError ? "Unable to load your accessible lists." : "No accessible lists were found for this account."}
        </div>
      </main>
    );
  }

  const isLoadingCards = !scope || isCardsLoading;
  return (
    <main className="flex-1 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="md:hidden">{scopes ? rail(scopes, true) : railSkeleton(true)}</div>
        <div className="flex gap-4">
          <div className="hidden md:block">{scopes ? rail(scopes) : railSkeleton()}</div>
          <div className="flex-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border/60 bg-secondary/30 p-4"
            >
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {isScopesLoading
                  ? "Loading your manga lists…"
                  : active?.type === "user"
                    ? "Your personal manga list"
                    : active?.label}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={scope || "loading"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {isLoadingCards
                  ? <CardSkeletons />
                  : cards?.map((m, i) => (
                      <motion.a
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        key={m.id}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl border border-border/60 bg-card/60 overflow-hidden hover:bg-accent/40 transition-colors"
                      >
                        <div className="relative aspect-[3/4] bg-secondary/40">
                          {m.coverUrl ? (
                            <Image
                              src={m.coverUrl}
                              alt={m.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-3">
                          <div className="font-semibold line-clamp-2">{m.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {m.author}
                          </div>
                        </div>
                      </motion.a>
                    ))}
              </motion.div>
            </AnimatePresence>
            {!isLoadingCards && !cards?.length ? (
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
                {cardsError ? "Unable to load this list." : "No manga found in this list yet."}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
