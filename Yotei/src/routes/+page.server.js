import { redirect } from "@sveltejs/kit";

export async function load({ locals }) {
  if (!locals.user) throw redirect(303, "/login");

  const { data: tasks } = await locals.supabase
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: true });

  return { tasks: tasks ?? [] };
}

export const actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    await locals.supabase.from("tasks").insert({
      title: form.get("title"),
      due_date: form.get("due_date") || null,
      priority: form.get("priority") || "medium",
      user_id: locals.user.id
    });
  },

  toggle: async ({ request, locals }) => {
    const form = await request.formData();
    await locals.supabase.from("tasks").update({
      is_complete: form.get("is_complete") !== "true"
    }).eq("id", form.get("id"));
  },

  delete: async ({ request, locals }) => {
    const form = await request.formData();
    await locals.supabase.from("tasks").delete().eq("id", form.get("id"));
  }
};