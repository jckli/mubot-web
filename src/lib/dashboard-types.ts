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
  groupId?: number;
  groupName?: string;
}

export interface DashboardRole {
  id: string;
  name: string;
  color: number;
  position: number;
  managed: boolean;
  mentionable: boolean;
}

export interface ManagementState {
  canEdit: boolean;
  canManageAdmin: boolean;
  needsRoleConsent: boolean;
  reason?: string;
  pingRoleId?: string;
  adminRoleId?: string;
}

export type ManagementAction =
  | { type: "add"; mangaId: number }
  | { type: "remove"; mangaId: number }
  | { type: "setGroup"; mangaId: number; groupId: number; groupName: string }
  | { type: "clearGroup"; mangaId: number }
  | { type: "setRole"; roleType: "ping" | "admin"; roleId: string }
  | { type: "clearRole"; roleType: "ping" | "admin" };
