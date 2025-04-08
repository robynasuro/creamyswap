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

function connectOKXWallet() {
  alert("Connecting to OKX Wallet...");
  closeModal();
}

function connectWalletConnect() {
  alert("Connecting to WalletConnect...");
  closeModal();
}

function toggleTheme() {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
  } else {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
  }
}

let currentSlippage = 0.5; // Default slippage

function performSwap() {
  const amountIn = document.getElementById("amount-in").value;
  const tokenIn = document.getElementById("token-in").value;
  const tokenOut = document.getElementById("token-out").value;
  const amountOutField = document.getElementById("amount-out");
  const rateInfo = document.getElementById("rate-info");
  const priceImpactField = document.getElementById("price-impact");
  const minReceivedField = document.getElementById("min-received");

  if (!amountIn || amountIn <= 0) {
      rateInfo.textContent = "Please enter a valid amount.";
      amountOutField.value = "";
      priceImpactField.textContent = "0%";
      minReceivedField.textContent = "0";
      return;
  }

  let rate = 1;
  if (tokenIn === "ETH" && tokenOut === "CREAM") rate = 1000;
  else if (tokenIn === "CREAM" && tokenOut === "ETH") rate = 0.001;
  else if (tokenIn === "USDT" && tokenOut === "CREAM") rate = 0.5;
  else if (tokenIn === "CREAM" && tokenOut === "USDT") rate = 2;
  else if (tokenIn === "ETH" && tokenOut === "USDT") rate = 2000;
  else if (tokenIn === "USDT" && tokenOut === "ETH") rate = 0.0005;

  const amountOut = amountIn * rate;
  
  const slippageFactor = 1 - (currentSlippage / 100);
  const minReceived = amountOut * slippageFactor;

  const priceImpact = Math.min((amountIn / 1000) * 100, 10).toFixed(2);

  amountOutField.value = amountOut.toFixed(6);
  rateInfo.textContent = `1 ${tokenIn} = ${rate} ${tokenOut}`;
  priceImpactField.textContent = `${priceImpact}%`;
  minReceivedField.textContent = `${minReceived.toFixed(6)} ${tokenOut}`;
}

function switchTokens() {
  const tokenIn = document.getElementById("token-in");
  const tokenOut = document.getElementById("token-out");
  const amountIn = document.getElementById("amount-in");
  const amountOut = document.getElementById("amount-out");

  const tempToken = tokenIn.value;
  tokenIn.value = tokenOut.value;
  tokenOut.value = tempToken;

  const tempAmount = amountIn.value;
  amountIn.value = amountOut.value;
  amountOut.value = tempAmount;

  if (amountIn.value) performSwap();
}

function toggleSlippagePopup() {
  const popup = document.getElementById("slippage-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function setSlippage(value) {
  currentSlippage = value;
  const buttons = document.querySelectorAll(".slippage-btn");
  buttons.forEach(btn => {
      btn.classList.remove("active");
      if (parseFloat(btn.getAttribute("data-slippage")) === value) {
          btn.classList.add("active");
      }
  });
  document.getElementById("slippage-custom").value = "";
  performSwap();
}

function setCustomSlippage() {
  const customInput = document.getElementById("slippage-custom");
  const value = parseFloat(customInput.value);
  if (value > 0) {
      currentSlippage = value;
      const buttons = document.querySelectorAll(".slippage-btn");
      buttons.forEach(btn => btn.classList.remove("active"));
      performSwap();
  }
}

document.getElementById("amount-in").addEventListener("input", performSwap);
document.getElementById("token-in").addEventListener("change", performSwap);
document.getElementById("token-out").addEventListener("change", performSwap);

document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.checked = false;
  // Set default slippage button as active
  setSlippage(0.5);
});
