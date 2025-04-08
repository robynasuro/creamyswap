// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Connect Wallet
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const connectWalletModal = document.getElementById('connect-wallet-modal');
const overlay = document.getElementById('overlay');
const walletOptions = document.querySelectorAll('.wallet-option');

connectWalletBtn.addEventListener('click', () => {
    connectWalletModal.style.display = 'block';
    overlay.style.display = 'block';
});

walletOptions.forEach(option => {
    option.addEventListener('click', async () => {
        const wallet = option.getAttribute('data-wallet');
        connectWalletBtn.textContent = `Connected: ${wallet}`;
        connectWalletModal.style.display = 'none';
        overlay.style.display = 'none';

        // Integrasi dengan Web3.js untuk connect ke jaringan TEA Sepolia
        if (wallet === 'metamask' && typeof window.ethereum !== 'undefined') {
            try {
                // Request akun dari Metamask
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Setup Web3 dengan RPC TEA Sepolia
                const web3 = new Web3(new Web3.providers.HttpProvider('https://tea-sepolia.g.alchemy.com/v2/X6UAIRaCqvRedwmWtWHXtKNxG3kQmwh1'));

                // Cek jaringan
                const chainId = await web3.eth.getChainId();
                console.log('Connected to chain ID:', chainId);

                // Tambah jaringan TEA Sepolia ke Metamask (opsional, kalau belum ada)
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x27EA', // Chain ID TEA Sepolia (10218 dalam hex)
                        chainName: 'Tea Sepolia',
                        rpcUrls: ['https://tea-sepolia.g.alchemy.com/v2/X6UAIRaCqvRedwmWtWHXtKNxG3kQmwh1'],
                        nativeCurrency: {
                            name: 'TEA',
                            symbol: 'TEA',
                            decimals: 18
                        },
                        blockExplorerUrls: ['https://sepolia.tea.xyz']
                    }]
                });

                // Ambil estimasi gas fee (contoh sederhana)
                const gasPrice = await web3.eth.getGasPrice();
                const gasPriceInEth = web3.utils.fromWei(gasPrice, 'ether');
                const gasEstimate = 21000; // Estimasi gas untuk transaksi sederhana
                const gasFeeInEth = gasPriceInEth * gasEstimate;
                const gasFeeInUsd = gasFeeInEth * 2000; // Asumsi 1 ETH = $2000
                document.getElementById('gas-fee-value').textContent = `$${gasFeeInUsd.toFixed(2)}`;
                document.getElementById('network-cost').textContent = `$${gasFeeInUsd.toFixed(2)}`;
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        }
    });
});

overlay.addEventListener('click', () => {
    connectWalletModal.style.display = 'none';
    tokenSelectModal.style.display = 'none';
    overlay.style.display = 'none';
});

// Slippage Settings
const settingsBtn = document.querySelector('.settings-btn');
const slippagePopup = document.getElementById('slippage-popup');
const slippageButtons = document.querySelectorAll('.slippage-btn');
const maxSlippage = document.getElementById('max-slippage');

settingsBtn.addEventListener('click', () => {
    slippagePopup.style.display = slippagePopup.style.display === 'block' ? 'none' : 'block';
});

slippageButtons.forEach(button => {
    button.addEventListener('click', () => {
        slippageButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const slippage = button.getAttribute('data-slippage');
        maxSlippage.textContent = `Auto ${slippage}%`; // Update nilai Max Slippage di detail
    });
});

document.addEventListener('click', (e) => {
    if (!settingsBtn.contains(e.target) && !slippagePopup.contains(e.target)) {
        slippagePopup.style.display = 'none';
    }
});

// Token Selection
const fromTokenBtn = document.getElementById('from-token-btn');
const toTokenBtn = document.getElementById('to-token-btn');
const tokenSelectModal = document.getElementById('token-select-modal');
const tokenOptions = document.querySelectorAll('.token-option');
let currentInput = null;

fromTokenBtn.addEventListener('click', () => {
    currentInput = 'from';
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
});

toTokenBtn.addEventListener('click', () => {
    currentInput = 'to';
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
});

tokenOptions.forEach(option => {
    option.addEventListener('click', () => {
        const token = option.getAttribute('data-token');
        const imgSrc = option.querySelector('img').src;
        const btn = currentInput === 'from' ? fromTokenBtn : toTokenBtn;
        btn.innerHTML = `<img src="${imgSrc}" alt="${token}" class="token-img"> ${token}`;
        tokenSelectModal.style.display = 'none';
        overlay.style.display = 'none';
    });
});

// Swap Info Toggle
const swapInfoToggle = document.querySelector('.swap-info-toggle');
const swapInfoDetails = document.getElementById('swap-info-details');

swapInfoToggle.addEventListener('click', () => {
    swapInfoToggle.classList.toggle('active');
    swapInfoDetails.classList.toggle('active');
});
