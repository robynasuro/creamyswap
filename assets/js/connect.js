function connectWallet() {
    const modal = document.getElementById("connect-wallet-modal");
    const overlay = document.getElementById("overlay");
    if (modal.style.display === "block") {
        modal.style.display = "none";
        overlay.style.display = "none";
    } else {
        modal.style.display = "block";
        overlay.style.display = "block";
    }
}

function closeModal() {
    document.getElementById("connect-wallet-modal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function connectMetamask() {
    alert("Connecting to Metamask...");
    closeModal();
}

function connectTrustWallet() {
    alert("Connecting to Trust Wallet...");
    closeModal();
}

function connectWalletConnect() {
    alert("Connecting to WalletConnect...");
    closeModal();
}
