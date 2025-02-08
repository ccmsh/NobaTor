require("dotenv").config();
module.exports = {
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "NobaTor",
        authors: "コカマッシュ",
        description: "NobaZineの記事を執筆するのに最適なエディター"
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
