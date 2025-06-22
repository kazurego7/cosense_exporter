# Cosense Export TODO（階層番号付き）

## 0. インターフェース確定
- [ ] **0.1** `/api/preview` のレスポンス仕様を README に記載
- [ ] **0.2** KV 履歴レコードスキーマを README に記載

## 1. 基盤移行（Fresh + React）
- [ ] **1.1** Fresh 1.8 プロジェクトへ移行（`routes/api/*.ts` へ統合）
- [ ] **1.2** Deno KV 初期化コードを追加
- [ ] **1.3** React + Vite + Tailwind を scaffold（`frontend/`）
- [ ] **1.4** 既存 HTML UI → `ExportForm.tsx` へ置き換え
- [ ] **1.5** GitHub Actions にフロントビルド＆`static/` 配置を追加

## 2. データ取得 & プレビュー機能
- [ ] **2.1** `cosense.ts`：Cosense API アダプター実装
- [ ] **2.2** `markdown.ts`：Scrapbox → Markdown 変換 + リンク書換
- [ ] **2.3** `zip.ts`：実データ取得 + JSZip ストリーム生成
- [ ] **2.4** `<PreviewModal>`：ツリービュー & Markdown プレビュー
- [ ] **2.5** `<ErrorToast>`：エラーコード別トースト表示

## 3. 履歴管理 & 設定 UI
- [ ] **3.1** `history.ts`：KV で履歴保存 / 取得 / 削除
- [ ] **3.2** `<HistoryPage>`：履歴一覧 & プレビュー／再試行
- [ ] **3.3** `<SettingsModal>`：設定モーダル UI

## 4. テスト & 仕上げ
- [ ] **4.1** Playwright E2E テスト（トップ → プレビュー → ダウンロード）
- [ ] **4.2** アクセシビリティ対応（aria-label, focus trap など）
- [ ] **4.3** ログ出力を `std/log` に統一
- [ ] **4.4** CI に `deno task check`・ESLint・Playwright を組み込み
- [ ] **4.5** README を最新仕様に更新
