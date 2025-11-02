"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "GET" });
    setLoading(false);
    router.push("/dashboard/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-rose-600 text-white py-2 px-4 rounded hover:bg-rose-700 transition"
    >
      {loading ? "در حال خروج..." : "خروج"}
    </button>
  );
}
