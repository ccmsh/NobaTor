const { app, BrowserWindow, ipcMain, shell } = require("electron");
const RPC = require("discord-rpc");

const clientId = "1338420378611220480"; // DiscordアプリのClient ID
const rpc = new RPC.Client({ transport: "ipc" });

let mainWindow;
let sessionUrl = "https://your-editor.com/join/session-id"; // 共同執筆用のURL
let editorState = { title: "無題", author: "匿名" }; // エディタの状態

// Electron ウィンドウを作成
app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("src/index.html"); // エディタを読み込む

    // Discord RPCの初期化
    rpc.login({ clientId }).catch(console.error);
});

// Rich Presence の更新関数
async function setActivity() {
    if (!rpc) return;

    rpc.setActivity({
        details: `執筆中: ${editorState.title}`,
        state: `筆者: ${editorState.author}`,
        startTimestamp: Date.now(),
        largeImageKey: "nobator",
        largeImageText: "NobaTor",
        instance: false,
    });
}

// Discord RPCが準備完了時
rpc.on("ready", () => {
    console.log("✅ Discord RPC Ready");
    setActivity();
    setInterval(setActivity, 15000); // 15秒ごとに更新
})

// `renderer.js` からエディタの状態を受け取る
ipcMain.on("update-editor-state", (event, data) => {
    editorState = data;
    setActivity(); // Rich Presence を更新
});

