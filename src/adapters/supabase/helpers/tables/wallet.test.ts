import dotenv from "dotenv";
dotenv.config();

import { GitHubUser } from "../../../../types/payload";

const hasSupabaseCredentials = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
const maybeDescribe = hasSupabaseCredentials ? describe : describe.skip;

maybeDescribe("wallet Supabase integration", () => {
  it("can read the wallet address for a known GitHub user", async () => {
    const { createAdapters } = await import("../../../adapters");
    const { wallet } = createAdapters().supabase;
    const userId = 4975670 as GitHubUser["id"];

    await expect(wallet.getAddress(userId)).resolves.not.toThrow();
  });
});
