import { useState } from "react";

export interface ExportFormProps {
  onPreview: (project: string, sid?: string) => void;
  onExport: (project: string, sid?: string) => void;
}

export default function ExportForm({ onPreview, onExport }: ExportFormProps) {
  const [project, setProject] = useState("");
  const [sid, setSid] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-sm font-medium">プロジェクトID / URL</span>
        <input
          className="mt-1 w-full rounded border p-2"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">sid Cookie (任意)</span>
        <input
          className="mt-1 w-full rounded border p-2"
          value={sid}
          onChange={(e) => setSid(e.target.value)}
        />
      </label>
      <div className="mt-2 flex justify-between gap-2">
        <button
          type="button"
          className="h-10 flex-1 rounded bg-gray-600 px-4 text-white hover:bg-gray-700"
          onClick={() => onPreview(project, sid || undefined)}
        >
          プレビュー
        </button>
        <button
          type="button"
          className="h-10 flex-1 rounded bg-emerald-500 px-4 text-white hover:bg-emerald-600"
          onClick={() => onExport(project, sid || undefined)}
        >
          エクスポート
        </button>
      </div>
    </div>
  );
}
