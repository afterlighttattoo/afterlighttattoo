import type { Metadata } from "next";
import { AdminGalleryManager } from "@/app/components/AdminGalleryManager";

export const metadata: Metadata = {
  title: "Gallery Manager | After Light Tattoo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="admin-page">
      <section className="section-shell admin-shell" aria-labelledby="admin-title">
        <div className="admin-heading">
          <p className="eyebrow">After Light Tattoo</p>
          <h1 id="admin-title">Gallery Manager</h1>
          <p>Add, feature, and remove tattoo artwork from the website.</p>
        </div>
        <AdminGalleryManager />
      </section>
    </main>
  );
}
