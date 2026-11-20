// Tipos de las filas de la base de datos (supabase/migrations/20261120000000_init.sql).
// Escritos a mano; se pueden regenerar con `supabase gen types typescript`.

import type { Feature, PlanId } from "@/lib/config/plans";

export type StoreType = "moda" | "calzado" | "joyeria" | "decoracion" | "belleza" | "gourmet" | "otro";
export type SpaceType = "escaparate" | "mesa" | "lineal" | "probador" | "fachada" | "interior" | "web";
export type ReportKind = Feature;

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  store_name: string | null;
  store_type: StoreType | null;
  city: string | null;
  role: "user" | "admin";
  plan: PlanId;
  pro_until: string | null;
  stripe_customer_id: string | null;
  referred_by: string | null;
  marketing_opt_in: boolean;
  unsubscribe_token: string;
  onboarded_at: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  status: string;
  price_id: string | null;
  billing_interval: "month" | "year" | null;
  unit_amount_cents: number | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReportRow = {
  id: string;
  user_id: string;
  kind: ReportKind;
  space_type: SpaceType | null;
  title: string;
  input: Record<string, unknown>;
  image_paths: string[];
  score: number | null;
  result: unknown;
  model: string;
  input_tokens: number | null;
  output_tokens: number | null;
  duration_ms: number | null;
  images_deleted_at: string | null;
  created_at: string;
};

export type AffiliateRow = {
  id: string;
  user_id: string;
  code: string;
  status: "pending" | "active" | "paused" | "rejected";
  commission_rate: number;
  commission_months: number;
  website: string | null;
  audience: string | null;
  admin_notes: string | null;
  created_at: string;
};

export type CommissionRow = {
  id: string;
  affiliate_id: string;
  referral_id: string;
  stripe_invoice_id: string;
  base_cents: number;
  amount_cents: number;
  currency: string;
  status: "pending" | "approved" | "paid" | "void";
  available_at: string;
  paid_at: string | null;
  created_at: string;
};
