import HomeClient from "../components/HomeClient";
import { getSession } from "../lib/session";

export default async function Home() {
  return <HomeClient authenticated={Boolean(await getSession())} />;
}
