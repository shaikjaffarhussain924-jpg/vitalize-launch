import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const insertContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(15),
  message: z.string().min(10).max(1000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => insertContactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    });
    if (error) {
      console.error("Contact insert error:", error);
      return { success: false, error: "Failed to submit contact" };
    }
    return { success: true };
  });

export const getContacts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "staff"]);

    if (!roleData || roleData.length === 0) {
      throw new Error("Unauthorized");
    }

    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch contacts error:", error);
      return { contacts: [], error: "Failed to fetch contacts" };
    }
    return { contacts: data || [] };
  });

const updateContactSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "replied", "closed"]).optional(),
  staff_notes: z.string().max(1000).optional(),
});

export const updateContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateContactSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "staff"]);

    if (!roleData || roleData.length === 0) {
      throw new Error("Unauthorized");
    }

    const updates: Record<string, string> = {};
    if (data.status) updates.status = data.status;
    if (data.staff_notes !== undefined) updates.staff_notes = data.staff_notes;

    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .update(updates)
      .eq("id", data.id);

    if (error) {
      console.error("Update contact error:", error);
      return { success: false };
    }
    return { success: true };
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "staff"]);

    if (!roleData || roleData.length === 0) {
      throw new Error("Unauthorized");
    }

    const today = new Date().toISOString().split("T")[0];

    const [appointments, contacts, pendingAppts, todayAppts] = await Promise.all([
      supabaseAdmin.from("appointments").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabaseAdmin.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("appointments").select("id", { count: "exact", head: true }).gte("created_at", today + "T00:00:00").lte("created_at", today + "T23:59:59"),
    ]);

    return {
      totalAppointments: appointments.count || 0,
      newContacts: contacts.count || 0,
      pendingAppointments: pendingAppts.count || 0,
      todayAppointments: todayAppts.count || 0,
    };
  });
