const serviceWorker = () => {
    console.log('serviceWorker')
    
    if ("serviceWorker" in navigator) {
        console.log('serviceWorker - ok')
    }
    navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker zarejestrowany"))
        .catch((err: any) => console.error("Błąd SW:", err));
};
