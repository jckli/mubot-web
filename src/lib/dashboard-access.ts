import "server-only";

import { getDiscordGuilds, parseScope, tsuuchiHeaders } from "./dashboard";
import { ManagementAction, ManagementState } from "./dashboard-types";
import { tsuuchiBase } from "./env";
import { UserSession } from "./session";

const ADMINISTRATOR = BigInt(8);
const MANAGE_GUILD = BigInt(32);

export interface ServerConfig {
  roles?: { admin?: number; ping?: number[] };
}

const request = async <T>(path: string, init?: RequestInit) => {
  const response = await fetch(`${tsuuchiBase()}${path}`, {
    ...init,
    headers: { ...tsuuchiHeaders(), ...init?.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
};

export const getServerConfig = (id: string) => request<ServerConfig>(`/server/${id}/config`);

const getMemberRoles = async (token: string, guildId: string) => {
  const response = await fetch(`https://discord.com/api/v10/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Discord request failed: ${response.status}`);
  return (await response.json()) as { roles: string[] };
};

export const getManagementState = async (session: UserSession, scopeValue: string): Promise<ManagementState> => {
  const scope = parseScope(scopeValue);
  if (!scope || (scope.type === "user" && scope.id !== session.userId)) {
    return { canEdit: false, canManageAdmin: false, needsRoleConsent: false, reason: "This list is unavailable." };
  }
  if (scope.type === "user") return { canEdit: true, canManageAdmin: false, needsRoleConsent: false };

  const [guilds, config] = await Promise.all([getDiscordGuilds(session.accessToken), getServerConfig(scope.id)]);
  const guild = guilds.find((item) => item.id === scope.id);
  if (!guild) return { canEdit: false, canManageAdmin: false, needsRoleConsent: false, reason: "You no longer have access to this server." };
  const permissions = BigInt(guild.permissions || "0");
  const canManageAdmin = guild.owner || (permissions & ADMINISTRATOR) !== BigInt(0) || (permissions & MANAGE_GUILD) !== BigInt(0);
  let canEdit = canManageAdmin || (permissions & MANAGE_GUILD) !== BigInt(0);
  let needsRoleConsent = false;
  const adminRoleId = config.roles?.admin?.toString();
  if (!canEdit && adminRoleId) {
    const member = await getMemberRoles(session.accessToken, scope.id);
    needsRoleConsent = member === null;
    canEdit = member?.roles.includes(adminRoleId) || false;
  }
  return {
    canEdit,
    canManageAdmin,
    needsRoleConsent,
    reason: canEdit ? undefined : needsRoleConsent ? "Reconnect Discord to verify your configured admin role." : "You need Manage Server or the configured admin role to edit this list.",
    pingRoleId: config.roles?.ping?.[0]?.toString(),
    adminRoleId,
  };
};

const body = (value: unknown) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });

export const applyManagementAction = async (scopeValue: string, action: ManagementAction) => {
  const scope = parseScope(scopeValue);
  if (!scope) throw new Error("Invalid scope");
  const prefix = `/${scope.type}/${scope.id}`;
  switch (action.type) {
    case "add":
      return request(`${prefix}/manga`, body({ id: action.mangaId }));
    case "remove":
      return request(`${prefix}/manga/${action.mangaId}`, { method: "DELETE" });
    case "setGroup":
      return request(`${prefix}/manga/${action.mangaId}/group`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ group_name: action.groupName, group_id: action.groupId }) });
    case "clearGroup":
      return request(`${prefix}/manga/${action.mangaId}/group`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ group_name: "All", group_id: 0 }) });
    case "setRole":
      return request(`/server/${scope.id}/role`, body({ role_id: action.roleId, type: action.roleType }));
    case "clearRole":
      return request(`/server/${scope.id}/role`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: action.roleType }) });
  }
};

export const lookup = <T>(path: string) => request<T>(path);
