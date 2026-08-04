"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Ellipsis, LogOut, Trash2, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { DashboardScope, MangaCard } from "../lib/dashboard-types";
import { ManagementState } from "../lib/dashboard-types";
import DashboardManager, { MangaActions } from "./DashboardManager";
import DashboardSheet from "./DashboardSheet";

const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.2 } }),
};

const mangaCoverUrl = (url: string) => url.replace(/\/x(250|350)@1\//, "/x$1@2/");

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

const MobileCardSkeletons = () =>
  Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="flex h-20 animate-pulse gap-3 rounded-xl border border-border/60 bg-card/60 p-2">
      <div className="w-12 rounded-md bg-secondary/50" /><div className="flex-1 space-y-2 py-1"><div className="h-4 w-4/5 rounded bg-secondary/70" /><div className="h-3 w-1/2 rounded bg-secondary/50" /></div>
    </div>
  ));

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantedScope = searchParams.get("scope");
  const [scope, setScope] = useState<string | null>(wantedScope);
  const [selectedManga, setSelectedManga] = useState<MangaCard | null>(null);
  const [deletingManga, setDeletingManga] = useState<MangaCard | null>(null);
  const [detailsManga, setDetailsManga] = useState<MangaCard | null>(null);
  const [actionsManga, setActionsManga] = useState<MangaCard | null>(null);
  const [groupBusyMangaId, setGroupBusyMangaId] = useState<number | null>(null);
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
    mutate: mutateCards,
  } = useSWR<MangaCard[]>(mangaKey, fetcher, {
    revalidateOnFocus: false,
  });
  const managementKey = scope ? `/api/dashboard/management?scope=${encodeURIComponent(scope)}` : null;
  const { data: management, mutate: mutateManagement } = useSWR<ManagementState>(managementKey, fetcher, {
    revalidateOnFocus: false,
  });
  const active = useMemo(() => scopes?.find((s) => s.scope === scope), [scope, scopes]);

  const onScope = (next: string) => {
    if (next === scope) return;
    setSelectedManga(null);
    setDeletingManga(null);
    setDetailsManga(null);
    setActionsManga(null);
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
                unoptimized
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
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-semibold">Dashboard</h1><p className="text-sm text-muted-foreground">
                {isScopesLoading ? "Loading your manga lists…" : active?.type === "user" ? "Your personal manga list" : active?.label}
              </p></div>{scope ? <DashboardManager scope={scope} state={management} cards={cards} mutateCards={mutateCards} mutateState={mutateManagement} selectedManga={selectedManga} deletingManga={deletingManga} detailsManga={detailsManga} onCloseGroup={() => setSelectedManga(null)} onCloseDelete={() => setDeletingManga(null)} onCloseDetails={() => setDetailsManga(null)} onGroupBusyChange={setGroupBusyMangaId} /> : null}</div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${scope || "loading"}-mobile`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 sm:hidden"
              >
                {isLoadingCards ? <MobileCardSkeletons /> : cards?.map((m, i) => <motion.article custom={i} variants={cardVariants} initial="hidden" animate="show" key={m.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-2 transition-colors active:bg-accent/50"><button type="button" onClick={() => setDetailsManga(m)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md bg-secondary/40">{m.coverUrl ? <Image src={mangaCoverUrl(m.coverUrl)} sizes="44px" alt={m.title} fill priority={i < 4} unoptimized className="object-cover" /> : null}</div><div className="min-w-0"><div className="line-clamp-2 font-semibold leading-tight">{m.title}</div><div className="mt-1 line-clamp-1 text-sm text-muted-foreground">{m.author}</div>{m.groupName && m.groupName !== "All" ? <div className="mt-1 line-clamp-1 text-xs text-primary/80">{m.groupName}</div> : null}</div></button>{management?.canEdit ? <button type="button" aria-label={`Actions for ${m.title}`} onClick={() => setActionsManga(m)} className="shrink-0 rounded-lg p-2 text-muted-foreground active:bg-accent active:text-foreground"><Ellipsis className="size-5" /></button> : null}</motion.article>)}
              </motion.div>
              <motion.div
                key={scope || "loading"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="hidden grid-cols-2 gap-4 sm:grid lg:grid-cols-3 xl:grid-cols-4"
              >
                {isLoadingCards
                  ? <CardSkeletons />
                  : cards?.map((m, i) => (
                      <motion.article
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="show"
                        key={m.id}
                        className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 transition-colors hover:bg-accent/40"
                      >
                        <button type="button" onClick={() => setDetailsManga(m)} className="block w-full text-left">
                        <div className="relative aspect-[3/4] bg-secondary/40">
                          {m.coverUrl ? (
                            <Image
                              src={mangaCoverUrl(m.coverUrl)}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              alt={m.title}
                              fill
                              priority={i < 4}
                              unoptimized
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-3">
                          <div className="font-semibold line-clamp-2">{m.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {m.author}
                          </div>
                          {m.groupName && m.groupName !== "All" ? (
                            <div className="mt-1 text-xs text-primary/80 line-clamp-1">{m.groupName}</div>
                          ) : null}
                        </div>
                        </button>
                        {management?.canEdit ? <MangaActions manga={m} loading={groupBusyMangaId === m.id} onGroup={() => setSelectedManga(m)} onRemove={() => setDeletingManga(m)} /> : null}
                      </motion.article>
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
      <DashboardSheet open={!!actionsManga} title={actionsManga?.title || "Manga actions"} onClose={() => setActionsManga(null)}>{actionsManga ? <div className="space-y-2"><button onClick={() => { setActionsManga(null); setSelectedManga(actionsManga); }} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-accent"><UsersRound className="size-4 text-muted-foreground" />Set scanlator</button><button onClick={() => { setActionsManga(null); setDeletingManga(actionsManga); }} className="flex w-full items-center gap-3 rounded-lg p-3 text-left text-destructive hover:bg-destructive/10"><Trash2 className="size-4" />Remove manga</button></div> : null}</DashboardSheet>
    </main>
  );
}
