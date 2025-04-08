function connectWallet() {
  const modal = document.getElementById("connect-wallet-modal");
  const overlay = document.getElementById("overlay");

  if (modal.classList.contains("show")) {
    modal.classList.remove("show");
    overlay.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      overlay.style.display = "none";
    }, 300); // Sesuai durasi transisi
  } else {
    modal.style.display = "block";
    overlay.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
      overlay.classList.add("show");
    }, 10); // Delay kecil biar animasi jalan
  }
}

function closeModal() {
  const modal = document.getElementById("connect-wallet-modal");
  const overlay = document.getElementById("overlay");
  modal.classList.remove("show");
  overlay.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
    overlay.style.display = "none";
  }, 300);
}

function connectMetamask() {
  alert("Connecting to Metamask...");
  // Tambahin logika Metamask connection di sini
  closeModal();
}

function connectTrustWallet() {
  alert("Connecting to Trust Wallet...");
  // Tambahin logika Trust Wallet connection di sini
  closeModal();
}

function connectWalletConnect() {
  alert("Connecting to WalletConnect...");
  // Tambahin logika WalletConnect connection di sini
  closeModal();
}
