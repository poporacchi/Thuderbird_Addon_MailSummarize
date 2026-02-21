// Ollama 連携用のバックグラウンドスクリプト
const OLLAMA_URL = "http://localhost:11434/api/generate";
const DEFAULT_MODEL = "gemma3:12b"; 

// ボタンクリック時のイベント（ポップアップの代わりにウィンドウを開く）
browser.messageDisplayAction.onClicked.addListener(async (tab) => {
  try {
    const messageHeader = await browser.messageDisplay.getDisplayedMessage(tab.id);
    if (!messageHeader) {
      console.error("メッセージが取得できませんでした");
      return;
    }

    // 独立したウィンドウを作成
    await browser.windows.create({
      url: `summary.html?messageId=${messageHeader.id}`,
      type: "popup",
      width: 700, // 幅も少し広げる
      height: 950  // 高さを約2倍に拡張
    });
  } catch (e) {
    console.error("ウィンドウ作成エラー:", e);
  }
});

// メッセージリスナー
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'getEmailContentForSummary') {
    getEmailContent(message.messageId).then(sendResponse);
    return true;
  } else if (message.command === 'getOllamaSummary') {
    getOllamaSummary(message.body).then(sendResponse);
    return true;
  }
});

async function getEmailContent(messageId) {
  try {
    const messageHeader = await browser.messages.get(messageId);
    if (!messageHeader) throw new Error("メッセージが見つかりません");

    const fullMessage = await browser.messages.getFull(messageId);
    let body = "";

    function findPlainText(part) {
      if (part.contentType === "text/plain") return part.body;
      if (part.parts) {
        for (let subPart of part.parts) {
          let text = findPlainText(subPart);
          if (text) return text;
        }
      }
      return null;
    }

    body = findPlainText(fullMessage) || "";
    if (!body && fullMessage.contentType === "text/plain") body = fullMessage.body;

    return {
      subject: messageHeader.subject || "(件名なし)",
      date: messageHeader.date.toLocaleString('ja-JP'), // 受信日時を追加
      body: cleanMessageBody(body)
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function getOllamaSummary(cleanedBody) {
  try {
    if (!cleanedBody) return "(本文が空です)";

    console.log("[Ollama] 要約リクエスト送信中...");

    const prompt = `以下のメール本文を日本語で簡潔に要約してください。
引用部分や署名は含めず、重要な内容のみを3行程度でまとめてください。

---
${cleanedBody}
---
要約：`;

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`モデル '${DEFAULT_MODEL}' が見つかりませんでした。'ollama pull ${DEFAULT_MODEL}' を実行してください。`);
      }
      throw new Error(`Ollama エラー: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response.trim();

  } catch (e) {
    console.error("[Ollama Error]", e);
    if (e.message.includes("Failed to fetch")) {
      return "(Ollama に接続できません。Ollama が起動しているか、OLLAMA_ORIGINS の設定を確認してください)";
    }
    return "(要約に失敗しました: " + e.message + ")";
  }
}

function cleanMessageBody(text) {
  if (!text) return "";
  let lines = text.split(/\r?\n/);
  let filteredLines = [];

  for (let line of lines) {
    let trimmed = line.trim();
    // 引用符（>）を削除せず、そのまま保持して AI に渡す
    // ただし、空の引用行が続く場合は整理する
    if (trimmed === ">") {
      if (filteredLines.length > 0 && filteredLines[filteredLines.length - 1] === ">") continue;
    }

    if (trimmed.match(/.* (wrote|wrote:|さんは書きました):$/i)) {
      filteredLines.push("\n[過去のやり取り]:");
      continue;
    }
    if (trimmed.match(/^On .* at .*, .* (wrote|wrote:)$/i)) {
      filteredLines.push("\n[過去のやり取り]:");
      continue;
    }
    if (trimmed.match(/^-----Original Message-----/i)) {
      filteredLines.push("\n[元のメッセージ]:");
      continue;
    }
    filteredLines.push(line);
  }
  return filteredLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}