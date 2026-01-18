import { Sidebar } from "@/components/admin/side-bar"
import { createClient } from "@/lib/utils/supabase/server"
import { redirect } from "next/navigation"
import type React from "react" // Added import for React

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const res = await supabase.auth.getUser()

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", res.data.user?.id)
    .single()
  if (roleError || roleData?.role !== "admin") {
    return redirect("/permission-denied")
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 border-r border-gray-700">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-900 hide-scrollbar">{children}</main>
    </div>
  )
}