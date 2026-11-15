import { getAdminSupabase, requireAdmin, type Signup } from "@/lib/admin";

// A leading =, +, - or @ makes spreadsheet apps treat a cell as a formula.
function csvCell(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireAdmin();

  const supabase = getAdminSupabase();
  if (!supabase) {
    return new Response("SUPABASE_SECRET_KEY is not set", { status: 503 });
  }

  const { data, error } = await supabase
    .from("newsletter_signups")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) return new Response(error.message, { status: 500 });

  const rows = (data as Signup[]).map((signup) =>
    [signup.email, signup.created_at].map(csvCell).join(","),
  );
  const csv = ["email,signed_up_at", ...rows].join("\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-signups-${date}.csv"`,
    },
  });
}
