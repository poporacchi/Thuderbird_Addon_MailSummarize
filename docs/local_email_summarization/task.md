# タスクリスト - ローカルAIメール要約機能の追加

- [x] 調査：Thunderbird WebExtension API を使用したメール本文の取得方法
- [x] 調査：引用（Re/Fwdなど）を除去するロジックの検討
- [x] 導入：Transformers.js ライブラリの準備
  - [x] `summary.html`: 「Obsidian に保存」ボタンの追加
  - [x] `summary.js`: Obsidian URI 生成ロジックの実装（`/Thunderbird` フォルダ指定）
  - [x] `summary.js`: 特殊文字のエスケープ処理とタイトル自動生成
- [x] 修正：`manifest.json` (unlimitedStorage 追加)
- [x] 修正：`manifest.json` (CSP に blob: を追加して Worker ブロックを回避)
- [x] 修正：`background.js` (Web Worker無効化の再確認)
- [x] 修正：`background.js` (キャッシュと初期化ロックの実装)
- [x] 修正：UIに処理中ステータスを表示
- [ ] 検証：CSPエラーが出ず、2回目以降の起動が高速化されていること
