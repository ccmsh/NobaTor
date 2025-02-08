require("dotenv").config();
module.exports = {
  packagerConfig: {
      icon: "./icon", // アイコン指定（拡張子なしで、Winは.ico, Macは.icns）
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "NobaTor",
        authors: "コカマッシュ",
        description: "NobaZineの記事を執筆するのに最適なエディター",
        setupExe: "NobaTorSetup.exe", // インストーラー名
        setupIcon: "./icon.ico", // アイコン
        noMsi: true, // MSIインストーラーを作らない
        alwaysCreate: true, // Always create
        shortcutName: "NobaTor", // スタートメニューのショートカット名
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "ccmsh",
          name: "NobaTor",
        },
        prerelease: false,
        draft: true,
        authToken: process.env.GITHUB_TOKEN
      },
    },
  ],
};
