export type ScopeType = "user" | "server";

export interface DashboardScope {
  scope: `${ScopeType}:${string}`;
  type: ScopeType;
  id: string;
  label: string;
  iconUrl: string | null;
}

export interface MangaCard {
  id: number;
  title: string;
  author: string;
  coverUrl: string | null;
  url: string;
}
