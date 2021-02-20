

startBtn.addEventListener('click', () => {

    let data = {
        urlValue: url.value,
    }
    
    ipcRenderer.send("key", data);
})