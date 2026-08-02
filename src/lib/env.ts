export const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};

export const tsuuchiBase = () => requireEnv("TSUUCHI_API_BASE").replace(/\/$/, "");
export const tsuuchiApiSecret = () => requireEnv("TSUUCHI_API_SECRET");
