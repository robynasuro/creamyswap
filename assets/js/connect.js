// Pastikan Web3.js di-load di HTML sebelum connect.js
// <script src="https://cdn.jsdelivr.net/npm/web3@1.7.0/dist/web3.min.js"></script>

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
const swapInfoToggle = document.querySelector('.swap-info-toggle');
const swapInfoDetails = document.getElementById('swap-info-details');
const settingsBtn = document.querySelector('.settings-btn');
const slippagePopup = document.getElementById('slippage-popup');
const slippageButtons = document.querySelectorAll('.slippage-btn');

// Contract setup
const swapContractAddress = "0x2Df375927056AA8dC0fDBbA701Db8eA6AAf3203F";
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
        "name": "swapTokenToToken",
        "inputs": [
            { "name": "tokenIn", "type": "address" },
            { "name": "tokenOut", "type": "address" },
            { "name": "amountIn", "type": "uint256" },
            { "name": "amountOutMin", "type": "uint256" }
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
    },
    {
        "type": "event",
        "name": "SwapTokenToToken",
        "inputs": [
            { "name": "user", "type": "address", "indexed": true },
            { "name": "tokenIn", "type": "address", "indexed": false },
            { "name": "tokenOut", "type": "address", "indexed": false },
            { "name": "amountIn", "type": "uint256", "indexed": false },
            { "name": "amountOut", "type": "uint256", "indexed": false }
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
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Simpen provider dan wallet type
let currentProvider = null;
let walletType = null;
let fromToken = { name: 'TEA', address: 'native' };
let toToken = { name: 'ETH', address: '0xA8AA9806De2A5b8E8C9C81DA7accE4A883f66476' };
let fromBalance = 0;
let slippageTolerance = 0.5; // Default slippage

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
    await updateSwapButtonState();
};

// Update estimasi output
const updateEstimatedOutput = async () => {
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    let ratio;
    if (fromToken.name === 'TEA' && (toToken.name === 'ETH' || toToken.name === 'USDT')) ratio = 0.0001;
    else if ((fromToken.name === 'ETH' || fromToken.name === 'USDT') && toToken.name === 'TEA') ratio = 10000;
    else if (fromToken.name === 'ETH' && toToken.name === 'USDT') ratio = 1;
    else if (fromToken.name === 'USDT' && toToken.name === 'ETH') ratio = 1;
    else ratio = 1;

    const toAmount = fromAmount * ratio;
    toAmountInput.value = toAmount.toFixed(6);
    estimatedOutput.textContent = `~${toAmount.toFixed(6)} ${toToken.name}`;

    const slippageFactor = 1 - (slippageTolerance / 100);
    const minReceived = toAmount * slippageFactor;
    document.getElementById('minimum-received').textContent = `${minReceived.toFixed(6)} ${toToken.name}`;
    document.getElementById('price-impact').textContent = '0.1%';
    document.getElementById('max-slippage').textContent = `${slippageTolerance}%`;

    if (currentProvider) {
        const web3 = new Web3(currentProvider);
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = 100000;
        const gasFeeInEth = web3.utils.fromWei((gasPrice * gasEstimate).toString(), 'ether');
        const gasFeeInUsd = gasFeeInEth * 2000;
        document.getElementById('gas-fee-value').textContent = `$${gasFeeInUsd.toFixed(2)}`;
        document.getElementById('network-cost').textContent = `$${gasFeeInUsd.toFixed(2)}`;

        if (toToken.address !== 'native') {
            const tokenContract = new web3.eth.Contract(erc20Abi, toToken.address);
            const decimals = await tokenContract.methods.decimals().call();
            const balance = await tokenContract.methods.balanceOf(swapContractAddress).call();
            console.log(`Contract balance ${toToken.name}: ${(balance / 10**decimals).toFixed(4)}`);
        }
        const teaBalance = await web3.eth.getBalance(swapContractAddress);
        console.log(`Contract balance TEA: ${web3.utils.fromWei(teaBalance, 'ether')}`);
    }
    await updateSwapButtonState();
};

// Fungsi cek allowance dan update tombol Approve/Swap
const updateSwapButtonState = async () => {
    if (!currentProvider || fromToken.address === 'native') {
        swapBtn.textContent = 'Swap';
        swapBtn.dataset.action = 'swap';
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    if (fromAmount <= 0) {
        swapBtn.textContent = 'Enter an amount';
        swapBtn.disabled = true;
        return;
    } else {
        swapBtn.disabled = false;
    }

    const amountIn = web3.utils.toWei(fromAmount.toString(), 'ether');
    const tokenContract = new web3.eth.Contract(erc20Abi, fromToken.address);
    const allowance = await tokenContract.methods.allowance(accounts[0], swapContractAddress).call();

    if (parseInt(allowance) < parseInt(amountIn)) {
        swapBtn.textContent = `Approve ${fromToken.name}`;
        swapBtn.dataset.action = 'approve';
    } else {
        swapBtn.textContent = 'Swap';
        swapBtn.dataset.action = 'swap';
    }
};

// Event listener buat input "From" dan token selection
fromAmountInput.addEventListener('input', async () => {
    await updateEstimatedOutput();
    await updateSwapButtonState();
});

fromTokenBtn.addEventListener('click', async () => {
    currentInput = 'from';
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
    await updateSwapButtonState();
});

toTokenBtn.addEventListener('click', async () => {
    currentInput = 'to';
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
    await updateSwapButtonState();
});

// Tombol Max
maxBtn.addEventListener('click', async () => {
    fromAmountInput.value = fromBalance;
    await updateEstimatedOutput();
    await updateSwapButtonState();
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
    await updateEstimatedOutput();
    await updateSwapButtonState();
});

// Slippage Settings
settingsBtn.addEventListener('click', () => {
    slippagePopup.style.display = slippagePopup.style.display === 'block' ? 'none' : 'block';
});

slippageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        slippageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        slippageTolerance = parseFloat(btn.dataset.slippage);
        document.getElementById('max-slippage').textContent = `${slippageTolerance}%`;
        updateEstimatedOutput();
        slippagePopup.style.display = 'none';
    });
});

