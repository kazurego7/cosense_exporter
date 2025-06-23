"use client";
import { useState } from "react";
import SettingsModal from "../components/SettingsModal";
import ErrorToast, { ErrorCode } from "../components/ErrorToast";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Cosense Exporter</h1>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-emerald-500 text-white rounded"
          onClick={() => setShowSettings(true)}
        >
          設定
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setError("COSENSE_NOT_FOUND")}
        >
          エラー表示
        </button>
      </div>
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <ErrorToast code={error} onClose={() => setError(null)} />
    </main>
  );
}
