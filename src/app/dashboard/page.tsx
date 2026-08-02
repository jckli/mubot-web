import { redirect } from "next/navigation";
import DashboardClient from "../../components/DashboardClient";
import { getMangaCards, getScopes, parseScope } from "../../lib/dashboard";
import { getSession } from "../../lib/session";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  const scopes = await getScopes(session).catch(() => []);
  if (!scopes.length) {
    return (
      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto mt-8 rounded-xl border border-border/60 bg-secondary/30 p-6 text-center text-muted-foreground">
          No accessible lists were found for this account.
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const wanted = parseScope(params.scope);
  const initialScope =
    (wanted && scopes.find((s) => s.scope === `${wanted.type}:${wanted.id}`)?.scope) ||
    scopes[0].scope;
  const parsed = parseScope(initialScope)!;
  const cards = await getMangaCards(parsed.type, parsed.id).catch(() => []);

  return <DashboardClient scopes={scopes} initialScope={initialScope} initialCards={cards} />;
}