// Tombol Swap/Approve
swapBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet to Tea Sepolia first!');
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

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const amountIn = web3.utils.toWei(fromAmount.toString(), 'ether');
    const slippageFactor = 1 - (slippageTolerance / 100);
    let amountOutMin;

    try {
        if (swapBtn.dataset.action === 'approve') {
            const tokenContract = new web3.eth.Contract(erc20Abi, fromToken.address);
            swapBtn.textContent = `Approving ${fromToken.name}...`;
            swapBtn.disabled = true;
            await tokenContract.methods.approve(swapContractAddress, amountIn).send({ from: accounts[0] });
            await new Promise(resolve => setTimeout(resolve, 2000));
            swapBtn.textContent = 'Swap';
            swapBtn.dataset.action = 'swap';
            swapBtn.disabled = false;
            return;
        }

        let tx;
        if (fromToken.address === 'native') {
            amountOutMin = web3.utils.toWei((fromAmount * 0.0001 * slippageFactor).toString(), 'ether');
            console.log('Swapping TEA to', toToken.name, 'at', toToken.address, 'with min output:', web3.utils.fromWei(amountOutMin, 'ether'));
            const tokenBalance = toToken.address === 'native' ? 
                await web3.eth.getBalance(swapContractAddress) : 
                await new web3.eth.Contract(erc20Abi, toToken.address).methods.balanceOf(swapContractAddress).call();
            if (parseInt(tokenBalance) < parseInt(amountOutMin)) {
                throw new Error(`Insufficient ${toToken.name} liquidity in contract: ${web3.utils.fromWei(tokenBalance, 'ether')}`);
            }
            tx = await swapContract.methods.swapTeaToToken(toToken.address, amountOutMin).send({
                from: accounts[0],
                value: amountIn,
                gas: 300000
            });
        } else if (toToken.address === 'native') {
            amountOutMin = web3.utils.toWei((fromAmount * 10000 * slippageFactor).toString(), 'ether');
            console.log('Swapping', fromToken.name, 'to TEA with min output:', web3.utils.fromWei(amountOutMin, 'ether'));
            const teaBalance = await web3.eth.getBalance(swapContractAddress);
            if (parseInt(teaBalance) < parseInt(amountOutMin)) {
                throw new Error(`Insufficient TEA liquidity in contract: ${web3.utils.fromWei(teaBalance, 'ether')}`);
            }
            tx = await swapContract.methods.swapTokenToTea(fromToken.address, amountIn, amountOutMin).send({
                from: accounts[0],
                gas: 300000
            });
        } else {
            amountOutMin = web3.utils.toWei((fromAmount * 1 * slippageFactor).toString(), 'ether');
            console.log('Swapping', fromToken.name, 'to', toToken.name, 'with min output:', web3.utils.fromWei(amountOutMin, 'ether'));
            const tokenBalance = await new web3.eth.Contract(erc20Abi, toToken.address).methods.balanceOf(swapContractAddress).call();
            if (parseInt(tokenBalance) < parseInt(amountOutMin)) {
                throw new Error(`Insufficient ${toToken.name} liquidity in contract: ${web3.utils.fromWei(tokenBalance, 'ether')}`);
            }
            tx = await swapContract.methods.swapTokenToToken(fromToken.address, toToken.address, amountIn, amountOutMin).send({
                from: accounts[0],
                gas: 300000
            });
        }
        console.log('Tx hash:', tx.transactionHash);
        const modal = document.getElementById('success-modal');
        const message = document.getElementById('success-message');
        const txLink = document.getElementById('tx-link');
        const closeModal = document.getElementById('close-modal');

        message.textContent = `Swapped ${fromAmount} ${fromToken.name} to ${toToken.name}!`;
        txLink.href = `https://sepolia.tea.xyz/tx/${tx.transactionHash}`;
        txLink.textContent = 'View on Tea Sepolia';
        modal.style.display = 'flex';
        overlay.style.display = 'block';

        closeModal.onclick = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };
        overlay.onclick = () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        };

        await updateFromBalance();
    } catch (error) {
        console.error('Swap/Approve error:', error);
        alert(`Transaction failed! ${error.message || 'Check console for details.'}`);
        swapBtn.disabled = false;
        await updateSwapButtonState();
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
                const chainId = await provider.request({ method: 'eth_chainId' });
                if (parseInt(chainId, 16) !== TEA_SEPOLIA_CHAIN_ID) {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x' + TEA_SEPOLIA_CHAIN_ID.toString(16) }],
                    }).catch(async (switchError) => {
                        if (switchError.code === 4902) {
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
                }
            } catch (error) {
                console.error('Error ensuring Tea Sepolia:', error);
                throw error;
            }
        };

        if (wallet === 'metamask' && window.ethereum) {
            try {
                const provider = window.ethereum;
                await ensureTeaSepolia(provider);
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                currentProvider = provider;
                const web3 = new Web3(currentProvider);
                connectWalletBtn.textContent = formatAddress(accounts[0]);
                await updateGasFee(web3);
                await updateFromBalance();
            } catch (error) {
                console.error('Metamask connection error:', error);
                alert('Failed to connect to Metamask!');
            }
        } else if (wallet === 'okx' && window.okxwallet) {
            try {
                const provider = window.okxwallet;
                await ensureTeaSepolia(provider);
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                currentProvider = provider;
                const web3 = new Web3(currentProvider);
                connectWalletBtn.textContent = formatAddress(accounts[0]);
                await updateGasFee(web3);
                await updateFromBalance();
            } catch (error) {
                console.error('OKX Wallet connection error:', error);
                alert('Failed to connect to OKX Wallet!');
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
    const address = accounts[0];
    assetList.innerHTML = '';

    const teaBalance = await getTokenBalance(web3, address, { name: 'TEA', address: 'native' });
    assetList.innerHTML += `<div class="asset-item"><span>TEA</span><span>${parseFloat(teaBalance).toFixed(4)} TEA</span></div>`;
    const ethBalance = await getTokenBalance(web3, address, { name: 'ETH', address: '0xA8AA9806De2A5b8E8C9C81DA7accE4A883f66476' });
    assetList.innerHTML += `<div class="asset-item"><span>ETH</span><span>${parseFloat(ethBalance).toFixed(4)} ETH</span></div>`;
    const usdtBalance = await getTokenBalance(web3, address, { name: 'USDT', address: '0x2a215664473a03A7bE43eEa7aecB99D3142cf06f' });
    assetList.innerHTML += `<div class="asset-item"><span>USDT</span><span>${parseFloat(usdtBalance).toFixed(4)} USDT</span></div>`;

    assetModal.style.display = 'block';
    overlay.style.display = 'block';
};

// Disconnect Wallet
disconnectWalletBtn.addEventListener('click', () => {
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
    await updateEstimatedOutput();
    await updateSwapButtonState();
};

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
    document.getElementById('success-modal').style.display = 'none';
    slippagePopup.style.display = 'none';
    overlay.style.display = 'none';
});

// Swap Info Toggle
swapInfoToggle.addEventListener('click', () => {
    swapInfoToggle.classList.toggle('active');
    swapInfoDetails.classList.toggle('active');
    updateEstimatedOutput();
});

// Load tokens ke modal
const loadTokens = () => {
    const tokens = [
        { name: 'TEA', address: 'native' },
        { name: 'ETH', address: '0xA8AA9806De2A5b8E8C9C81DA7accE4A883f66476' },
        { name: 'USDT', address: '0x2a215664473a03A7bE43eEa7aecB99D3142cf06f' }
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
