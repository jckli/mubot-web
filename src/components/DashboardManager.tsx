"use client";

import { AnimatePresence } from "framer-motion";
import { Check, LoaderCircle, Plus, Settings2, ShieldAlert, Trash2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { KeyedMutator } from "swr";
import { DashboardRole, ManagementAction, ManagementState, MangaCard } from "../lib/dashboard-types";
import DashboardSelect from "./DashboardSelect";
import DashboardSheet from "./DashboardSheet";

type MangaSearch = { id: number; title: string; year: string };
type Group = { group_id: number; name: string };
type Mode = "add" | "settings" | null;

const fetcher = <T,>(url: string) => fetch(url).then(async (response) => {
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
});

const button = "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-45";

export function MangaActions({ manga, onGroup, onRemove }: { manga: MangaCard; onGroup: () => void; onRemove: () => void }) {
  return <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
    <button aria-label={`Set scanlator for ${manga.title}`} onClick={onGroup} className="rounded-md border border-border/60 bg-card/90 p-1.5 text-muted-foreground hover:text-foreground"><UsersRound className="size-3.5" /></button>
    <button aria-label={`Remove ${manga.title}`} onClick={onRemove} className="rounded-md border border-border/60 bg-card/90 p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
  </div>;
}

export default function DashboardManager({ scope, state, mutateCards, mutateState, selectedManga, deletingManga, onCloseGroup, onCloseDelete }: {
  scope: string;
  state?: ManagementState;
  mutateCards: KeyedMutator<MangaCard[]>;
  mutateState: KeyedMutator<ManagementState>;
  selectedManga: MangaCard | null;
  deletingManga: MangaCard | null;
  onCloseGroup: () => void;
  onCloseDelete: () => void;
}) {
  const [mode, setMode] = useState<Mode>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const mangaKey = mode === "add" && query.trim().length >= 2 ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=manga&q=${encodeURIComponent(query.trim())}` : null;
  const rolesKey = mode === "settings" && scope.startsWith("server:") ? `/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=roles&serverId=${scope.slice(7)}` : null;
  const { data: manga } = useSWR<MangaSearch[]>(mangaKey, fetcher, { keepPreviousData: true });
  const { data: roles, error: rolesError } = useSWR<DashboardRole[]>(rolesKey, fetcher);
  const run = async (action: ManagementAction, update?: (cards: MangaCard[]) => MangaCard[]) => {
    setError("");
    if (update) await mutateCards((cards) => cards && update(cards), { revalidate: false });
    const response = await fetch(`/api/dashboard/management?scope=${encodeURIComponent(scope)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
    if (!response.ok) {
      await mutateCards();
      throw new Error("Unable to save your change.");
    }
    await Promise.all([mutateCards(), mutateState()]);
  };
  const open = (next: Mode) => { setError(""); setQuery(""); setMode(next); };
  const save = (action: ManagementAction, update?: (cards: MangaCard[]) => MangaCard[]) => run(action, update).then(() => setMode(null)).catch((err) => setError(err.message));

  if (!state?.canEdit) return state ? <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldAlert className="size-3.5" />{state.reason}{state.needsRoleConsent ? <a className="text-primary hover:underline" href="/api/auth/discord/start">Reconnect</a> : null}</div> : null;
  return <>
    <div className="flex flex-wrap gap-2">
      <button onClick={() => open("add")} className={button}><Plus className="size-4" />Add manga</button>
      {scope.startsWith("server:") ? <button onClick={() => open("settings")} className={button}><Settings2 className="size-4" />Settings</button> : null}
    </div>
    <AnimatePresence mode="wait">
      {mode === "add" ? <DashboardSheet key="add" title="Add manga" onClose={() => setMode(null)}><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search MangaUpdates" className="w-full rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 outline-none ring-primary focus:ring-1" />
        <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">{manga?.map((item) => <button key={item.id} onClick={() => save({ type: "add", mangaId: item.id })} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-accent"><span><span className="block font-medium">{item.title}</span><span className="text-xs text-muted-foreground">{item.year || "Unknown year"}</span></span><Plus className="size-4 text-muted-foreground" /></button>)}{query.length >= 2 && manga?.length === 0 ? <p className="p-3 text-sm text-muted-foreground">No manga found.</p> : null}</div>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</DashboardSheet> : null}
      {mode === "settings" ? <DashboardSheet key="settings" title="Server settings" onClose={() => setMode(null)}><RoleSetting label="Ping role" value={state.pingRoleId} roles={roles} error={rolesError} onSet={(roleId) => save({ type: "setRole", roleType: "ping", roleId })} onClear={() => save({ type: "clearRole", roleType: "ping" })} />
        {state.canManageAdmin ? <RoleSetting label="Admin role" value={state.adminRoleId} roles={roles} error={rolesError} onSet={(roleId) => save({ type: "setRole", roleType: "admin", roleId })} onClear={() => save({ type: "clearRole", roleType: "admin" })} /> : <p className="mt-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">Only the server owner, a Discord administrator, or someone with Manage Server can change the admin role.</p>}{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</DashboardSheet> : null}
      {selectedManga ? <GroupSheet key={`group-${selectedManga.id}`} scope={scope} manga={selectedManga} onClose={onCloseGroup} mutateCards={mutateCards} /> : null}
      {deletingManga ? <DeleteSheet key={`delete-${deletingManga.id}`} scope={scope} manga={deletingManga} onClose={onCloseDelete} mutateCards={mutateCards} /> : null}
    </AnimatePresence>
  </>;
}

