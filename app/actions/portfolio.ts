"use server";

import { supabase } from "@/lib/supabaseClient";

export async function getPortfolioContentAction() {
  if (!supabase) {
    return { success: false, data: null, error: "Supabase client not initialized" };
  }

  try {
    const { data, error } = await supabase
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
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" };
  }

  try {
    const { error } = await supabase.from("portfolio_content").upsert({
      id: "main",
      data: portfolioData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Unknown error" };
  }
}
