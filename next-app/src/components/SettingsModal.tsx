import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface Settings {
  fileName: "slug" | "title" | "id";
  imageFolder: "images" | "root";
  zipName: "timestamp" | "fixed";
  history: "30d" | "forever" | "manual";
  jpTitle: "utf8" | "encode";
}

const defaultSettings: Settings = {
  fileName: "slug",
  imageFolder: "images",
  zipName: "timestamp",
  history: "30d",
  jpTitle: "utf8",
};

export interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem("exportSettings");
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, [open]);

  function save() {
    localStorage.setItem("exportSettings", JSON.stringify(settings));
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg w-[90vw] max-w-md space-y-4 text-sm"
      >
        <h2 className="text-lg font-semibold">設定</h2>
        <div>
          <p className="font-medium">ファイル命名</p>
          <div className="mt-1 space-x-4">
            {(["slug", "title", "id"] as const).map((v) => (
              <label key={v} className="space-x-1">
                <input
                  type="radio"
                  name="filename"
                  value={v}
                  checked={settings.fileName === v}
                  onChange={() => setSettings({ ...settings, fileName: v })}
                />
                <span>{v}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">画像フォルダ</p>
          <div className="mt-1 space-x-4">
            {(["images", "root"] as const).map((v) => (
              <label key={v} className="space-x-1">
                <input
                  type="radio"
                  name="imgFolder"
                  value={v}
                  checked={settings.imageFolder === v}
                  onChange={() => setSettings({ ...settings, imageFolder: v })}
                />
                <span>{v === "images" ? "images/" : "ルート直下"}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">ZIP名</p>
          <div className="mt-1 space-x-4">
            {(["timestamp", "fixed"] as const).map((v) => (
              <label key={v} className="space-x-1">
                <input
                  type="radio"
                  name="zipName"
                  value={v}
                  checked={settings.zipName === v}
                  onChange={() => setSettings({ ...settings, zipName: v })}
                />
                <span>{v === "timestamp" ? "project_YYYYMMDD.zip" : "固定"}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">履歴保持期間</p>
          <div className="mt-1 space-x-4">
            {(["30d", "forever", "manual"] as const).map((v) => (
              <label key={v} className="space-x-1">
                <input
                  type="radio"
                  name="history"
                  value={v}
                  checked={settings.history === v}
                  onChange={() => setSettings({ ...settings, history: v })}
                />
                <span>
                  {v === "30d" ? "30日" : v === "forever" ? "無制限" : "手動削除"}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">日本語タイトルの扱い</p>
          <div className="mt-1 space-x-4">
            {(["utf8", "encode"] as const).map((v) => (
              <label key={v} className="space-x-1">
                <input
                  type="radio"
                  name="jpTitle"
                  value={v}
                  checked={settings.jpTitle === v}
                  onChange={() => setSettings({ ...settings, jpTitle: v })}
                />
                <span>{v === "utf8" ? "UTF-8" : "URLエンコード"}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            className="px-4 py-1 rounded bg-gray-200"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="px-4 py-1 rounded bg-emerald-500 text-white"
            onClick={save}
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
}
