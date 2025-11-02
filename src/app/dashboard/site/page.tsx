import ProtectedPage from "@/components/dashboard/ProtectedPage";
import SiteContentPanel from "@/components/dashboard/SiteContentPanel";

export default async function SitePage() {
  return (
    <ProtectedPage>
      {(admin) => (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">مدیریت محتوای سایت</h2>
            <div className="text-sm text-gray-600">
              مدیر: <span className="font-medium">{admin.email}</span>
            </div>
          </div>
          <SiteContentPanel />
        </div>
      )}
    </ProtectedPage>
  );
}
