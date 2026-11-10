import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient user={admin} />;
}

