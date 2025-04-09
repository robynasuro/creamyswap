// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Connect Wallet
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const connectWalletModal = document.getElementById('connect-wallet-modal');
const assetModal = document.getElementById('asset-modal');
const assetList = document.getElementById('asset-list');
const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
const overlay = document.getElementById('overlay');
const walletOptions = document.querySelectorAll('.wallet-option');

// Swap Elements
const fromAmountInput = document.getElementById('from-amount');
const toAmountInput = document.getElementById('to-amount');
const fromBalanceSpan = document.getElementById('from-balance');
const maxBtn = document.getElementById('max-btn');
const estimatedOutput = document.getElementById('estimated-output');
const swapBtn = document.getElementById('swap-btn');

// Simpen provider dan wallet type
let currentProvider = null;
let walletType = null;
let fromToken = { name: 'TEA', address: 'native' };
let toToken = { name: 'ETH', address: '0x...' }; // Ganti dengan address ETH di TEA Sepolia kalau ada
let fromBalance = 0;

// ERC-20 ABI untuk baca symbol, decimals, dan balance
const erc20Abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    }
];

// Load custom tokens dari localStorage
const loadCustomTokens = () => {
    const customTokens = JSON.parse(localStorage.getItem('customTokens')) || [];
    const tokenList = document.getElementById('token-list');
    customTokens.forEach(token => {
        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', token.symbol);
        tokenOption.setAttribute('data-address', token.address);
        tokenOption.innerHTML = `<img src="assets/img/default-token.png" alt="${token.symbol}"> ${token.symbol}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));
    });
};

// Fungsi untuk baca balance token
const getTokenBalance = async (web3, address, tokenAddress) => {
    if (tokenAddress === 'native') {
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');
    } else {
        const contract = new web3.eth.Contract(erc20Abi, tokenAddress);
        const decimals = await contract.methods.decimals().call();
        const balance = await contract.methods.balanceOf(address).call();
        return (balance / Math.pow(10, decimals)).toFixed(4);
    }
};

// Update balance di input "From"
const updateFromBalance = async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const address = accounts[0];
    fromBalance = await getTokenBalance(web3, address, fromToken.address);
    fromBalanceSpan.textContent = `${fromBalance} ${fromToken.name}`;
};

// Update estimasi output
const updateEstimatedOutput = () => {
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    // Simulasi rasio tukar sederhana: 1 TEA = 0.0001 ETH
    const ratio = 0.0001; // Ganti dengan logika swap bener pas token di-deploy
    const toAmount = fromAmount * ratio;
    toAmountInput.value = toAmount.toFixed(6);
    estimatedOutput.textContent = `~${toAmount.toFixed(6)} ${toToken.name}`;
};

// Event listener buat input "From"
fromAmountInput.addEventListener('input', updateEstimatedOutput);

// Tombol Max
maxBtn.addEventListener('click', () => {
    fromAmountInput.value = fromBalance;
    updateEstimatedOutput();
});

// Tombol Swap (simulasi)
swapBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        return;
    }
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    if (fromAmount <= 0) {
        alert('Please enter a valid amount to swap!');
        return;
    }
    if (fromAmount > parseFloat(fromBalance)) {
        alert('Insufficient balance!');
        return;
    }
    alert(`Swapping ${fromAmount} ${fromToken.name} to ${toAmountInput.value} ${toToken.name} (simulated)`);
    // Tambah logika swap bener pas token di-deploy
});

// Connect Wallet
connectWalletBtn.addEventListener('click', () => {
    if (connectWalletBtn.textContent !== 'Connect Wallet') {
        showAssets();
    } else {
        connectWalletModal.style.display = 'block';
        overlay.style.display = 'block';
    }
});

walletOptions.forEach(option => {
    option.addEventListener('click', async () => {
        const wallet = option.getAttribute('data-wallet');
        walletType = wallet;
        
        connectWalletModal.style.display = 'none';
        overlay.style.display = 'none';

        const formatAddress = (address) => {
            if (!address) return '';
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        };

        const updateGasFee = async (web3) => {
            try {
                const gasPrice = await web3.eth.getGasPrice();
                const gasPriceInEth = web3.utils.fromWei(gasPrice, 'ether');
                const gasEstimate = 21000;
                const gasFeeInEth = gasPriceInEth * gasEstimate;
                const gasFeeInUsd = gasFeeInEth * 2000;
                document.getElementById('gas-fee-value').textContent = `$${gasFeeInUsd.toFixed(2)}`;
                document.getElementById('network-cost').textContent = `$${gasFeeInUsd.toFixed(2)}`;
            } catch (error) {
                console.error('Error fetching gas fee:', error);
            }
        };

        const addTeaSepoliaNetwork = async (provider) => {
            try {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x27EA',
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
            } catch (error) {
                console.error('Error adding TEA Sepolia network:', error);
            }
        };

        if (wallet === 'metamask' && typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                currentProvider = window.ethereum;
                const web3 = new Web3(currentProvider);
                await addTeaSepoliaNetwork(currentProvider);
                const chainId = await web3.eth.getChainId();
                console.log('Connected to chain ID (Metamask):', chainId);

                if (accounts && accounts.length > 0) {
                    const formattedAddress = formatAddress(accounts[0]);
                    connectWalletBtn.textContent = formattedAddress;
                } else {
                    connectWalletBtn.textContent = 'Connect Wallet';
                }

                await updateGasFee(web3);
                await updateFromBalance();
            } catch (error) {
                console.error('Error connecting to Metamask:', error);
                connectWalletBtn.textContent = 'Connect Wallet';
            }
        }

        else if (wallet === 'okx' && typeof window.okxwallet !== 'undefined') {
            try {
                const accounts = await window.okxwallet.request({ method: 'eth_requestAccounts' });
                currentProvider = window.okxwallet;
                const web3 = new Web3(currentProvider);
                await addTeaSepoliaNetwork(currentProvider);
                const chainId = await web3.eth.getChainId();
                console.log('Connected to chain ID (OKX Wallet):', chainId);

                if (accounts && accounts.length > 0) {
                    const formattedAddress = formatAddress(accounts[0]);
                    connectWalletBtn.textContent = formattedAddress;
                } else {
                    connectWalletBtn.textContent = 'Connect Wallet';
                }

                await updateGasFee(web3);
                await updateFromBalance();
            } catch (error) {
                console.error('Error connecting to OKX Wallet:', error);
                connectWalletBtn.textContent = 'Connect Wallet';
            }
        }

        else if (wallet === 'walletconnect') {
            try {
                const provider = new WalletConnectProvider({
                    rpc: {
                        10218: 'https://tea-sepolia.g.alchemy.com/v2/X6UAIRaCqvRedwmWtWHXtKNxG3kQmwh1'
                    },
                    chainId: 10218
                });
                const accounts = await provider.enable();
                currentProvider = provider;
                const web3 = new Web3(provider);
                const chainId = await web3.eth.getChainId();
                console.log('Connected to chain ID (WalletConnect):', chainId);

                if (accounts && accounts.length > 0) {
                    const formattedAddress = formatAddress(accounts[0]);
                    connectWalletBtn.textContent = formattedAddress;
                } else {
                    connectWalletBtn.textContent = 'Connect Wallet';
                }

                await updateGasFee(web3);
                await updateFromBalance();

                provider.on('disconnect', () => {
                    console.log('WalletConnect disconnected');
                    connectWalletBtn.textContent = 'Connect Wallet';
                    currentProvider = null;
                    walletType = null;
                });

                provider.on('accountsChanged', (newAccounts) => {
                    if (newAccounts && newAccounts.length > 0) {
                        const formattedAddress = formatAddress(newAccounts[0]);
                        connectWalletBtn.textContent = formattedAddress;
                    } else {
                        connectWalletBtn.textContent = 'Connect Wallet';
                        currentProvider = null;
                        walletType = null;
                    }
                });
            } catch (error) {
                console.error('Error connecting to WalletConnect:', error);
                connectWalletBtn.textContent = 'Connect Wallet';
            }
        }
    });
});

// Fungsi untuk nampilin asset
const showAssets = async () => {
    if (!currentProvider) return;

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const address = accounts[0];
    assetList.innerHTML = '';

    try {
        const balance = await web3.eth.getBalance(address);
        const balanceInTea = web3.utils.fromWei(balance, 'ether');
        const teaItem = document.createElement('div');
        teaItem.className = 'asset-item';
        teaItem.innerHTML = `<span>TEA</span><span>${parseFloat(balanceInTea).toFixed(4)} TEA</span>`;
        assetList.appendChild(teaItem);
    } catch (error) {
        console.error('Error fetching TEA balance:', error);
    }

    const usdtContractAddress = '0x...'; // Ganti dengan address USDT di TEA Sepolia kalau ada
    try {
        const usdtContract = new web3.eth.Contract(erc20Abi, usdtContractAddress);
        const decimals = await usdtContract.methods.decimals().call();
        const balance = await usdtContract.methods.balanceOf(address).call();
        const balanceInUsdt = balance / Math.pow(10, decimals);
        const usdtItem = document.createElement('div');
        usdtItem.className = 'asset-item';
        usdtItem.innerHTML = `<span>USDT</span><span>${parseFloat(balanceInUsdt).toFixed(2)} USDT</span>`;
        assetList.appendChild(usdtItem);
    } catch (error) {
        console.error('Error fetching USDT balance:', error);
    }

    assetModal.style.display = 'block';
    overlay.style.display = 'block';
};

// Disconnect Wallet
disconnectWalletBtn.addEventListener('click', async () => {
    if (walletType === 'walletconnect' && currentProvider) {
        try {
            await currentProvider.disconnect();
        } catch (error) {
            console.error('Error disconnecting WalletConnect:', error);
        }
    }
    currentProvider = null;
    walletType = null;
    connectWalletBtn.textContent = 'Connect Wallet';
    assetModal.style.display = 'none';
    overlay.style.display = 'none';
    fromBalanceSpan.textContent = '0.0';
});

// Token Selection
const fromTokenBtn = document.getElementById('from-token-btn');
const toTokenBtn = document.getElementById('to-token-btn');
const tokenSelectModal = document.getElementById('token-select-modal');
const tokenList = document.getElementById('token-list');
const customTokenAddressInput = document.getElementById('custom-token-address');
const addCustomTokenBtn = document.getElementById('add-custom-token-btn');
let currentInput = null;

// Load custom tokens pas halaman dibuka
loadCustomTokens();

const selectToken = async (option) => {
    const token = option.getAttribute('data-token');
    const address = option.getAttribute('data-address');
    const imgSrc = option.querySelector('img').src;
    const btn = currentInput === 'from' ? fromTokenBtn : toTokenBtn;
    btn.innerHTML = `<img src="${imgSrc}" alt="${token}" class="token-img"> ${token}`;
    
    if (currentInput === 'from') {
        fromToken = { name: token, address };
        await updateFromBalance();
    } else {
        toToken = { name: token, address };
    }
    
    tokenSelectModal.style.display = 'none';
    overlay.style.display = 'none';
    updateEstimatedOutput();
};

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

tokenList.querySelectorAll('.token-option').forEach(option => {
    option.addEventListener('click', () => selectToken(option));
});

// Add Custom Token
addCustomTokenBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        return;
    }

    const tokenAddress = customTokenAddressInput.value.trim();
    if (!tokenAddress || !web3.utils.isAddress(tokenAddress)) {
        alert('Please enter a valid token contract address!');
        return;
    }

    const web3 = new Web3(currentProvider);
    try {
        const contract = new web3.eth.Contract(erc20Abi, tokenAddress);
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();

        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', symbol);
        tokenOption.setAttribute('data-address', tokenAddress);
        tokenOption.innerHTML = `<img src="assets/img/default-token.png" alt="${symbol}"> ${symbol}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));

        // Simpen ke localStorage
        const customTokens = JSON.parse(localStorage.getItem('customTokens')) || [];
        customTokens.push({ symbol, address: tokenAddress, decimals });
        localStorage.setItem('customTokens', JSON.stringify(customTokens));

        customTokenAddressInput.value = '';
        alert(`${symbol} added successfully!`);
    } catch (error) {
        console.error('Error adding custom token:', error);
        alert('Failed to add token. Please check the contract address.');
    }
});

overlay.addEventListener('click', () => {
    connectWalletModal.style.display = 'none';
    tokenSelectModal.style.display = 'none';
    assetModal.style.display = 'none';
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
        maxSlippage.textContent = `Auto ${slippage}%`;
    });
});

document.addEventListener('click', (e) => {
    if (!settingsBtn.contains(e.target) && !slippagePopup.contains(e.target)) {
        slippagePopup.style.display = 'none';
    }
});

// Swap Info Toggle
const swapInfoToggle = document.querySelector('.swap-info-toggle');
const swapInfoDetails = document.getElementById('swap-info-details');

swapInfoToggle.addEventListener('click', () => {
    swapInfoToggle.classList.toggle('active');
    swapInfoDetails.classList.toggle('active');
});
