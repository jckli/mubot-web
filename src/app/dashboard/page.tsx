import { redirect } from "next/navigation";
import DashboardClient from "../../components/DashboardClient";
import { getSession } from "../../lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return <DashboardClient />;
}