function RoleSetting({ label, value, roles, error, onSet, onClear }: { label: string; value?: string; roles?: DashboardRole[]; error?: Error; onSet: (id: string) => void; onClear: () => void }) {
  const [selected, setSelected] = useState(value || "");
  useEffect(() => setSelected(value || ""), [value]);
  return <div className="space-y-2 border-b border-border/60 py-4 first:pt-0 last:border-0 last:pb-0"><div className="font-medium">{label}</div><div className="flex gap-2"><DashboardSelect value={selected} options={roles?.map((role) => ({ id: role.id, label: role.name, color: role.color }))} loading={!roles && !error} disabled={!!error} onChange={setSelected} /><button disabled={!selected || selected === (value || "") || !roles} onClick={() => onSet(selected)} className={button}><Check className="size-4" />Save</button>{value ? <button onClick={onClear} className={button}>Remove</button> : null}</div>{error ? <p className="text-sm text-muted-foreground">Role choices are temporarily unavailable.</p> : null}</div>;
}

export function GroupSheet({ scope, manga, onClose, mutateCards }: { scope: string; manga: MangaCard; onClose: () => void; mutateCards: KeyedMutator<MangaCard[]> }) {
  const [error, setError] = useState("");
  const { data: groups, error: groupsError, isLoading } = useSWR<Group[]>(`/api/dashboard/lookup?scope=${encodeURIComponent(scope)}&kind=groups&mangaId=${manga.id}`, fetcher);
  const save = async (action: ManagementAction, groupName?: string) => {
    setError("");
    await mutateCards((cards) => cards?.map((card) => card.id === manga.id ? { ...card, groupId: action.type === "setGroup" ? action.groupId : undefined, groupName } : card), { revalidate: false });
    const response = await fetch(`/api/dashboard/management?scope=${encodeURIComponent(scope)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
    if (!response.ok) { await mutateCards(); setError("Unable to save your change."); return; }
    await mutateCards(); onClose();
  };
  return <DashboardSheet title={`Scanlator · ${manga.title}`} onClose={onClose}>{isLoading ? <div className="flex h-40 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading scanlators…</div> : <div className="max-h-80 space-y-1 overflow-y-auto"><button onClick={() => save({ type: "clearGroup", mangaId: manga.id }, "All")} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-accent"><span>Any scanlator</span>{!manga.groupId ? <Check className="size-4" /> : null}</button>{groups?.map((group) => <button key={group.group_id} onClick={() => save({ type: "setGroup", mangaId: manga.id, groupId: group.group_id, groupName: group.name }, group.name)} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-accent"><span>{group.name}</span>{manga.groupId === group.group_id ? <Check className="size-4" /> : null}</button>)}</div>}{groupsError ? <p className="mt-3 text-sm text-destructive">Unable to load scanlators.</p> : null}{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</DashboardSheet>;
}

function DeleteSheet({ scope, manga, onClose, mutateCards }: { scope: string; manga: MangaCard; onClose: () => void; mutateCards: KeyedMutator<MangaCard[]> }) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const remove = async () => {
    setDeleting(true);
    await mutateCards((cards) => cards?.filter((card) => card.id !== manga.id), { revalidate: false });
    const response = await fetch(`/api/dashboard/management?scope=${encodeURIComponent(scope)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "remove", mangaId: manga.id }) });
    if (response.ok) { await mutateCards(); onClose(); return; }
    await mutateCards(); setDeleting(false); setError("Unable to remove this manga.");
  };
  return <DashboardSheet title="Remove manga" onClose={deleting ? () => {} : onClose}><p className="text-sm text-muted-foreground">Remove <span className="font-medium text-foreground">{manga.title}</span> from this list?</p><div className="mt-5 flex justify-end gap-2"><button disabled={deleting} onClick={onClose} className={button}>Cancel</button><button disabled={deleting} onClick={remove} className={`${button} border-destructive/50 text-destructive hover:bg-destructive/10`}>{deleting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}Remove</button></div>{error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}</DashboardSheet>;
}
