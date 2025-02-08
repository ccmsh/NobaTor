


async function selectImage() {
    const input = document.getElementById("imageInput");
    input.click(); // input要素のクリックを発火

    input.onchange = async function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                if (!navigator.clipboard) {
                    await window.electronAPI.showPrompt({
                        title: "エラー",
                        label: "URLをコピーできませんでした",
                        type: "alert"
                    });
                    return;
                }

                await navigator.clipboard.writeText(e.target.result);
                await window.electronAPI.showPrompt({
                    title: "成功",
                    label: "画像URLをコピーしました",
                    value: e.target.result,
                    inputAttrs: { type: "text", disabled: true }, // コピーしたURLを表示
                    type: "input"
                });
            };
            reader.readAsDataURL(file);
        }
    };
}
