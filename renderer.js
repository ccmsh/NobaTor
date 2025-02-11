const { ipcRenderer } = require("electron");

const editor = new EasyMDE({
    element: document.getElementById("editor"),
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "AutoSaveID",
        delay: 1000,
        submit_delay: 5000,
    },
    autofocus: true,
    showIcons: ["code", "table", "image", "link", "preview", "side-by-side"],
});

// 記事タイトルの取得
async function getTitle() {
    return await window.electronAPI.showPrompt({
        title: "記事タイトル",
        label: "記事タイトルを入力",
        inputAttrs: { type: "text" },
        type: "input",
    });
}

// 筆者名の取得
async function getAuthor() {
    return await window.electronAPI.showPrompt({
        title: "筆者の名前",
        label: "MCIDとペンネームを記入",
        inputAttrs: { type: "text" },
        type: "input",
    });
}

// エディタの状態を更新
async function updateEditorState() {
    const title = await getTitle();
    const author = await getAuthor();
    ipcRenderer.send("update-editor-state", { title, author });
}

// 送信ボタンのイベント
document.getElementById("sendButton").addEventListener("click", async () => {
    await updateEditorState(); // エディタの状態を更新
    console.log("📝 エディタの状態が更新されました");

    // 記事タイトルと筆者情報を取得
    const title = await getTitle();
    if (!title) return;
    const name = await getAuthor();
    if (!name) return;

    // メッセージを送信
    const response = await window.electronAPI.sendMessage(await gen(title, name, editor.value()));

    if (response.success) {
        console.log("✅ メッセージが送信されました:", response.message);
    } else {
        console.error("❌ 送信失敗:", response.error);
    }
});


async function getRate(){
    const rate_response = await fetch("https://nobator-rate.pages.dev/index.json")
    const rate = parseFloat(await rate_response.json());
    return rate;
}
async function calc() {
    let text = document.querySelector(".CodeMirror-code").textContent;
    let filter = text.replace(/[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{L}\p{N}]+/gu, '');
    let textlength = filter.length;
    return textlength * await getRate();
}
async function calculateToNowPrice() {
    let price = await calc();
    const result = await window.electronAPI.showPrompt({
        title: "報酬計算",
        label: "現在の記事に対する報酬金額:",
        value: price.toString(),
        inputAttrs: { type: "text", disabled: true }, // 入力不可にする
        type: "input"
    });
}

async function gen(title, name, message) {
    const price = await calc(); // calc() の結果を待機

    return {
        content: `
**新しい投稿があります**
\`\`\`md
${message}
\`\`\``,
        embeds: [
            {
                title: `${title}`,
                description: `${message}`,
                color: 5814783,
                author: {
                    name: "NobaTor通知",
                    icon_url:
                        "https://nobazine.nbm.f5.si/images/avatar_hu0b942d2714472d2dbd10790626981140_19376_300x0_resize_box_3.png",
                },
                footer: {
                    text: `筆者: ${name} | 金額: ${price} | レート: ${await getRate()}`,
                },
            },
        ],
        username: "NobaZine",
        avatar_url:
        "https://nobazine.nbm.f5.si/images/avatar_hu0b942d2714472d2dbd10790626981140_19376_300x0_resize_box_3.png",
        attachments: [],
    };
}

document.getElementById("sendButton").addEventListener("click", async () => {
    // 記事タイトルの入力
    const title = await window.electronAPI.showPrompt({
        title: "記事タイトル",
        label: "記事タイトルを入力",
        inputAttrs: { type: "text" },
        type: "input"
    });

    if (!title) return; // キャンセルされた場合は中断

    // 筆者の名前（MCIDとペンネーム）の入力
    const name = await window.electronAPI.showPrompt({
        title: "筆者の名前",
        label: "MCIDとペンネームを記入",
        inputAttrs: { type: "text" },
        type: "input"
    });

    if (!name) return; // キャンセルされた場合は中断

    // メッセージを送信
    const response = await window.electronAPI.sendMessage(await gen(title, name, editor.value()));

    if (response.success) {
        console.log("✅ メッセージが送信されました:", response.message);
    } else {
        console.error("❌ 送信失敗:", response.error);
    }
});
