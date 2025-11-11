"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

interface Document {
  id: string;
  title: string;
  fileUrl: string;
}

export default function StaffDocuments({ staffId }: { staffId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // گرفتن لیست مدارک
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`/api/staff/${staffId}/documents`);
      const json = await res.json();
      if (json.success) {
        setDocuments(json.documents);
      }
    } catch {
      toast.error("خطا در دریافت مدارک");
    }
  }, [staffId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // افزودن مدرک
  const addDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("لطفاً فایل انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch(`/api/staff/${staffId}/documents`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        toast.success("مدرک اضافه شد");
        setTitle("");
        setFile(null);
        fetchDocuments();
      } else {
        toast.error("خطا در افزودن مدرک");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  // حذف مدرک
  const deleteDocument = async (docId: string) => {
    if (!confirm("آیا از حذف این مدرک مطمئن هستید؟")) return;
    try {
      const res = await fetch(
        `/api/staff/${staffId}/documents?docId=${docId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (json.success) {
        toast.success("مدرک حذف شد");
        fetchDocuments();
      } else {
        toast.error("خطا در حذف مدرک");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="card p-4 space-y-4">
      <h3 className="section-title">مدارک پرسنل</h3>

      {/* فرم افزودن مدرک */}
      <form onSubmit={addDocument} className="flex flex-col gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="عنوان مدرک"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="input"
        />
        <button type="submit" className="cta-primary">
          افزودن مدرک
        </button>
      </form>

      {/* لیست مدارک */}
      {documents.length > 0 ? (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="text-sm">
                <span className="font-bold">{doc.title}</span> -{" "}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  مشاهده
                </a>
              </div>
              <button
                onClick={() => deleteDocument(doc.id)}
                className="cta-secondary bg-red-500 text-white"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">مدرکی ثبت نشده است</p>
      )}
    </div>
  );
}
