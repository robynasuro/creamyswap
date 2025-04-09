// Pastikan Web3.js di-load di HTML sebelum connect.js

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
const balanceInfo = document.querySelector('.balance-info');
const maxBtn = document.getElementById('max-btn');
const estimatedOutput = document.getElementById('estimated-output');
const swapBtn = document.getElementById('swap-btn');
const swapArrow = document.querySelector('.swap-arrow');
const fromTokenBtn = document.getElementById('from-token-btn');
const toTokenBtn = document.getElementById('to-token-btn');

// Contract setup
const swapContractAddress = "0xB564F19A48e8b594B9A9418ef530e33e70017778";
const swapContractAbi = [
    {
        "type": "function",
        "name": "swapTeaToToken",
        "inputs": [
            { "name": "tokenOut", "type": "address" },
            { "name": "amountOutMin", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapTokenToTea",
        "inputs": [
            { "name": "tokenIn", "type": "address" },
            { "name": "amountIn", "type": "uint256" },
            { "name": "amountOutMin", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawTea",
        "inputs": [
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "withdrawToken",
        "inputs": [
            { "name": "token", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "SwapTeaToToken",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true },
            { "name": "tokenOut", "type": "address", "indexed": false },
            { "name": "teaIn", "type": "uint256", "indexed": false },
            { "name": "tokenAmount", "type": "uint256", "indexed": false }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SwapTokenToTea",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true },
            { "name": "tokenIn", "type": "address", "indexed": false },
            { "name": "tokenInAmount", "type": "uint256", "indexed": false },
            { "name": "teaOut", "type": "uint256", "indexed": false }
        ],
        "anonymous": false
    }
];
const erc20Abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            { "name": "_owner", "type": "address" },
            { "name": "_spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Simpen provider dan wallet type
let currentProvider = null;
let walletType = null;
let fromToken = { name: 'TEA', address: 'native' };
let toToken = { name: 'ETH', address: '0x8339581846eDf61dc147966E807e48763dCb09E8' };
let fromBalance = 0;

const TEA_SEPOLIA_CHAIN_ID = 10218;

// Fungsi untuk baca balance token
const getTokenBalance = async (web3, address, token) => {
    if (token.address === 'native') {
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');
    } else {
        const contract = new web3.eth.Contract(erc20Abi, token.address);
        const decimals = await contract.methods.decimals().call();
        const balance = await contract.methods.balanceOf(address).call();
        return (balance / 10**decimals).toFixed(4);
    }
};

// Update balance di input "From"
const updateFromBalance = async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const address = accounts[0];
    fromBalance = await getTokenBalance(web3, address, fromToken);
    fromBalanceSpan.textContent = `${fromBalance} ${fromToken.name}`;
    balanceInfo.style.display = 'flex';
};

// Update estimasi output
const updateEstimatedOutput = () => {
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    let ratio;
    if (fromToken.name === 'TEA' && toToken.name === 'ETH') ratio = 0.0001;
    else if (fromToken.name === 'TEA' && toToken.name === 'USDT') ratio = 0.0001;
    else if (fromToken.name === 'ETH' && toToken.name === 'TEA') ratio = 10000;
    else if (fromToken.name === 'USDT' && toToken.name === 'TEA') ratio = 10000;
    else ratio = 1;

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

// Tombol Swap Arrow
swapArrow.addEventListener('click', async () => {
    const tempToken = fromToken;
    const tempAmount = fromAmountInput.value;

    fromToken = toToken;
    toToken = tempToken;

    fromTokenBtn.innerHTML = `<img src="assets/img/${fromToken.name.toLowerCase()}.png" alt="${fromToken.name}" class="token-img"> ${fromToken.name}`;
    toTokenBtn.innerHTML = `<img src="assets/img/${toToken.name.toLowerCase()}.png" alt="${toToken.name}" class="token-img"> ${toToken.name}`;

    fromAmountInput.value = toAmountInput.value;
    toAmountInput.value = tempAmount;

    await updateFromBalance();
    updateEstimatedOutput();
});

// Tombol Swap
swapBtn.addEventListener('click', async () => {
    console.log('Swap button clicked, provider:', currentProvider);
    if (!currentProvider) {
        alert('Please connect your wallet to Tea Sepolia first!');
        return;
    }
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    console.log('From amount:', fromAmount);
    if (fromAmount <= 0) {
        alert('Please enter a valid amount to swap!');
        return;
    }
    if (fromAmount > parseFloat(fromBalance)) {
        alert('Insufficient balance!');
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    console.log('Account:', accounts[0]);
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const amountIn = web3.utils.toWei(fromAmount.toString(), 'ether');
    let amountOutMin;
    if (fromToken.address === 'native') {
        // TEA ke Token: 1 TEA = 0.0001 token
        amountOutMin = web3.utils.toWei((fromAmount * 0.0001 * 0.95).toString(), 'ether');
    } else {
        // Token ke TEA: 1 token = 10000 TEA
        amountOutMin = web3.utils.toWei((fromAmount * 10000 * 0.95).toString(), 'ether');
    }
    console.log('Amount in:', amountIn, 'Amount out min:', amountOutMin);

    try {
        let tx;
        if (fromToken.address === 'native') {
            console.log('Swapping TEA to', toToken.name, 'at', toToken.address);
            tx = await swapContract.methods.swapTeaToToken(toToken.address, amountOutMin).send({
                from: accounts[0],
                value: amountIn
            });
        } else {
            console.log('Swapping', fromToken.name, 'to TEA');
            const tokenContract = new web3.eth.Contract(erc20Abi, fromToken.address);
            const allowance = await tokenContract.methods.allowance(accounts[0], swapContractAddress).call();
            console.log('Allowance:', allowance);
            if (parseInt(allowance) < parseInt(amountIn)) {
                console.log('Approving', fromToken.name, 'for', amountIn);
                await tokenContract.methods.approve(swapContractAddress, amountIn).send({ from: accounts[0] });
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            tx = await swapContract.methods.swapTokenToTea(fromToken.address, amountIn, amountOutMin).send({
                from: accounts[0]
            });
        }
        console.log('Tx hash:', tx.transactionHash);
        alert(`Swap successful! Tx: ${tx.transactionHash}`);
        await updateFromBalance();
    } catch (error) {
        console.error('Swap error:', error);
        alert('Swap failed! Check console for details.');
    }
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

        const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

        const updateGasFee = async (web3) => {
            const gasPrice = await web3.eth.getGasPrice();
            const gasPriceInEth = web3.utils.fromWei(gasPrice, 'ether');
            const gasEstimate = 21000;
            const gasFeeInEth = gasPriceInEth * gasEstimate;
            const gasFeeInUsd = gasFeeInEth * 2000;
            document.getElementById('gas-fee-value').textContent = `$${gasFeeInUsd.toFixed(2)}`;
            document.getElementById('network-cost').textContent = `$${gasFeeInUsd.toFixed(2)}`;
        };

        const ensureTeaSepolia = async (provider) => {
            try {
                console.log('Checking chain...');
                const chainId = await provider.request({ method: 'eth_chainId' });
                console.log('Current chain ID:', parseInt(chainId, 16));

                if (parseInt(chainId, 16) !== TEA_SEPOLIA_CHAIN_ID) {
                    console.log('Switching to Tea Sepolia...');
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x' + TEA_SEPOLIA_CHAIN_ID.toString(16) }],
                    }).catch(async (switchError) => {
                        if (switchError.code === 4902) {
                            console.log('Adding Tea Sepolia...');
                            await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: '0x' + TEA_SEPOLIA_CHAIN_ID.toString(16),
                                    chainName: 'Tea Sepolia',
                                    rpcUrls: ['https://tea-sepolia.g.alchemy.com/v2/X6UAIRaCqvRedwmWtWHXtKNxG3kQmwh1'],
                                    nativeCurrency: { name: 'TEA', symbol: 'TEA', decimals: 18 },
                                    blockExplorerUrls: ['https://sepolia.tea.xyz']
                                }]
                            });
                        } else {
                            throw switchError;
                        }
                    });

                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const newChainId = await provider.request({ method: 'eth_chainId' });
                    console.log('New chain ID:', parseInt(newChainId, 16));
                    if (parseInt(newChainId, 16) !== TEA_SEPOLIA_CHAIN_ID) {
                        throw new Error('Failed to switch to Tea Sepolia');
                    }
                }
            } catch (error) {
                console.error('Error ensuring Tea Sepolia:', error);
                throw error;
            }
        };

        if (wallet === 'metamask' && window.ethereum) {
            try {
                const provider = window.ethereum;
                console.log('Metamask detected');

                await ensureTeaSepolia(provider);

                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                if (!accounts || accounts.length === 0) throw new Error('No accounts found');

                currentProvider = provider;
                const web3 = new Web3(currentProvider);

                console.log('Connected to Metamask, address:', accounts[0]);
                connectWalletBtn.textContent = formatAddress(accounts[0]);
                await updateGasFee(web3);
                await updateFromBalance();
            } catch (error) {
                console.error('Metamask connection error:', error);
                alert('Failed to connect to Metamask! Ensure it’s unlocked and on Tea Sepolia.');
            }
        } else if (wallet === 'okx' && window.okxwallet) {
            try {
                const provider = window.okxwallet;
                console.log('OKX Wallet detected');

                await ensureTeaSepolia(provider);

                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                if (!accounts || accounts.length === 0) throw new Error('No accounts found');

                currentProvider = provider;
                const web3 = new Web3(currentProvider);

                console.log('Connected to OKX Wallet, address:', accounts[0]);
                connectWalletBtn.textContent = formatAddress(accounts[0]);
                await updateGasFee(web3);
                await updateFromBalance();
            } catch (error) {
                console.error('OKX Wallet connection error:', error);
                alert('Failed to connect to OKX Wallet! Ensure it’s unlocked and on Tea Sepolia.');
            }
        } else {
            alert(`Please install ${wallet === 'metamask' ? 'Metamask' : 'OKX Wallet'} extension!`);
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

    const teaBalance = await getTokenBalance(web3, address, { name: 'TEA', address: 'native' });
    const teaItem = document.createElement('div');
    teaItem.className = 'asset-item';
    teaItem.innerHTML = `<span>TEA</span><span>${parseFloat(teaBalance).toFixed(4)} TEA</span>`;
    assetList.appendChild(teaItem);

    const ethBalance = await getTokenBalance(web3, address, { name: 'ETH', address: '0x8339581846eDf61dc147966E807e48763dCb09E8' });
    const ethItem = document.createElement('div');
    ethItem.className = 'asset-item';
    ethItem.innerHTML = `<span>ETH</span><span>${parseFloat(ethBalance).toFixed(4)} ETH</span>`;
    assetList.appendChild(ethItem);

    const usdtBalance = await getTokenBalance(web3, address, { name: 'USDT', address: '0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168' });
    const usdtItem = document.createElement('div');
    usdtItem.className = 'asset-item';
    usdtItem.innerHTML = `<span>USDT</span><span>${parseFloat(usdtBalance).toFixed(4)} USDT</span>`;
    assetList.appendChild(usdtItem);

    assetModal.style.display = 'block';
    overlay.style.display = 'block';
};

// Disconnect Wallet
disconnectWalletBtn.addEventListener('click', async () => {
    currentProvider = null;
    walletType = null;
    connectWalletBtn.textContent = 'Connect Wallet';
    assetModal.style.display = 'none';
    overlay.style.display = 'none';
    balanceInfo.style.display = 'none';
});

// Token Selection
const tokenSelectModal = document.getElementById('token-select-modal');
const tokenList = document.getElementById('token-list');
const customTokenAddressInput = document.getElementById('custom-token-address');
const addCustomTokenBtn = document.getElementById('add-custom-token-btn');
let currentInput = null;

const selectToken = async (option) => {
    const token = option.getAttribute('data-token');
    const address = option.getAttribute('data-address');
    const btn = currentInput === 'from' ? fromTokenBtn : toTokenBtn;
    btn.innerHTML = `<img src="assets/img/${token.toLowerCase()}.png" alt="${token}" class="token-img"> ${token}`;

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
    if (!Web3.utils.isAddress(tokenAddress)) {
        alert('Please enter a valid token contract address!');
        return;
    }

    const web3 = new Web3(currentProvider);
    const contract = new web3.eth.Contract(erc20Abi, tokenAddress);
    try {
        const symbol = await contract.methods.symbol().call();
        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', symbol);
        tokenOption.setAttribute('data-address', tokenAddress);
        tokenOption.innerHTML = `<img src="assets/img/default-token.png" alt="${symbol}"> ${symbol}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));

        const customTokens = JSON.parse(localStorage.getItem('customTokens')) || [];
        customTokens.push({ symbol, address: tokenAddress });
        localStorage.setItem('customTokens', JSON.stringify(customTokens));

        customTokenAddressInput.value = '';
        alert(`${symbol} added successfully!`);
    } catch (error) {
        console.error('Error adding custom token:', error);
        alert('Failed to add token!');
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

// Load tokens ke modal
const loadTokens = () => {
    const tokens = [
        { name: 'TEA', address: 'native' },
        { name: 'ETH', address: '0x8339581846eDf61dc147966E807e48763dCb09E8' },
        { name: 'USDT', address: '0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168' }
    ];
    tokenList.innerHTML = '';
    tokens.forEach(token => {
        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', token.name);
        tokenOption.setAttribute('data-address', token.address);
        tokenOption.innerHTML = `<img src="assets/img/${token.name.toLowerCase()}.png" alt="${token.name}"> ${token.name}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));
    });
};

loadTokens();
