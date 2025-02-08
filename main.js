const dotenv = require('dotenv');
const { app, BrowserWindow, ipcMain, autoUpdater, Notification } = require('electron');
const prompt = require('electron-prompt');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
// const { createWindow } = require('./window'); // ウィンドウ作成用モジュール（アプリに合わせて調整）

// `.env` を確実に読み込む
dotenv.config({ path: path.join(app.getAppPath(), '.env') });
// GitHub Releases の URL
const feedURL = `https://update.electronjs.org/ccmsh/NobaTor/${process.platform}-${process.arch}`;
console.log();
let win;

// アップデートの確認
function checkForUpdates() {
  autoUpdater.setFeedURL(feedURL);
  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, 'src', 'index.html'));

    // アップデートの確認
    checkForUpdates();

    // autoUpdater イベントリスナー
    autoUpdater.on('checking-for-update', () => {
        console.log('アップデートを確認中...');
    });

    autoUpdater.on('update-available', () => {
        console.log('新しいアップデートがあります');
    });

    autoUpdater.on('update-not-available', () => {
        console.log('アップデートはありません');
    });

    autoUpdater.on('error', (err) => {
        console.error('自動アップデートエラー:', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = `ダウンロード速度: ${progressObj.bytesPerSecond} - ダウンロード進捗: ${progressObj.percent}% (${progressObj.transferred} / ${progressObj.total})`;
        console.log(log_message);
    });

    autoUpdater.on('update-downloaded', (info) => {
        console.log('アップデートがダウンロードされました');
        autoUpdater.quitAndInstall(); // アップデートをインストール
    });
});

// 📩 送信メッセージを受け取り、Discord に送信
ipcMain.handle('send-discord-message', async (_, message) => {
    console.log(`📩 受信メッセージ: ${message}`);

    try {
        const webhookURL = "https://discord.com/api/webhooks/1337627738063900774/26F-ZtzmT-J2T3uTfXqcJGEH8OGx5o-MoI68b1C52f5put_0Rh7ui4CZEPKO3gJARxW5";
        if (!webhookURL) throw new Error('DISCORD_URL が設定されていません');

        await axios.post(webhookURL, message);
        console.log('✅ メッセージを送信しました');
        return { success: true };
    } catch (error) {
        console.error('❌ 送信エラー:', error.message);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('show-prompt', async (event, options) => {
    return await prompt(options);
});
