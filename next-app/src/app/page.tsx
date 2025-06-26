"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ExportForm from "../components/ExportForm";
import PreviewModal from "../components/PreviewModal";
import type { FileNode } from "../lib/types";
import { normalizeProject } from "../lib/utils";

export default function Home() {
  const [preview, setPreview] = useState<
    {
      fileTree: FileNode[];
      sampleHtml: string;
    } | null
  >(null);

  async function handlePreview(project: string, sid?: string) {
    const normalized = normalizeProject(project);
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: normalized, sid }),
    });
    const data = await res.json();
    setPreview({ fileTree: data.fileTree, sampleHtml: data.sampleHtml });
  }

  async function handleExport(project: string, sid?: string) {
    const normalized = normalizeProject(project);
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: normalized, sid }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen grid grid-rows-[auto_1fr] gap-8 p-6"
    >
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Cosense Export</h1>
      </header>
      <main className="row-start-2 flex justify-center">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-md">
          <ExportForm onPreview={handlePreview} onExport={handleExport} />
        </div>
      </main>
      {preview && (
        <PreviewModal
          fileTree={preview.fileTree}
          sampleHtml={preview.sampleHtml}
          onClose={() => setPreview(null)}
        />
      )}
    </motion.div>
  );
}
