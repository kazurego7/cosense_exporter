import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ErrorCode =
  | "COSENSE_NOT_FOUND"
  | "AUTH_FAILED"
  | "IMG_FETCH_ERR"
  | "ZIP_FAIL";

const messages: Record<ErrorCode, string> = {
  COSENSE_NOT_FOUND: "プロジェクトが見つかりません",
  AUTH_FAILED: "sid が無効です",
  IMG_FETCH_ERR: "画像取得に失敗しました",
  ZIP_FAIL: "ZIP 生成に失敗しました",
};

const colors: Record<ErrorCode, string> = {
  COSENSE_NOT_FOUND: "bg-red-500",
  AUTH_FAILED: "bg-red-500",
  IMG_FETCH_ERR: "bg-yellow-500",
  ZIP_FAIL: "bg-red-500",
};

export interface ErrorToastProps {
  code: ErrorCode | null;
  onClose: () => void;
}

export default function ErrorToast({ code, onClose }: ErrorToastProps) {
  useEffect(() => {
    if (!code) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [code, onClose]);

  return (
    <AnimatePresence>
      {code && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded shadow ${colors[code]}`}
        >
          エラー: {messages[code]}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
