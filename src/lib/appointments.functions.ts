import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const insertAppointmentSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  email: z.string().email().max(255).or(z.literal("")).optional(),
  service: z.string().min(1).max(200),
  doctor: z.string().max(200).optional(),
  preferred_date: z.string().min(1).max(20),
  preferred_time: z.string().min(1).max(20),
  message: z.string().max(500).optional(),
  source: z.string().max(100).optional(),
});

export const submitAppointment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => insertAppointmentSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("appointments").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      service: data.service,
      doctor: data.doctor || null,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      message: data.message || null,
      source: data.source || null,
    });
    if (error) {
      console.error("Appointment insert error:", error);
      return { success: false, error: "Failed to submit appointment" };
    }
    return { success: true };
  });

export const getAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Check role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "staff"]);

    if (!roleData || roleData.length === 0) {
      throw new Error("Unauthorized: admin/staff role required");
    }

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch appointments error:", error);
      return { appointments: [], error: "Failed to fetch appointments" };
    }
    return { appointments: data || [] };
  });

const updateAppointmentSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  staff_notes: z.string().max(1000).optional(),
});

export const updateAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateAppointmentSchema.parse(input))
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

    const { error } = await supabaseAdmin
      .from("appointments")
      .update({
        ...(data.status && { status: data.status }),
        ...(data.staff_notes !== undefined && { staff_notes: data.staff_notes }),
      })
      .eq("id", data.id);

    if (error) {
      console.error("Update appointment error:", error);
      return { success: false };
    }
    return { success: true };
  });
