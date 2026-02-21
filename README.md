# Thunderbird Local AI Summarizer

Thunderbird で受信したメールをローカル AI (Ollama) で要約し、ワンクリックで Obsidian に保存できるアドオンです。
すべての処理がローカルで完結するため、プライバシーを保ちつつ高度なメール管理が可能です。

![Image](https://github.com/user-attachments/assets/09fa1d7d-7e2f-4431-9530-ecf89bad45bb)

## 🌟 主な機能
- **ローカル AI 要約**: Ollama (Gemma 3) を使用した高品質な日本語要約。
- **スレッド履歴の統合**: 過去のやり取り（引用文）を含めた文脈のある要約。
- **Markdown 表示**: `marked.js` を使用した美しく構造化された要約結果。
- **Obsidian 連携**: `/Thunderbird` フォルダへ、メタデータとタグ付きでワンクリック保存。
- **独立ウィンドウ**: 長時間の AI 処理でもエラーが出ない安定した設計。

## 📋 動作要件
- **Thunderbird**: 最新版
- **Ollama**: サーバーが起動していること
- **AI モデル**: `gemma3:12b`
- **Obsidian**: 保存機能を利用する場合

## 🚀 セットアップ方法
1. **Ollama の準備**:
   - `ollama pull gemma3:12b` を実行。
   - 環境変数 `OLLAMA_ORIGINS` を `*` に設定し、Ollama を再起動。
2. **アドオンのインストール**:
   - 本リポジトリをダウンロード。
   - Thunderbird の「アドオンマネージャー」→「一時的なアドオンをデバッグ」から `manifest.json` を選択。

## 📄 ライセンス
MIT License
