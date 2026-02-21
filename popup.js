document.getElementById('select-email').addEventListener('click', async () => {
  const resultElem = document.getElementById('result');
  const summaryElem = document.getElementById('summary');

  try {
    resultElem.textContent = "取得中...";
    summaryElem.textContent = "Ollama で要約を生成しています...";

    let response = await browser.runtime.sendMessage({ command: "getEmailInfo" });

    if (response && response.subject) {
      resultElem.textContent = "件名: " + response.subject;
      summaryElem.textContent = response.summary ? "要約(AI): " + response.summary : "(要約を生成できませんでした)";
    } else if (response && response.error) {
      resultElem.textContent = "原因: " + response.error;
      summaryElem.textContent = "";
    } else {
      resultElem.textContent = "取得失敗（詳細不明）";
      summaryElem.textContent = "";
    }
  } catch (error) {
    // ポップアップが閉じられたことによるエラー（正常な挙動）は無視する
    if (error.message.includes("context unloaded") || error.message.includes("destroyed")) {
      return;
    }
    resultElem.textContent = "通信エラー: " + error.message;
    summaryElem.textContent = "";
  }
});