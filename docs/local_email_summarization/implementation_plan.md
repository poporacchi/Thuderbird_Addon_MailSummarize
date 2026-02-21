# 実装計画 - ローカルメール要約機能の追加

Thunderbirdアドオンにおいて、外部API（AIサーバーなど）を使用せず、ローカル（アドオン内）の処理のみでメール本文の要約を表示する機能を実装します。

## プロジェクトの対応方針
- **ローカル動作の可否**: はい、可能です。ブラウザ（ThunderbirdのGeckoエンジン）内で実行されるJavaScriptのみで、引用の除去やテキストの抽出を行うことができます。
- **要約の手法**: 今回は軽量かつ即時性を重視し、以下の「抽出型要約」のアプローチをとります。
    1. メール全文の取得（API: `browser.messages.getFull`）
    2. 引用行（`>` で始まる行など）および定型表現（Re/Fwdヘッダー）の除去
    3. 本文の冒頭から有効なテキスト（空行等を除外）を特定文字数分抽出して表示

## 変更内容

### [Thunderbird Add-on Component]

#### [MODIFY] [background.js](file:///c:/Users/natur/OneDrive/開発用/Thuderbird_addon/test/background.js)
- `messages.getFull` を使用してメールの本文（プレーンテキスト部分またはHTML部分）を取得する処理を追加します。
- 取得したテキストから引用部分を除去するフィルタ関数を実装します。
- メッセージ `getSubject` を `getEmailSummary` に拡張、または機能を追加して件名と共に要約も返すようにします。

#### [MODIFY] [popup.js](file:///c:/Users/natur/OneDrive/開発用/Thuderbird_addon/test/popup.js)
- `background.js` から返された要約データを受け取り、画面に表示する処理を追加します。

#### [MODIFY] [popup.html](file:///c:/Users/natur/OneDrive/開発用/Thuderbird_addon/test/popup.html)
- 要約を表示するためのエリア（`<div>` や `<p>`）を追加します。

## 完了条件（検証計画）
- [ ] メールを開いた状態でポップアップを実行し、件名に加えて本文の要約が表示されること。
- [ ] 返信（Re:）や転送（Fwd:）のメールにおいて、以前のやり取り（引用部分）が要約に含まれていないこと。
- [ ] 外部ネットワークへの通信が発生せず、ローカルのみで完結していること。
