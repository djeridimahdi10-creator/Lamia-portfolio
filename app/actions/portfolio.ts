"use server";

import { getSupabaseClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function getPortfolioContentAction() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, data: null, error: "Supabase environment variables missing" };
  }

  try {
    const { data, error } = await client
      .from("portfolio_content")
      .select("data")
      .eq("id", "main")
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data?.data || null };
  } catch (err: any) {
    return { success: false, data: null, error: err?.message || "Unknown error" };
  }
}

export async function savePortfolioContentAction(portfolioData: any) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase environment variables missing" };
  }

  try {
    const { error } = await client.from("portfolio_content").upsert({
      id: "main",
      data: portfolioData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error during save:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/fr");

    return { success: true };
  } catch (err: any) {
    console.error("Server action save error:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}
