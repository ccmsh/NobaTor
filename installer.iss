; Inno Setup Script for NobaTor
#define MyAppName "NobaTor"
#define MyAppVersion "1.1.1"
#define MyAppPublisher "コカマッシュ"
#define MyAppURL "https://github.com/ccmsh/NobaTor"
#define MyAppExeName "NobaTor.exe"

[Setup]
AppId={{net.cocamush.nobator}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputBaseFilename=NobaTorInstaller
SetupIconFile=icon.ico
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
UninstallDisplayIcon={app}\{#MyAppExeName}
OutputDir=out

[Files]
Source: "C:\Users\creep\NobaTor\out\make\squirrel.windows\x64\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "デスクトップにショートカットを作成する"; GroupDescription: "追加オプション:"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent
