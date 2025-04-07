document.addEventListener('DOMContentLoaded', function () {
  const connectWalletBtn = document.getElementById('connectWalletBtn');

  connectWalletBtn.addEventListener('click', () => {
    // Tampilkan pop-up pilihan wallet
    document.getElementById('walletPopup').style.display = 'block';
  });

  // Tutup pop-up kalau klik luar atau tombol close
  document.querySelectorAll('.wallet-option').forEach(button => {
    button.addEventListener('click', async function () {
      const type = this.dataset.type;
      if (type === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            connectWalletBtn.textContent = account.slice(0, 6) + '...' + account.slice(-4);
            console.log('Connected:', account);
          } catch (err) {
            console.error('Rejected:', err);
          }
        } else {
          alert('MetaMask not installed.');
        }
      }

      // Tutup pop-up setelah pilih
      document.getElementById('walletPopup').style.display = 'none';
    });
  });

  // Close popup kalau klik X
  document.getElementById('closeWalletPopup').addEventListener('click', () => {
    document.getElementById('walletPopup').style.display = 'none';
  });
});

document.getElementById("connectWalletBtn").addEventListener("click", () => {
  document.getElementById("walletPopup").style.display = "flex";
});

document.getElementById("closeWalletPopup").addEventListener("click", () => {
  document.getElementById("walletPopup").style.display = "none";
});

document.querySelectorAll(".wallet-option").forEach(button => {
  button.addEventListener("click", async () => {
    const type = button.getAttribute("data-type");
    if (type === "metamask" && window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        alert("MetaMask connected!");
      } catch (err) {
        console.error(err);
      }
    } else if (type === "okx" && window.okxwallet) {
      try {
        await window.okxwallet.ethereum.request({ method: "eth_requestAccounts" });
        alert("OKX Wallet connected!");
      } catch (err) {
        console.error(err);
      }
    } else if (type === "walletconnect") {
      alert("WalletConnect integration coming soon...");
    } else {
      alert("Wallet not detected.");
    }

    document.getElementById("walletPopup").style.display = "none";
  });
});
