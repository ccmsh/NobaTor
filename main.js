const { app, BrowserWindow, ipcMain } = require('electron');
const prompt = require('electron-prompt');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// `.env` を確実に読み込む
require('dotenv').config({ path: path.join(app.getAppPath(), '.env') });

let win;

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
});

// 📩 送信メッセージを受け取り、Discord に送信
ipcMain.handle('send-discord-message', async (_, message) => {
    console.log(`📩 受信メッセージ: ${message}`);

    try {
        const webhookURL = process.env.DISCORD_URL;
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
