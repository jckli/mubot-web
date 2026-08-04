"use client";

import { ArrowLeft, Check, Info, LoaderCircle, Plus, Settings2, ShieldAlert, Trash2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { KeyedMutator } from "swr";
import { DashboardRole, ManagementAction, ManagementState, MangaCard } from "../lib/dashboard-types";
import { useDebouncedValue } from "../lib/use-debounced-value";
import DashboardSelect from "./DashboardSelect";
import DashboardSheet from "./DashboardSheet";
import MangaMetadataPanel, { MangaMetadata } from "./MangaMetadataPanel";

type MangaSearch = { id: number; title: string; kind?: string; year?: string; rating?: number | null };
type Group = { group_id: number; name: string };
type Mode = "add" | "settings" | null;

const fetcher = <T,>(url: string) => fetch(url).then(async (response) => {
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
});

const button = "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-45";
const mangaSearchSummary = ({ kind, year, rating }: MangaSearch) => [kind && kind[0].toUpperCase() + kind.slice(1), year, rating != null && `Rating ${rating.toFixed(2)}`].filter(Boolean).join(" · ") || "Details unavailable";

export function MangaActions({ manga, loading, onGroup, onRemove }: { manga: MangaCard; loading?: boolean; onGroup: () => void; onRemove: () => void }) {
  return <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
    <button aria-label={`Set scanlator for ${manga.title}`} disabled={loading} onClick={onGroup} className="rounded-md border border-border/60 bg-card/90 p-1.5 text-muted-foreground hover:text-foreground disabled:cursor-wait"><>{loading ? <LoaderCircle className="size-3.5 animate-spin" /> : <UsersRound className="size-3.5" />}</></button>
    <button aria-label={`Remove ${manga.title}`} disabled={loading} onClick={onRemove} className="rounded-md border border-border/60 bg-card/90 p-1.5 text-muted-foreground hover:text-destructive disabled:cursor-wait"><Trash2 className="size-3.5" /></button>
  </div>;
}

export default function DashboardManager({ scope, state, cards, mutateCards, mutateState, selectedManga, deletingManga, detailsManga, onCloseGroup, onCloseDelete, onCloseDetails, onGroupBusyChange }: {
  scope: string;
  state?: ManagementState;
  cards?: MangaCard[];
  mutateCards: KeyedMutator<MangaCard[]>;
  mutateState: KeyedMutator<ManagementState>;
  selectedManga: MangaCard | null;
  deletingManga: MangaCard | null;
  detailsManga: MangaCard | null;
  onCloseGroup: () => void;
  onCloseDelete: () => void;
  onCloseDetails: () => void;
  onGroupBusyChange: (mangaId: number | null) => void;
}) {
  const [mode, setMode] = useState<Mode>(null);
  const [query, setQuery] = useState("");
  const [selectedSearch, setSelectedSearch] = useState<MangaSearch | null>(null);
  const debouncedQuery = useDebouncedValue(query);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const mangaKey = mode === "add" && debouncedQuery.trim().length >= 2 ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=manga&q=${encodeURIComponent(debouncedQuery.trim())}` : null;
  const rolesKey = mode === "settings" && scope.startsWith("server:") ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=roles&serverId=${scope.slice(7)}` : null;
  const { data: manga, error: mangaError, isValidating: isSearchingManga } = useSWR<MangaSearch[]>(mangaKey, fetcher, { keepPreviousData: true });
  const { data: roles, error: rolesError } = useSWR<DashboardRole[]>(rolesKey, fetcher);
  const run = async (action: ManagementAction, update?: (cards: MangaCard[]) => MangaCard[]) => {
    setError("");
    setSaving(true);
    try {
      if (update) await mutateCards((cards) => cards && update(cards), { revalidate: false });
      const response = await fetch(`/api/dashboard/management?scope=${encodeURIComponent(scope)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: unknown } | null;
        await mutateCards();
        throw new Error(typeof body?.error === "string" ? body.error : "Unable to save your change.");
      }
      await Promise.all([mutateCards(), mutateState()]);
    } finally {
      setSaving(false);
    }
  };
  const open = (next: Mode) => { setError(""); setQuery(""); setSelectedSearch(null); setMode(next); };
  const save = (action: ManagementAction, update?: (cards: MangaCard[]) => MangaCard[]) => run(action, update).then(() => setMode(null)).catch((err) => setError(err.message));

  const details = <MangaDetailsSheet scope={scope} manga={detailsManga} onClose={onCloseDetails} />;
  if (!state?.canEdit) return <>{state ? <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldAlert className="size-3.5" />{state.reason}{state.needsRoleConsent ? <a className="text-primary hover:underline" href="/api/auth/discord/start">Reconnect</a> : null}</div> : null}{details}</>;
  return <>
    <div className="flex flex-wrap gap-2">
      <button onClick={() => open("add")} className={button}><Plus className="size-4" />Add manga</button>
      {scope.startsWith("server:") ? <button onClick={() => open("settings")} className={button}><Settings2 className="size-4" />Settings</button> : null}
    </div>
    <AddMangaSheet scope={scope} open={mode === "add"} query={query} results={manga} selected={selectedSearch} exists={cards?.some((manga) => manga.id === selectedSearch?.id) || false} error={error} saving={saving} searching={query.trim().length >= 2 && (query.trim() !== debouncedQuery.trim() || isSearchingManga)} searchError={mangaError} onClose={() => setMode(null)} onQueryChange={setQuery} onSelect={setSelectedSearch} onBack={() => setSelectedSearch(null)} onConfirm={() => selectedSearch && save({ type: "add", mangaId: selectedSearch.id })} />
    <DashboardSheet open={mode === "settings"} title="Server settings" onClose={() => setMode(null)}><RoleSetting label="Ping role" value={state.pingRoleId} roles={roles} error={rolesError} saving={saving} onSet={(roleId) => save({ type: "setRole", roleType: "ping", roleId })} onClear={() => save({ type: "clearRole", roleType: "ping" })} />
      {state.canManageAdmin ? <RoleSetting label="Admin role" value={state.adminRoleId} roles={roles} error={rolesError} saving={saving} onSet={(roleId) => save({ type: "setRole", roleType: "admin", roleId })} onClear={() => save({ type: "clearRole", roleType: "admin" })} /> : <p className="mt-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">Only the server owner, a Discord administrator, or someone with Manage Server can change the admin role.</p>}{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</DashboardSheet>
    <GroupSheet scope={scope} manga={selectedManga} onClose={onCloseGroup} onBusyChange={onGroupBusyChange} mutateCards={mutateCards} />
    <DeleteSheet scope={scope} manga={deletingManga} onClose={onCloseDelete} mutateCards={mutateCards} />
    {details}
  </>;
}

function AddMangaSheet({ scope, open, query, results, selected, exists, error, saving, searching, searchError, onClose, onQueryChange, onSelect, onBack, onConfirm }: { scope: string; open: boolean; query: string; results?: MangaSearch[]; selected: MangaSearch | null; exists: boolean; error: string; saving: boolean; searching: boolean; searchError?: Error; onClose: () => void; onQueryChange: (query: string) => void; onSelect: (manga: MangaSearch) => void; onBack: () => void; onConfirm: () => void }) {
  const hasQuery = query.trim().length >= 2;
  const metadataKey = selected ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=metadata&mangaId=${selected.id}` : null;
  const { data: metadata, error: metadataError, isLoading: isLoadingMetadata } = useSWR<MangaMetadata>(metadataKey, fetcher);
  return <DashboardSheet open={open} title="Add manga" onClose={saving ? () => {} : onClose}>{selected ? <div className="space-y-5">{isLoadingMetadata ? <div className="flex h-56 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading manga details…</div> : metadata ? <><MangaMetadataPanel manga={metadata} /><div><p className="font-medium">{exists ? "This manga is already in this list." : "Add this manga?"}</p><p className="mt-1 text-sm text-muted-foreground">{exists ? "Choose another manga or close this confirmation." : "You can choose a scanlator after adding it."}</p></div><div className="flex justify-end gap-2"><button disabled={saving} onClick={onBack} className={button}><ArrowLeft className="size-4" />Back</button>{!exists ? <button disabled={saving} onClick={onConfirm} className={button}>{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}Add manga</button> : null}</div>{error ? <p className="text-sm text-destructive">{error}</p> : null}</> : <div className="space-y-3"><p className="text-sm text-destructive">{metadataError ? "Unable to load manga details." : "Manga details are unavailable."}</p><button onClick={onBack} className={button}><ArrowLeft className="size-4" />Back</button></div>}</div> : <><input autoFocus value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search manga" className="w-full rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 outline-none ring-primary focus:ring-1" /><div aria-live="polite" className="mt-3">{!hasQuery ? <p className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="size-3.5 shrink-0" />Enter at least two characters to search.</p> : searching ? <p className="flex items-center gap-2 text-xs text-muted-foreground"><LoaderCircle className="size-3.5 shrink-0 animate-spin" />Searching manga…</p> : results?.length ? <div className="max-h-72 space-y-1 overflow-y-auto">{results.map((item) => <button key={item.id} onClick={() => onSelect(item)} className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-accent"><span><span className="block font-medium">{item.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{mangaSearchSummary(item)}</span></span><Plus className="size-4 text-muted-foreground" /></button>)}</div> : <p className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="size-3.5 shrink-0" />No manga found.</p>}</div>{searchError ? <p className="mt-3 text-sm text-destructive">Unable to search manga.</p> : null}{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</>}</DashboardSheet>;
}

function MangaDetailsSheet({ scope, manga, onClose }: { scope: string; manga: MangaCard | null; onClose: () => void }) {
  const { data, error, isLoading } = useSWR<MangaMetadata>(manga ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=metadata&mangaId=${manga.id}` : null, fetcher);
  return <DashboardSheet open={!!manga} title="Manga details" onClose={onClose}>{manga ? isLoading ? <div className="flex h-56 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading manga details…</div> : data ? <MangaMetadataPanel manga={data} /> : <p className="text-sm text-destructive">{error ? "Unable to load manga details." : "Manga details are unavailable."}</p> : null}</DashboardSheet>;
}

function RoleSetting({ label, value, roles, error, saving, onSet, onClear }: { label: string; value?: string; roles?: DashboardRole[]; error?: Error; saving: boolean; onSet: (id: string) => void; onClear: () => void }) {
  const [selected, setSelected] = useState(value || "");
  useEffect(() => setSelected(value || ""), [value]);
  return <div className="space-y-2 border-b border-border/60 py-4 first:pt-0 last:border-0 last:pb-0"><div className="font-medium">{label}</div><div className="flex gap-2"><DashboardSelect value={selected} options={roles?.map((role) => ({ id: role.id, label: role.name, color: role.color }))} loading={!roles && !error} disabled={!!error || saving} onChange={setSelected} /><button disabled={saving || !selected || selected === (value || "") || !roles} onClick={() => onSet(selected)} className={button}>{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}Save</button>{value ? <button disabled={saving} onClick={onClear} className={button}>Remove</button> : null}</div>{error ? <p className="text-sm text-muted-foreground">Role choices are temporarily unavailable.</p> : null}</div>;
}

export function GroupSheet({ scope, manga, onClose, onBusyChange, mutateCards }: { scope: string; manga: MangaCard | null; onClose: () => void; onBusyChange: (mangaId: number | null) => void; mutateCards: KeyedMutator<MangaCard[]> }) {
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const { data: groups, error: groupsError, isLoading } = useSWR<Group[]>(manga ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=groups&mangaId=${manga.id}` : null, fetcher);
  const close = () => { setError(""); setSavingId(null); onClose(); };
  useEffect(() => {
    onBusyChange(manga && (isLoading || savingId !== null) ? manga.id : null);
    return () => onBusyChange(null);
  }, [isLoading, manga, onBusyChange, savingId]);
  const save = async (action: ManagementAction, groupName?: string) => {
    if (!manga) return;
    const groupId = action.type === "setGroup" ? action.groupId : 0;
    if ((manga.groupId || 0) === groupId) return;
    setError("");
    setSavingId(groupId);
    try {
      await mutateCards((cards) => cards?.map((card) => card.id === manga.id ? { ...card, groupId: action.type === "setGroup" ? action.groupId : undefined, groupName } : card), { revalidate: false });
      const response = await fetch(`/api/dashboard/management?scope=${encodeURIComponent(scope)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
      if (!response.ok) throw new Error();
      close(); void mutateCards();
    } catch {
      await mutateCards(); setSavingId(null); setError("Unable to save your change.");
    }
  };
  return <DashboardSheet open={!!manga} title={`Scanlator · ${manga?.title || "Manga"}`} onClose={savingId === null ? close : () => {}}>{manga ? <>{isLoading ? <div className="flex h-40 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading scanlators…</div> : <div className="max-h-80 space-y-1 overflow-y-auto"><button disabled={savingId !== null} onClick={() => save({ type: "clearGroup", mangaId: manga.id }, "All")} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-accent disabled:opacity-50"><span>Any scanlator</span>{savingId === 0 ? <LoaderCircle className="size-4 animate-spin" /> : !manga.groupId ? <Check className="size-4" /> : null}</button>{groups?.map((group) => <button disabled={savingId !== null} key={group.group_id} onClick={() => save({ type: "setGroup", mangaId: manga.id, groupId: group.group_id, groupName: group.name }, group.name)} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-accent disabled:opacity-50"><span>{group.name}</span>{savingId === group.group_id ? <LoaderCircle className="size-4 animate-spin" /> : manga.groupId === group.group_id ? <Check className="size-4" /> : null}</button>)}</div>}{groupsError ? <p className="mt-3 text-sm text-destructive">Unable to load scanlators.</p> : null}{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</> : null}</DashboardSheet>;
}

function DeleteSheet({ scope, manga, onClose, mutateCards }: { scope: string; manga: MangaCard | null; onClose: () => void; mutateCards: KeyedMutator<MangaCard[]> }) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const remove = async () => {
    if (!manga) return;
    setDeleting(true);
    await mutateCards((cards) => cards?.filter((card) => card.id !== manga.id), { revalidate: false });
    const response = await fetch(`/api/dashboard/management?scope=${encodeURIComponent(scope)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "remove", mangaId: manga.id }) });
    if (response.ok) { await mutateCards(); onClose(); return; }
    await mutateCards(); setDeleting(false); setError("Unable to remove this manga.");
  };
  return <DashboardSheet open={!!manga} title="Remove manga" onClose={deleting ? () => {} : onClose}>{manga ? <><p className="text-sm text-muted-foreground">Remove <span className="font-medium text-foreground">{manga.title}</span> from this list?</p><div className="mt-5 flex justify-end gap-2"><button disabled={deleting} onClick={onClose} className={button}>Cancel</button><button disabled={deleting} onClick={remove} className={`${button} border-destructive/50 text-destructive hover:bg-destructive/10`}>{deleting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}Remove</button></div>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</> : null}</DashboardSheet>;
}
