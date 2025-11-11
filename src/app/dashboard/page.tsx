import ProtectedPage from "@/components/dashboard/ProtectedPage";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <ProtectedPage>
      {(admin) => <DashboardLayout />}
    </ProtectedPage>
  );
}
