# Cosense Export TODO（並列開発用）

## 0. 仕様確定（ブロッキング）
- [x] `/api/preview` のレスポンス仕様を README に記載
- [ ] ~~KV 履歴レコードスキーマを README に記載~~ ※履歴機能撤廃

## 1. 基盤セットアップ （Team A）
- [ ] Next.js (App Router) プロジェクト作成
- [ ] TailwindCSS + Framer Motion 導入
- [ ] GitHub Actions で `next build`・lint 実行

## 2. Edge Functions （Team B）
- [ ] `/api/preview` ハンドラー実装
- [ ] `/api/export` ハンドラー実装
- [ ] `cosense.ts`: Cosense API アダプター
- [x] `markdown.ts`: Markdown 変換 + リンク書換
- [ ] `zip.ts`: JSZip ストリーム生成

## 3. フロントエンド （Team C）
- [ ] `ExportForm` コンポーネント化（既存 HTML 移行）
- [ ] `<PreviewModal>`：ツリービュー & Markdown プレビュー
- [ ] `<SettingsModal>`：ローカル設定モーダル
- [ ] `<ErrorToast>`：エラーコード別トースト表示

## 4. 統合 & テスト（並列可）
- [ ] Edge Functions と UI の連携
- [ ] Playwright E2E テスト
- [ ] アクセシビリティ対応（aria-label, focus trap など）
- [ ] ログ出力を `std/log` に統一
- [ ] CI に `next build`・ESLint・Playwright を組み込み
- [ ] README を最新仕様に更新
