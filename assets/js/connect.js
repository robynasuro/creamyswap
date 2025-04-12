// SPDX-License-Identifier: MIT
const Web3 = window.Web3;

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// DOM Elements
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const connectWalletModal = document.getElementById('connect-wallet-modal');
const assetModal = document.getElementById('asset-modal');
const assetList = document.getElementById('asset-list');
const disconnectWalletBtn = document.getElementById('disconnect-wallet-btn');
const overlay = document.getElementById('overlay');
const walletOptions = document.querySelectorAll('.wallet-option');
const chainStatus = document.getElementById('chain-status');
const chainDot = document.getElementById('chain-dot');

// Tab Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const swapTab = document.getElementById('swap');
const poolTab = document.getElementById('pool');
const historyTab = document.getElementById('history');

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
const customSlippageInput = document.getElementById('custom-slippage-input');
const setCustomSlippageBtn = document.getElementById('set-custom-slippage');

// Pool Elements
const poolAmountAInput = document.getElementById('pool-amount-a');
const poolAmountBInput = document.getElementById('pool-amount-b');
const poolTokenABtn = document.getElementById('pool-token-a-btn');
const poolTokenBBtn = document.getElementById('pool-token-b-btn');
const poolABalanceSpan = document.getElementById('pool-a-balance');
const poolBBalanceSpan = document.getElementById('pool-b-balance');
const approveABtn = document.getElementById('approve-a-btn');
const approveBBtn = document.getElementById('approve-b-btn');
const addLiquidityBtn = document.getElementById('add-liquidity-btn');
const liquidityList = document.getElementById('liquidity-list');
const removeLiquidityBtn = document.getElementById('remove-liquidity-btn');
const poolInfo = document.getElementById('pool-info');

// History Elements
const swapHistoryList = document.getElementById('swap-history-list');

// Faucet
const faucetBtn = document.getElementById('faucet-btn');

// Token Select Modal
const tokenSelectModal = document.getElementById('token-select-modal');
const tokenList = document.getElementById('token-list');
const customTokenAddressInput = document.getElementById('custom-token-address');
const addCustomTokenBtn = document.getElementById('add-custom-token-btn');

// Success Modal
const successModal = document.getElementById('success-modal');
const successMessage = document.getElementById('success-message');
const txLink = document.getElementById('tx-link');
const closeModal = document.getElementById('close-modal');

// Error Modal
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const errorTxLink = document.getElementById('error-tx-link');
const closeErrorModal = document.getElementById('close-error-modal');

// Contract setup
const swapContractAddress = "0xcF32Dda5E8bA263f52e5B8E9b68E2a366e1DC75C"; // Pastiin ini alamat kontrak baru
const faucetContractAddress = "0x2D65E6f9cdF755C64755251B686d9d1f0C5437Fa";
const TEA_SEPOLIA_CHAIN_ID = "0x27EA"; // Chain ID Tea Sepolia (10218 dalam hex)
const TEA_ADDRESS = "0x0000000000000000000000000000000000000000";

// Token dan state awal
let currentProvider = null;
let walletType = null;
let slippageTolerance = 0.5; // Default 0.5%
let fromToken = { name: 'TEA', address: '0x0000000000000000000000000000000000000000', decimals: 18 };
let toToken = { name: 'ETH', address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870', decimals: 18 };
let poolTokenA = { name: 'TEA', address: '0x0000000000000000000000000000000000000000', decimals: 18 };
let poolTokenB = { name: 'ETH', address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870', decimals: 18 };
let knownTokens = [
    { name: 'TEA', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
    { name: 'ETH', address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870', decimals: 18 },
    { name: 'USDT', address: '0x581711F99DaFf0db829B77b9c20b85C697d79b5E', decimals: 18 }
];
let swapHistory = JSON.parse(localStorage.getItem('swapHistory')) || [];
let fromBalance = 0;
let poolABalance = 0;
let poolBBalance = 0;

// Swap ABI (Diupdate sesuai kontrak baru CreamySwap.sol)
const swapContractAbi = [
    {
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"},
            {"internalType": "uint256", "name": "amountA", "type": "uint256"},
            {"internalType": "uint256", "name": "amountB", "type": "uint256"},
            {"internalType": "uint256", "name": "amountAMin", "type": "uint256"},
            {"internalType": "uint256", "name": "amountBMin", "type": "uint256"}
        ],
        "name": "addLiquidity",
        "outputs": [{"internalType": "uint256", "name": "liquidity", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"},
            {"internalType": "uint256", "name": "liquidity", "type": "uint256"},
            {"internalType": "uint256", "name": "amountAMin", "type": "uint256"},
            {"internalType": "uint256", "name": "amountBMin", "type": "uint256"}
        ],
        "name": "removeLiquidity",
        "outputs": [
            {"internalType": "uint256", "name": "amountA", "type": "uint256"},
            {"internalType": "uint256", "name": "amountB", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "tokenIn", "type": "address"},
            {"internalType": "address", "name": "tokenOut", "type": "address"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"}
        ],
        "name": "swap",
        "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"}
        ],
        "name": "getReserves",
        "outputs": [
            {"internalType": "uint256", "name": "reserveA", "type": "uint256"},
            {"internalType": "uint256", "name": "reserveB", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "lpTokens",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawTea",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "provider", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "tokenA", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "tokenB", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "liquidity", "type": "uint256"}
        ],
        "name": "LiquidityAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "provider", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "tokenA", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "tokenB", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "liquidity", "type": "uint256"}
        ],
        "name": "LiquidityRemoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "tokenIn", "type": "address"},
            {"indexed": false, "internalType": "address", "name": "tokenOut", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256"}
        ],
        "name": "Swap",
        "type": "event"
    }
];

// ABI untuk kontrak LP Token (buat dapet balance dan totalSupply)
const lpTokenAbi = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    }
];

const faucetAbi = [
    {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const erc20Abi = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {"name": "_owner", "type": "address"},
            {"name": "_spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    }
];

// Tab Switching Logic
const showTab = (tabToShow) => {
    console.log(`Switching to tab: ${tabToShow}`); // Debugging

    // Hide all tabs by removing 'active' class
    swapTab.classList.remove('active');
    poolTab.classList.remove('active');
    historyTab.classList.remove('active');

    // Remove active class from all tab buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show the selected tab and set active class
    if (tabToShow === 'swap') {
        swapTab.classList.add('active');
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === 'swap') btn.classList.add('active');
        });
    } else if (tabToShow === 'pool') {
        poolTab.classList.add('active');
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === 'pool') btn.classList.add('active');
        });
        updateLiquidityList(); // Refresh liquidity list when tab is opened
        updatePoolBalancesAndInfo(); // Pastiin pool info ke-update pas tab dibuka
    } else if (tabToShow === 'history') {
        historyTab.classList.add('active');
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === 'history') btn.classList.add('active');
        });
        renderSwapHistory(); // Refresh history when tab is opened
    }
};

// Cek koneksi dompet pas halaman dimuat
const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined' || typeof window.okxwallet !== 'undefined') {
        try {
            const provider = window.ethereum || window.okxwallet;
            const web3 = new Web3(provider);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                currentProvider = provider;
                walletType = window.ethereum ? 'metamask' : 'okx';
                const networkId = await web3.eth.net.getId();
                if (networkId !== 10218) { // Network ID Tea Sepolia
                    alert('Please switch to the Tea Sepolia network.');
                    currentProvider = null;
                    walletType = null;
                    connectWalletBtn.textContent = 'Connect Wallet';
                    return;
                }
                connectWalletBtn.textContent = `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
                await updateChainStatus();
                await updateFromBalance();
                await updatePoolBalancesAndInfo();
                await updateLiquidityList();
                await updateSwapButtonState();
            }
        } catch (error) {
            console.error('Failed to check wallet connection:', error);
        }
    }
};

// Fungsi untuk baca balance token
const getTokenBalance = async (web3, address, token) => {
    if (token.address === TEA_ADDRESS) {
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');
    } else {
        const contract = new web3.eth.Contract(erc20Abi, token.address);
        const balance = await contract.methods.balanceOf(address).call();
        return web3.utils.fromWei(balance, 'ether');
    }
};

// Update chain status
const updateChainStatus = async () => {
    if (!currentProvider) {
        chainStatus.textContent = 'Tea Sepolia';
        chainDot.classList.remove('online');
        chainDot.classList.add('offline');
        return;
    }
    const web3 = new Web3(currentProvider);
    const chainId = await web3.eth.getChainId();
    if (chainId === 10218) { // Chain ID Tea Sepolia
        chainStatus.textContent = 'Tea Sepolia';
        chainDot.classList.remove('offline');
        chainDot.classList.add('online');
    } else {
        chainStatus.textContent = 'Wrong Network';
        chainDot.classList.remove('online');
        chainDot.classList.add('offline');
    }
};

// Update balance di input "From"
const updateFromBalance = async () => {
    if (!currentProvider) {
        fromBalanceSpan.textContent = '0.0';
        balanceInfo.style.display = 'none';
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
        fromBalanceSpan.textContent = '0.0';
        balanceInfo.style.display = 'none';
        return;
    }

    const address = accounts[0];
    fromBalance = await getTokenBalance(web3, address, fromToken);
    fromBalanceSpan.textContent = `${parseFloat(fromBalance).toFixed(4)}`;
    balanceInfo.style.display = 'flex';
    await updateSwapButtonState();
};

// Update balance di pool
const updatePoolBalancesAndInfo = async () => {
    console.log('Updating pool balances and info...'); // Debugging
    if (!currentProvider) {
        console.log('No provider, resetting pool info'); // Debugging
        poolABalanceSpan.textContent = '0.0';
        poolBBalanceSpan.textContent = '0.0';
        document.querySelector('.pool-a-balance-info').style.display = 'none';
        document.querySelector('.pool-b-balance-info').style.display = 'none';
        poolInfo.innerHTML = '<p>Connect wallet to view pool info.</p>';
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
        console.log('No accounts, resetting pool info'); // Debugging
        poolABalanceSpan.textContent = '0.0';
        poolBBalanceSpan.textContent = '0.0';
        document.querySelector('.pool-a-balance-info').style.display = 'none';
        document.querySelector('.pool-b-balance-info').style.display = 'none';
        poolInfo.innerHTML = '<p>Connect wallet to view pool info.</p>';
        return;
    }

    const address = accounts[0];
    poolABalance = await getTokenBalance(web3, address, poolTokenA);
    poolBBalance = await getTokenBalance(web3, address, poolTokenB);
    console.log(`Pool A Balance: ${poolABalance}, Pool B Balance: ${poolBBalance}`); // Debugging
    poolABalanceSpan.textContent = `${parseFloat(poolABalance).toFixed(4)}`;
    poolBBalanceSpan.textContent = `${parseFloat(poolBBalance).toFixed(4)}`;
    document.querySelector('.pool-a-balance-info').style.display = 'flex';
    document.querySelector('.pool-b-balance-info').style.display = 'flex';

    await updateLiquidityButtonState();
    await updatePoolInfo();
};

// Fungsi helper untuk ambil reserve dengan handle TEA
const getReserveForToken = async (web3, swapContract, tokenIn, tokenOut, amountInWei = '0') => {
    if (tokenIn === TEA_ADDRESS) {
        const contractBalance = await web3.eth.getBalance(swapContractAddress);
        return BigInt(contractBalance) - BigInt(amountInWei);
    } else {
        const reserves = await swapContract.methods.getReserves(tokenIn, tokenOut).call();
        return BigInt(tokenIn < tokenOut ? reserves.reserveA : reserves.reserveB);
    }
};

// Generate all possible token pairs
const generateTokenPairs = () => {
    const pairs = [];
    for (let i = 0; i < knownTokens.length; i++) {
        for (let j = i + 1; j < knownTokens.length; j++) {
            pairs.push({
                tokenA: knownTokens[i],
                tokenB: knownTokens[j]
            });
        }
    }
    return pairs;
};

// Update estimasi output swap
const updateEstimatedOutput = async () => {
    if (!currentProvider || !fromAmountInput.value || parseFloat(fromAmountInput.value) <= 0) {
        toAmountInput.value = '';
        return;
    }

    const web3 = new Web3(currentProvider);
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    const amountIn = parseFloat(fromAmountInput.value);
    const amountInWei = web3.utils.toWei(amountIn.toString(), 'ether');

    try {
        const reserveIn = await getReserveForToken(web3, swapContract, fromToken.address, toToken.address, amountInWei);
        const reserveOut = await getReserveForToken(web3, swapContract, toToken.address, fromToken.address);

        if (reserveIn <= 0 || reserveOut <= 0) {
            toAmountInput.value = '0';
            return;
        }

        const amountInWithFee = BigInt(amountInWei) * BigInt(1000 - 3) / BigInt(1000); // 0.3% fee
        const amountOut = (BigInt(reserveOut) * amountInWithFee) / (BigInt(reserveIn) + amountInWithFee);
        toAmountInput.value = web3.utils.fromWei(amountOut.toString(), 'ether');
    } catch (error) {
        console.error('Error estimating output:', error);
        toAmountInput.value = '0';
    }
};

// Update estimasi liquidity
const updateLiquidityEstimate = async () => {
    const amountA = parseFloat(poolAmountAInput.value) || 0;
    if (!currentProvider || amountA <= 0) {
        poolAmountBInput.value = '0.0';
        return;
    }

    const web3 = new Web3(currentProvider);
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    const reserves = await swapContract.methods.getReserves(poolTokenA.address, poolTokenB.address).call();
    const reserveA = poolTokenA.address < poolTokenB.address ? reserves.reserveA : reserves.reserveB;
    const reserveB = poolTokenA.address < poolTokenB.address ? reserves.reserveB : reserves.reserveA;

    if (reserveA == 0 && reserveB == 0) {
        poolAmountBInput.value = amountA.toFixed(6);
    } else {
        const amountB = (amountA * Number(reserveB)) / Number(reserveA);
        poolAmountBInput.value = amountB.toFixed(6);
    }
    await updatePoolInfo();
};

// Update Pool Info (Prices and Pool Share)
const updatePoolInfo = async () => {
    console.log('Updating pool info...'); // Debugging
    if (!currentProvider) {
        console.log('No provider, showing connect wallet message'); // Debugging
        poolInfo.innerHTML = '<p>Connect wallet to view pool info.</p>';
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
        console.log('No accounts, showing connect wallet message'); // Debugging
        poolInfo.innerHTML = '<p>Connect wallet to view pool info.</p>';
        return;
    }

    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const reserves = await swapContract.methods.getReserves(poolTokenA.address, poolTokenB.address).call();
    const reserveA = poolTokenA.address < poolTokenB.address ? reserves.reserveA : reserves.reserveB;
    const reserveB = poolTokenA.address < poolTokenB.address ? reserves.reserveB : reserves.reserveA;

    // Ambil LP token address dan totalSupply
    const lpTokenAddress = await swapContract.methods.lpTokens(
        poolTokenA.address < poolTokenB.address ? poolTokenA.address : poolTokenB.address,
        poolTokenA.address < poolTokenB.address ? poolTokenB.address : poolTokenA.address
    ).call();
    let totalSupply = '0';
    if (lpTokenAddress !== TEA_ADDRESS) {
        const lpTokenContract = new web3.eth.Contract(lpTokenAbi, lpTokenAddress);
        totalSupply = await lpTokenContract.methods.totalSupply().call();
    }

    const amountA = parseFloat(poolAmountAInput.value) || 0;
    const amountB = parseFloat(poolAmountBInput.value) || 0;

    const priceAPerB = reserveA > 0 ? (Number(reserveB) / Number(reserveA)).toFixed(6) : '0';
    const priceBPerA = reserveB > 0 ? (Number(reserveA) / Number(reserveB)).toFixed(6) : '0';
    const shareOfPool = totalSupply > 0 && amountA > 0 ? ((amountA * 1e18 / (Number(reserveA) + amountA * 1e18)) * 100).toFixed(2) : '0';

    console.log(`Price A per B: ${priceAPerB}, Price B per A: ${priceBPerA}, Share of Pool: ${shareOfPool}%`); // Debugging

    // Pastiin DOM element ke-update
    poolInfo.innerHTML = `
        <h3>Prices and Pool Share</h3>
        <div class="pool-info-item">
            <span id="price-a-per-b">${priceAPerB}</span>
            <span id="label-a-per-b">${poolTokenA.name} per ${poolTokenB.name}</span>
        </div>
        <div class="pool-info-item">
            <span id="price-b-per-a">${priceBPerA}</span>
            <span id="label-b-per-a">${poolTokenB.name} per ${poolTokenA.name}</span>
        </div>
        <div class="pool-info-item">
            <span id="pool-share">${shareOfPool}%</span>
            <span>Share of Pool</span>
        </div>
        <div class="pool-info-item">
            <span id="slippage-tolerance">${slippageTolerance}%</span>
            <span>Slippage Tolerance</span>
        </div>
    `;
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

// Update tombol Swap/Approve
const updateSwapButtonState = async () => {
    if (!currentProvider) {
        swapBtn.textContent = 'Connect Wallet';
        swapBtn.dataset.action = 'connect';
        swapBtn.disabled = false;
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
        swapBtn.textContent = 'Connect Wallet';
        swapBtn.dataset.action = 'connect';
        swapBtn.disabled = false;
        return;
    }

    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    if (fromAmount <= 0) {
        swapBtn.textContent = 'Enter Amount';
        swapBtn.disabled = true;
        return;
    }

    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    const reserves = await swapContract.methods.getReserves(fromToken.address, toToken.address).call();
    const reserveIn = fromToken.address < toToken.address ? reserves.reserveA : reserves.reserveB;
    if (reserveIn == 0) {
        swapBtn.textContent = 'Insufficient Liquidity';
        swapBtn.disabled = true;
        return;
    }

    if (fromAmount > parseFloat(fromBalance)) {
        swapBtn.textContent = 'Insufficient Balance';
        swapBtn.disabled = true;
        return;
    }

    swapBtn.disabled = false;

    if (fromToken.address === TEA_ADDRESS) {
        swapBtn.textContent = 'Swap';
        swapBtn.dataset.action = 'swap';
        return;
    }

    const amountIn = web3.utils.toWei(fromAmount.toString(), 'ether');
    const tokenContract = new web3.eth.Contract(erc20Abi, fromToken.address);
    const allowance = await tokenContract.methods.allowance(accounts[0], swapContractAddress).call();

    if (BigInt(allowance) < BigInt(amountIn)) {
        swapBtn.textContent = `Approve ${fromToken.name}`;
        swapBtn.dataset.action = 'approve';
    } else {
        swapBtn.textContent = 'Swap';
        swapBtn.dataset.action = 'swap';
    }
};

// Update tombol Approve/Add Liquidity
const updateLiquidityButtonState = async () => {
    console.log('Updating liquidity button state...'); // Debugging
    if (!currentProvider) {
        console.log('No provider, setting button to Connect Wallet'); // Debugging
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Connect Wallet';
        addLiquidityBtn.dataset.action = 'connect';
        addLiquidityBtn.disabled = false;
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
        console.log('No accounts, setting button to Connect Wallet'); // Debugging
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Connect Wallet';
        addLiquidityBtn.dataset.action = 'connect';
        addLiquidityBtn.disabled = false;
        return;
    }

    const amountA = parseFloat(poolAmountAInput.value) || 0;
    const amountB = parseFloat(poolAmountBInput.value) || 0;
    console.log(`Amount A: ${amountA}, Amount B: ${amountB}`); // Debugging
    console.log(`Pool A Balance: ${poolABalance}, Pool B Balance: ${poolBBalance}`); // Debugging

    if (amountA <= 0 || amountB <= 0) {
        console.log('Amount A or B is 0, disabling button'); // Debugging
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Enter Amount';
        addLiquidityBtn.disabled = true;
        delete addLiquidityBtn.dataset.action;
        return;
    }

    if (amountA > parseFloat(poolABalance) || amountB > parseFloat(poolBBalance)) {
        console.log('Insufficient balance, disabling button'); // Debugging
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Insufficient Balance';
        addLiquidityBtn.disabled = true;
        delete addLiquidityBtn.dataset.action;
        return;
    }

    let needApproveA = false;
    let needApproveB = false;

    if (poolTokenA.address !== TEA_ADDRESS) {
        const amountAWei = web3.utils.toWei(amountA.toString(), 'ether');
        const tokenAContract = new web3.eth.Contract(erc20Abi, poolTokenA.address);
        const allowanceA = await tokenAContract.methods.allowance(accounts[0], swapContractAddress).call();
        needApproveA = BigInt(allowanceA) < BigInt(amountAWei);
        approveABtn.textContent = `Approve ${poolTokenA.name}`;
        approveABtn.style.display = needApproveA ? 'block' : 'none';
        approveABtn.disabled = false;
    } else {
        approveABtn.style.display = 'none';
    }

    if (poolTokenB.address !== TEA_ADDRESS) {
        const amountBWei = web3.utils.toWei(amountB.toString(), 'ether');
        const tokenBContract = new web3.eth.Contract(erc20Abi, poolTokenB.address);
        const allowanceB = await tokenBContract.methods.allowance(accounts[0], swapContractAddress).call();
        needApproveB = BigInt(allowanceB) < BigInt(amountBWei);
        approveBBtn.textContent = `Approve ${poolTokenB.name}`;
        approveBBtn.style.display = needApproveB ? 'block' : 'none';
        approveBBtn.disabled = false;
    } else {
        approveBBtn.style.display = 'none';
    }

    addLiquidityBtn.textContent = 'Add Liquidity';
    addLiquidityBtn.disabled = needApproveA || needApproveB;
    addLiquidityBtn.style.display = 'block';
    if (!needApproveA && !needApproveB) {
        addLiquidityBtn.dataset.action = 'add';
        console.log('Enabling Add Liquidity button'); // Debugging
    } else {
        delete addLiquidityBtn.dataset.action;
        console.log('Disabling Add Liquidity button due to pending approvals'); // Debugging
    }
};

// Success Modal Function
const showSuccessModal = (message, txHash) => {
    successMessage.textContent = message;
    txLink.href = `https://sepolia.tea.xyz/tx/${txHash}`;
    successModal.classList.add('active');
    overlay.style.display = 'block';
};

// Error Modal Function
const showErrorModal = (message, txHash = null) => {
    errorMessage.textContent = message;
    if (txHash) {
        errorTxLink.href = `https://sepolia.tea.xyz/tx/${txHash}`;
        errorTxLink.style.display = 'block';
    } else {
        errorTxLink.style.display = 'none';
    }
    errorModal.classList.add('active');
    overlay.style.display = 'block';
    document.querySelector('#error-modal h2').classList.add('error');
};

// Tab Event Listeners
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        console.log(`Tab button clicked: ${tab}`); // Debugging
        showTab(tab);
    });
});

// Event listener input
fromAmountInput.addEventListener('input', debounce(async () => {
    await updateEstimatedOutput();
    await updateSwapButtonState();
}, 300));

poolAmountAInput.addEventListener('input', debounce(async () => {
    console.log(`Pool Amount A changed: ${poolAmountAInput.value}`); // Debugging
    await updateLiquidityEstimate();
    await updateLiquidityButtonState();
}, 300));

poolAmountBInput.addEventListener('input', debounce(async () => {
    console.log(`Pool Amount B changed: ${poolAmountBInput.value}`); // Debugging
    await updateLiquidityButtonState();
}, 300));

// Token Selection
let currentInput = null;

fromTokenBtn.addEventListener('click', () => {
    currentInput = 'from';
    renderTokenList();
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
});

toTokenBtn.addEventListener('click', () => {
    currentInput = 'to';
    renderTokenList();
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
});

poolTokenABtn.addEventListener('click', () => {
    currentInput = 'poolA';
    renderTokenList();
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
});

poolTokenBBtn.addEventListener('click', () => {
    currentInput = 'poolB';
    renderTokenList();
    tokenSelectModal.style.display = 'block';
    overlay.style.display = 'block';
});

const renderTokenList = () => {
    tokenList.innerHTML = knownTokens.map(token => `
        <div class="token-option" data-token="${token.name}" data-address="${token.address}">
            <img src="/assets/img/${token.name.toLowerCase()}.png" alt="${token.name}"> ${token.name}
        </div>
    `).join('');
    tokenList.querySelectorAll('.token-option').forEach(option => {
        option.addEventListener('click', () => selectToken(option));
    });
};

const selectToken = async (option) => {
    const token = option.getAttribute('data-token');
    const address = option.getAttribute('data-address');
    let btn;
    if (currentInput === 'from') {
        btn = fromTokenBtn;
        fromToken = { name: token, address, decimals: 18 };
        await updateFromBalance();
    } else if (currentInput === 'to') {
        btn = toTokenBtn;
        toToken = { name: token, address, decimals: 18 };
    } else if (currentInput === 'poolA') {
        btn = poolTokenABtn;
        poolTokenA = { name: token, address, decimals: 18 };
        await updatePoolBalancesAndInfo();
    } else if (currentInput === 'poolB') {
        btn = poolTokenBBtn;
        poolTokenB = { name: token, address, decimals: 18 };
        await updatePoolBalancesAndInfo();
    }
    btn.innerHTML = `<img src="/assets/img/${token.toLowerCase()}.png" alt="${token}" class="token-img"> ${token}`;
    tokenSelectModal.style.display = 'none';
    overlay.style.display = 'none';
    await updateEstimatedOutput();
    await updateSwapButtonState();
};

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
        if (!knownTokens.some(t => t.address.toLowerCase() === tokenAddress.toLowerCase())) {
            knownTokens.push({ address: tokenAddress, name: symbol, decimals: 18 });
        }
        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', symbol);
        tokenOption.setAttribute('data-address', tokenAddress);
        tokenOption.innerHTML = `<img src="/assets/img/default-token.png" alt="${symbol}"> ${symbol}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));
        customTokenAddressInput.value = '';
        alert(`${symbol} has been successfully added!`);
        await updateLiquidityList();
    } catch (error) {
        console.error('Failed to add custom token:', error);
        alert('Failed to add token!');
    }
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

    fromTokenBtn.innerHTML = `<img src="/assets/img/${fromToken.name.toLowerCase()}.png" alt="${fromToken.name}" class="token-img"> ${fromToken.name}`;
    toTokenBtn.innerHTML = `<img src="/assets/img/${toToken.name.toLowerCase()}.png" alt="${toToken.name}" class="token-img"> ${toToken.name}`;

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
        document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;
        updateEstimatedOutput();
        slippagePopup.style.display = 'none';
    });
});

setCustomSlippageBtn.addEventListener('click', () => {
    const customValue = parseFloat(customSlippageInput.value);
    if (isNaN(customValue) || customValue <= 0 || customValue > 100) {
        alert('Please enter a valid slippage percentage (0-100%)!');
        return;
    }
    slippageTolerance = customValue;
    slippageButtons.forEach(b => b.classList.remove('active'));
    document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;
    updateEstimatedOutput();
    slippagePopup.style.display = 'none';
    customSlippageInput.value = '';
});

// Close Modals
closeModal.addEventListener('click', () => {
    successModal.classList.remove('active');
    overlay.style.display = 'none';
});

closeErrorModal.addEventListener('click', () => {
    errorModal.classList.remove('active');
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    successModal.classList.remove('active');
    errorModal.classList.remove('active');
    connectWalletModal.style.display = 'none';
    assetModal.style.display = 'none';
    tokenSelectModal.style.display = 'none';
    slippagePopup.style.display = 'none';
    overlay.style.display = 'none';
});

// Connect Wallet Logic
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
        if (currentProvider && walletType === wallet) {
            connectWalletModal.style.display = 'none';
            overlay.style.display = 'none';
            return;
        }

        walletType = wallet;
        connectWalletModal.style.display = 'none';
        overlay.style.display = 'none';

        const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

        const ensureTeaSepolia = async (provider) => {
            try {
                const chainId = await provider.request({ method: 'eth_chainId' });
                if (chainId === TEA_SEPOLIA_CHAIN_ID) return true;

                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: TEA_SEPOLIA_CHAIN_ID }],
                }).catch(async (switchError) => {
                    if (switchError.code === 4902) {
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: TEA_SEPOLIA_CHAIN_ID,
                                chainName: 'Tea Sepolia',
                                rpcUrls: ['https://tea-sepolia.g.alchemy.com/v2/X6UAIRaCqvRedwmWtWHXtKNxG3kQmwh1'], // Custom RPC kamu
                                nativeCurrency: { name: 'TEA', symbol: 'TEA', decimals: 18 },
                                blockExplorerUrls: ['https://sepolia.tea.xyz']
                            }]
                        });
                    } else {
                        throw switchError;
                    }
                });
                return true;
            } catch (error) {
                console.error('Failed to ensure Tea Sepolia:', error);
                return false;
            }
        };

        if (wallet === 'metamask' && window.ethereum) {
            currentProvider = window.ethereum;
            try {
                const accounts = await currentProvider.request({ method: 'eth_requestAccounts' });
                if (await ensureTeaSepolia(currentProvider)) {
                    connectWalletBtn.textContent = formatAddress(accounts[0]);
                    await updateChainStatus();
                    await updateFromBalance();
                    await updatePoolBalancesAndInfo();
                    await updateLiquidityList();
                    await updateSwapButtonState();
                } else {
                    showErrorModal('Failed to switch to Tea Sepolia. Please switch manually.');
                    disconnectWallet();
                }
            } catch (error) {
                console.error('Failed to connect MetaMask:', error);
                if (error.code === 4001) {
                    showErrorModal('Connection rejected by user.');
                } else {
                    showErrorModal('Failed to connect MetaMask. Please check your wallet.');
                }
                disconnectWallet();
            }
        } else if (wallet === 'okx' && window.okxwallet) {
            currentProvider = window.okxwallet;
            try {
                const accounts = await currentProvider.request({ method: 'eth_requestAccounts' });
                if (await ensureTeaSepolia(currentProvider)) {
                    connectWalletBtn.textContent = formatAddress(accounts[0]);
                    await updateChainStatus();
                    await updateFromBalance();
                    await updatePoolBalancesAndInfo();
                    await updateLiquidityList();
                    await updateSwapButtonState();
                } else {
                    showErrorModal('Failed to switch to Tea Sepolia. Please switch manually.');
                    disconnectWallet();
                }
            } catch (error) {
                console.error('Failed to connect OKX Wallet:', error);
                if (error.code === 4001) {
                    showErrorModal('Connection rejected by user.');
                } else {
                    showErrorModal('Failed to connect OKX Wallet. Please check your wallet.');
                }
                disconnectWallet();
            }
        } else {
            alert(`Please install ${wallet === 'metamask' ? 'MetaMask' : 'OKX Wallet'} to use this wallet!`);
        }
    });
});

// Nangani perubahan akun dan jaringan
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
            disconnectWallet();
            alert('Wallet disconnected. Please connect again to continue.');
        } else {
            connectWalletBtn.textContent = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            await updateFromBalance();
            await updatePoolBalancesAndInfo();
            await updateLiquidityList();
            await updateSwapButtonState();
        }
    });

    window.ethereum.on('chainChanged', async (chainId) => {
        if (chainId !== TEA_SEPOLIA_CHAIN_ID) {
            alert('Please switch to the Tea Sepolia network.');
            disconnectWallet();
        } else {
            await checkWalletConnection();
        }
    });

    window.ethereum.on('disconnect', () => {
        disconnectWallet();
        alert('Wallet disconnected. Please connect again to continue.');
    });
}

if (typeof window.okxwallet !== 'undefined') {
    window.okxwallet.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
            disconnectWallet();
            alert('Wallet disconnected. Please connect again to continue.');
        } else {
            connectWalletBtn.textContent = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            await updateFromBalance();
            await updatePoolBalancesAndInfo();
            await updateLiquidityList();
            await updateSwapButtonState();
        }
    });

    window.okxwallet.on('chainChanged', async (chainId) => {
        if (chainId !== TEA_SEPOLIA_CHAIN_ID) {
            alert('Please switch to the Tea Sepolia network.');
            disconnectWallet();
        } else {
            await checkWalletConnection();
        }
    });

    window.okxwallet.on('disconnect', () => {
        disconnectWallet();
        alert('Wallet disconnected. Please connect again to continue.');
    });
}

// Show Assets
const showAssets = async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    assetList.innerHTML = '';

    for (const token of knownTokens) {
        const balance = await getTokenBalance(web3, accounts[0], token);
        const li = document.createElement('div');
        li.className = 'asset-item';
        li.innerHTML = `
            <span><img src="/assets/img/${token.name.toLowerCase()}.png" alt="${token.name}" style="width: 20px; height: 20px; margin-right: 10px;"> ${token.name}</span>
            <span>${parseFloat(balance).toFixed(4)}</span>
        `;
        assetList.appendChild(li);
    }

    assetModal.style.display = 'block';
    overlay.style.display = 'block';
};

// Disconnect Wallet
const disconnectWallet = () => {
    currentProvider = null;
    walletType = null;
    connectWalletBtn.textContent = 'Connect Wallet';
    chainDot.classList.remove('online');
    chainDot.classList.add('offline');
    chainStatus.textContent = 'Tea Sepolia';
    fromBalanceSpan.textContent = '0.0';
    poolABalanceSpan.textContent = '0.0';
    poolBBalanceSpan.textContent = '0.0';
    balanceInfo.style.display = 'none';
    document.querySelector('.pool-a-balance-info').style.display = 'none';
    document.querySelector('.pool-b-balance-info').style.display = 'none';
    swapBtn.textContent = 'Connect Wallet';
    swapBtn.dataset.action = 'connect';
    swapBtn.disabled = false;
    addLiquidityBtn.textContent = 'Connect Wallet';
    addLiquidityBtn.dataset.action = 'connect';
    addLiquidityBtn.disabled = false;
    approveABtn.style.display = 'none';
    approveBBtn.style.display = 'none';
    liquidityList.innerHTML = '<p>Connect wallet to view your liquidity.</p>';
    removeLiquidityBtn.disabled = true;
    poolInfo.innerHTML = '<p>Connect wallet to view pool info.</p>';
};

disconnectWalletBtn.addEventListener('click', () => {
    disconnectWallet();
    assetModal.style.display = 'none';
    overlay.style.display = 'none';
});

// Tombol Swap/Approve
swapBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        connectWalletModal.style.display = 'block';
        overlay.style.display = 'block';
        return;
    }

    const action = swapBtn.dataset.action;
    if (!action) return;

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const fromAmount = parseFloat(fromAmountInput.value);
    const amountInWei = web3.utils.toWei(fromAmount.toString(), 'ether');
    const toAmount = parseFloat(toAmountInput.value);
    const amountOutMin = web3.utils.toWei((toAmount * (1 - slippageTolerance / 100)).toString(), 'ether');

    try {
        if (action === 'approve') {
            const tokenContract = new web3.eth.Contract(erc20Abi, fromToken.address);
            const gasPrice = web3.utils.toWei('10', 'gwei'); // Gas price manual
            const estimatedGas = await tokenContract.methods.approve(swapContractAddress, amountInWei).estimateGas({ from: accounts[0] });
            const gasLimit = Math.floor(estimatedGas * 1.2);
            const tx = await tokenContract.methods.approve(swapContractAddress, amountInWei).send({
                from: accounts[0],
                gas: gasLimit,
                gasPrice: gasPrice
            });
            showSuccessModal(`Successfully approved ${fromToken.name} for swapping`, tx.transactionHash);
            await updateSwapButtonState();
        } else if (action === 'swap') {
            const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
            const gasPrice = web3.utils.toWei('10', 'gwei'); // Gas price manual
            const estimatedGas = await swapContract.methods.swap(
                fromToken.address,
                toToken.address,
                amountInWei,
                amountOutMin
            ).estimateGas({
                from: accounts[0],
                value: fromToken.address === TEA_ADDRESS ? amountInWei : 0
            });
            const gasLimit = Math.floor(estimatedGas * 1.2);
            const params = {
                from: accounts[0],
                gas: gasLimit,
                gasPrice: gasPrice
            };
            if (fromToken.address === TEA_ADDRESS) {
                params.value = amountInWei;
            }
            const tx = await swapContract.methods.swap(
                fromToken.address,
                toToken.address,
                amountInWei,
                amountOutMin
            ).send(params);
            const amountOut = web3.utils.fromWei(tx.events.Swap.returnValues.amountOut, 'ether');
            showSuccessModal(`Successfully swapped ${fromAmount} ${fromToken.name} for ${amountOut} ${toToken.name}`, tx.transactionHash);
            addToSwapHistory('swap', fromAmount, fromToken.name, amountOut, toToken.name, tx.transactionHash);
            fromAmountInput.value = '';
            toAmountInput.value = '';
            await updateFromBalance();
            await updateEstimatedOutput();
            await updateSwapButtonState();
        }
    } catch (error) {
        console.error('Swap failed:', error);
        showErrorModal(`Swap failed: ${error.message}`, error.transactionHash);
    }
});

// Approve Token A
approveABtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const amountA = parseFloat(poolAmountAInput.value);
    const amountAWei = web3.utils.toWei(amountA.toString(), 'ether');

    try {
        approveABtn.textContent = `Approving ${poolTokenA.name}...`;
        approveABtn.disabled = true;
        const tokenAContract = new web3.eth.Contract(erc20Abi, poolTokenA.address);
        const gasPrice = web3.utils.toWei('10', 'gwei'); // Gas price manual
        const estimatedGas = await tokenAContract.methods.approve(swapContractAddress, amountAWei).estimateGas({ from: accounts[0] });
        const gasLimit = Math.floor(estimatedGas * 1.2);
        const tx = await tokenAContract.methods.approve(swapContractAddress, amountAWei).send({
            from: accounts[0],
            gas: gasLimit,
            gasPrice: gasPrice
        });
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay 5 detik
        showSuccessModal(`Successfully approved ${poolTokenA.name}!`, tx.transactionHash);
        await updateLiquidityButtonState();
    } catch (error) {
        console.error('Approval for token A failed:', error);
        let errorMsg = `Failed to approve ${poolTokenA.name}!`;
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction was reverted by the EVM.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
        approveABtn.textContent = `Approve ${poolTokenA.name}`;
        approveABtn.disabled = false;
    }
});

// Approve Token B
approveBBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const amountB = parseFloat(poolAmountBInput.value);
    const amountBWei = web3.utils.toWei(amountB.toString(), 'ether');

    try {
        approveBBtn.textContent = `Approving ${poolTokenB.name}...`;
        approveBBtn.disabled = true;
        const tokenBContract = new web3.eth.Contract(erc20Abi, poolTokenB.address);
        const gasPrice = web3.utils.toWei('10', 'gwei'); // Gas price manual
        const estimatedGas = await tokenBContract.methods.approve(swapContractAddress, amountBWei).estimateGas({ from: accounts[0] });
        const gasLimit = Math.floor(estimatedGas * 1.2);
        const tx = await tokenBContract.methods.approve(swapContractAddress, amountBWei).send({
            from: accounts[0],
            gas: gasLimit,
            gasPrice: gasPrice
        });
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay 5 detik
        showSuccessModal(`Successfully approved ${poolTokenB.name}!`, tx.transactionHash);
        await updateLiquidityButtonState();
    } catch (error) {
        console.error('Approval for token B failed:', error);
        let errorMsg = `Failed to approve ${poolTokenB.name}!`;
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction was reverted by the EVM.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
        approveBBtn.textContent = `Approve ${poolTokenB.name}`;
        approveBBtn.disabled = false;
    }
});

// Add Liquidity
addLiquidityBtn.addEventListener('click', async () => {
    // Tambah warning slippage
    if (slippageTolerance < 1.0) {
        const confirm = window.confirm(`Slippage tolerance is set to ${slippageTolerance}%. This might cause the transaction to fail due to pool ratio changes. Do you want to continue?`);
        if (!confirm) return;
    }

    if (!currentProvider) {
        alert('Please connect your wallet first!');
        connectWalletModal.style.display = 'block';
        overlay.style.display = 'block';
        return;
    }

    const action = addLiquidityBtn.dataset.action;
    if (!action) return;

    // Validasi token sebelum transaksi
    if (poolTokenA.address === poolTokenB.address) {
        showErrorModal("Please select different tokens for the liquidity pool.");
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const amountA = parseFloat(poolAmountAInput.value);
    const amountB = parseFloat(poolAmountBInput.value);
    const amountAWei = web3.utils.toWei(amountA.toString(), 'ether');
    const amountBWei = web3.utils.toWei(amountB.toString(), 'ether');
    const amountAMin = web3.utils.toWei((amountA * (1 - slippageTolerance / 100)).toString(), 'ether');
    const amountBMin = web3.utils.toWei((amountB * (1 - slippageTolerance / 100)).toString(), 'ether');

    try {
        // Debug log sebelum transaksi
        console.log(`Adding liquidity: ${poolTokenA.name} (${poolTokenA.address}) - ${poolTokenB.name} (${poolTokenB.address})`);
        console.log(`Amount A: ${amountAWei}, Amount B: ${amountBWei}`);

        const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

        // Estimasi gas yang dibutuhin
        const estimatedGas = await swapContract.methods.addLiquidity(
            poolTokenA.address,
            poolTokenB.address,
            amountAWei,
            amountBWei,
            amountAMin,
            amountBMin
        ).estimateGas({
            from: accounts[0],
            value: poolTokenA.address === TEA_ADDRESS ? amountAWei : (poolTokenB.address === TEA_ADDRESS ? amountBWei : 0)
        });
        console.log(`Estimated gas: ${estimatedGas}`);

        // Tambah margin 20% ke estimasi gas
        const gasLimit = Math.floor(estimatedGas * 1.2);
        console.log(`Gas limit with 20% margin: ${gasLimit}`);

        // Set gas price manual ke 10 Gwei (bisa disesuaikan)
        const gasPrice = web3.utils.toWei('10', 'gwei');
        console.log(`Using manual gas price: ${gasPrice} Wei (${web3.utils.fromWei(gasPrice, 'gwei')} Gwei)`);

        const params = {
            from: accounts[0],
            gas: gasLimit, // Gas limit berdasarkan estimasi
            gasPrice: gasPrice // Gas price manual
        };
        if (poolTokenA.address === TEA_ADDRESS) {
            params.value = amountAWei;
        } else if (poolTokenB.address === TEA_ADDRESS) {
            params.value = amountBWei;
        }

        // Hitung estimasi biaya transaksi
        const estimatedTxFee = BigInt(gasLimit) * BigInt(gasPrice);
        console.log(`Estimated tx fee: ${web3.utils.fromWei(estimatedTxFee.toString(), 'ether')} ether`);

        addLiquidityBtn.disabled = true;
        addLiquidityBtn.textContent = 'Adding Liquidity...';
        const tx = await swapContract.methods.addLiquidity(
            poolTokenA.address,
            poolTokenB.address,
            amountAWei,
            amountBWei,
            amountAMin,
            amountBMin
        ).send(params);
        const liquidity = web3.utils.fromWei(tx.events.LiquidityAdded.returnValues.liquidity, 'ether');
        showSuccessModal(`Successfully added ${amountA} ${poolTokenA.name} and ${amountB} ${poolTokenB.name} to liquidity. Minted ${liquidity} LP tokens.`, tx.transactionHash);
        addToSwapHistory('add', amountA, poolTokenA.name, amountB, poolTokenB.name, tx.transactionHash);
        poolAmountAInput.value = '';
        poolAmountBInput.value = '';
        await updatePoolBalancesAndInfo();
        await updateLiquidityList();
    } catch (error) {
        console.error('Failed to add liquidity:', error);
        let errorMsg = `Failed to add liquidity: ${error.message}`;
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction was reverted by the EVM. Check allowance or pool ratio.';
        } else if (error.message.includes('exceeds the configured cap')) {
            errorMsg += ' Transaction fee is too high. Try lowering the gas price or gas limit.';
        } else if (error.message.includes('replacement transaction underpriced')) {
            errorMsg += ' Try increasing the gas price or cancel pending transactions in your wallet.';
        }
        showErrorModal(errorMsg, error.transactionHash);
    } finally {
        addLiquidityBtn.disabled = false;
        addLiquidityBtn.textContent = 'Add Liquidity';
    }
});

// Update Liquidity List
const updateLiquidityList = async () => {
    if (!currentProvider) {
        liquidityList.innerHTML = '<p>Connect wallet to view your liquidity.</p>';
        removeLiquidityBtn.disabled = true;
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
        liquidityList.innerHTML = '<p>Connect wallet to view your liquidity.</p>';
        removeLiquidityBtn.disabled = true;
        return;
    }

    console.log(`Wallet Address: ${accounts[0]}`);
    liquidityList.innerHTML = '<p>Loading liquidity...</p>';
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    const pairs = generateTokenPairs();

    liquidityList.innerHTML = '';
    let hasLiquidity = false;

    for (const pair of pairs) {
        try {
            console.log(`Checking pair: ${pair.tokenA.name}/${pair.tokenB.name}`);
            const sortedTokenA = pair.tokenA.address < pair.tokenB.address ? pair.tokenA.address : pair.tokenB.address;
            const sortedTokenB = pair.tokenA.address < pair.tokenB.address ? pair.tokenB.address : pair.tokenA.address;
            const tokenA = pair.tokenA.address < pair.tokenB.address ? pair.tokenA : pair.tokenB;
            const tokenB = pair.tokenA.address < pair.tokenB.address ? pair.tokenB : pair.tokenA;

            console.log(`Sorted tokens: ${tokenA.name} (${sortedTokenA}) / ${tokenB.name} (${sortedTokenB})`);
            const lpTokenAddress = await swapContract.methods.lpTokens(sortedTokenA, sortedTokenB).call();
            console.log(`LP Token Address for ${tokenA.name}/${tokenB.name}: ${lpTokenAddress}`);

            if (lpTokenAddress === TEA_ADDRESS) {
                console.log(`No LP token for pair ${tokenA.name}/${tokenB.name}`);
                continue;
            }

            const lpTokenContract = new web3.eth.Contract(lpTokenAbi, lpTokenAddress);
            const lpBalance = await lpTokenContract.methods.balanceOf(accounts[0]).call();
            console.log(`LP Balance for ${tokenA.name}/${tokenB.name}: ${lpBalance}`);

            if (lpBalance > 0) {
                const totalSupply = await lpTokenContract.methods.totalSupply().call();
                const reserves = await swapContract.methods.getReserves(tokenA.address, tokenB.address).call();
                const reserveA = tokenA.address < tokenB.address ? reserves.reserveA : reserves.reserveB;
                const reserveB = tokenA.address < tokenB.address ? reserves.reserveB : reserves.reserveA;

                // Convert ke BN.js
                const lpBalanceBN = web3.utils.toBN(lpBalance);
                const totalSupplyBN = web3.utils.toBN(totalSupply);
                const reserveABN = web3.utils.toBN(reserveA);
                const reserveBBN = web3.utils.toBN(reserveB);

                // Hitung amountA dan amountB pake BN.js
                const amountABN = lpBalanceBN.mul(reserveABN).div(totalSupplyBN);
                const amountBBN = lpBalanceBN.mul(reserveBBN).div(totalSupplyBN);

                // Hitung share pake BN.js, convert ke persen
                const shareBN = lpBalanceBN.mul(web3.utils.toBN(10000)).div(totalSupplyBN); // Kali 10000 biar dapet 2 desimal
                const share = Number(shareBN) / 100; // Convert ke desimal buat display

                console.log(`Found liquidity for ${tokenA.name}/${tokenB.name}: ${amountABN.toString()} / ${amountBBN.toString()}, Share: ${share}%`);

                liquidityList.innerHTML += `
                    <div class="liquidity-item" data-token-a="${tokenA.address}" data-token-b="${tokenB.address}" data-lp="${lpBalance}">
                        <span>${tokenA.name}/${tokenB.name}: ${web3.utils.fromWei(amountABN, 'ether')} / ${web3.utils.fromWei(amountBBN, 'ether')}</span>
                        <span>${share.toFixed(2)}%</span>
                    </div>`;
                hasLiquidity = true;
            } else {
                console.log(`No liquidity balance for ${tokenA.name}/${tokenB.name}`);
            }
        } catch (error) {
            console.error(`Failed to fetch liquidity for pair ${pair.tokenA.name}/${pair.tokenB.name}:`, error);
        }
    }

    if (!hasLiquidity) {
        liquidityList.innerHTML = '<p>No liquidity found.</p>';
        removeLiquidityBtn.disabled = true;
    } else {
        removeLiquidityBtn.disabled = false;
        liquidityList.querySelectorAll('.liquidity-item').forEach(item => {
            item.addEventListener('click', () => {
                liquidityList.querySelectorAll('.liquidity-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            });
        });
    }
};

// Remove Liquidity
removeLiquidityBtn.addEventListener('click', async () => {
    // Tambah warning slippage
    if (slippageTolerance < 1.0) {
        const confirm = window.confirm(`Slippage tolerance is set to ${slippageTolerance}%. This might cause the transaction to fail due to pool ratio changes. Do you want to continue?`);
        if (!confirm) return;
    }

    if (!currentProvider) {
        alert('Please connect your wallet first!');
        return;
    }

    const selectedItem = liquidityList.querySelector('.liquidity-item.selected');
    if (!selectedItem) {
        alert('Please select a liquidity position to remove.');
        return;
    }

    const tokenA = selectedItem.dataset.tokenA;
    const tokenB = selectedItem.dataset.tokenB;
    const lpAmount = selectedItem.dataset.lp;

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const lpTokenAddress = await swapContract.methods.lpTokens(
        tokenA < tokenB ? tokenA : tokenB,
        tokenA < tokenB ? tokenB : tokenA
    ).call();
    const lpTokenContract = new web3.eth.Contract(lpTokenAbi, lpTokenAddress);
    const totalSupply = await lpTokenContract.methods.totalSupply().call();

    const reserves = await swapContract.methods.getReserves(tokenA, tokenB).call();
    const reserveA = tokenA < tokenB ? reserves.reserveA : reserves.reserveB;
    const reserveB = tokenA < tokenB ? reserves.reserveB : reserves.reserveA;

    const amountAMin = web3.utils.toWei(((Number(reserveA) * Number(lpAmount) / Number(totalSupply)) * (1 - slippageTolerance / 100)).toString(), 'ether');
    const amountBMin = web3.utils.toWei(((Number(reserveB) * Number(lpAmount) / Number(totalSupply)) * (1 - slippageTolerance / 100)).toString(), 'ether');

    try {
        const gasPrice = web3.utils.toWei('10', 'gwei'); // Gas price manual
        const estimatedGas = await swapContract.methods.removeLiquidity(
            tokenA,
            tokenB,
            lpAmount,
            amountAMin,
            amountBMin
        ).estimateGas({ from: accounts[0] });
        const gasLimit = Math.floor(estimatedGas * 1.2);
        const tx = await swapContract.methods.removeLiquidity(
            tokenA,
            tokenB,
            lpAmount,
            amountAMin,
            amountBMin
        ).send({
            from: accounts[0],
            gas: gasLimit,
            gasPrice: gasPrice
        });
        const amountA = web3.utils.fromWei(tx.events.LiquidityRemoved.returnValues.amountA, 'ether');
        const amountB = web3.utils.fromWei(tx.events.LiquidityRemoved.returnValues.amountB, 'ether');
        const tokenAName = knownTokens.find(token => token.address === tokenA)?.name || 'Unknown';
        const tokenBName = knownTokens.find(token => token.address === tokenB)?.name || 'Unknown';
        showSuccessModal(`Successfully removed liquidity: ${amountA} ${tokenAName} and ${amountB} ${tokenBName}`, tx.transactionHash);
        addToSwapHistory('remove', amountA, tokenAName, amountB, tokenBName, tx.transactionHash);
        await updatePoolBalancesAndInfo();
        await updateLiquidityList();
    } catch (error) {
        console.error('Failed to remove liquidity:', error);
        showErrorModal(`Failed to remove liquidity: ${error.message}`, error.transactionHash);
    }
});

// Swap History
const addToSwapHistory = (type, amountA, tokenA, amountB, tokenB, txHash) => {
    const entry = {
        type,
        amountA,
        tokenA,
        amountB,
        tokenB,
        txHash,
        timestamp: new Date().toISOString()
    };
    swapHistory.push(entry);
    localStorage.setItem('swapHistory', JSON.stringify(swapHistory));
    renderSwapHistory();
};

const renderSwapHistory = () => {
    if (swapHistory.length === 0) {
        swapHistoryList.innerHTML = '<p>No swap history found.</p>';
        return;
    }

    swapHistoryList.innerHTML = swapHistory.map(entry => `
        <div class="history-item">
            <span>${entry.type === 'swap' ? 'Swap' : entry.type === 'add' ? 'Add Liquidity' : 'Remove Liquidity'}</span>
            <span>${entry.amountA} ${entry.tokenA} ${entry.type === 'swap' ? '→' : entry.type === 'add' ? '+' : '→'} ${entry.amountB} ${entry.tokenB}</span>
            <a href="https://sepolia.tea.xyz/tx/${entry.txHash}" target="_blank">View</a>
        </div>
    `).join('');
};

// Faucet
faucetBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        connectWalletModal.style.display = 'block';
        overlay.style.display = 'block';
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const faucetContract = new web3.eth.Contract(faucetAbi, faucetContractAddress);

    try {
        const gasPrice = web3.utils.toWei('10', 'gwei'); // Gas price manual
        const estimatedGas = await faucetContract.methods.claim().estimateGas({ from: accounts[0] });
        const gasLimit = Math.floor(estimatedGas * 1.2);
        const tx = await faucetContract.methods.claim().send({
            from: accounts[0],
            gas: gasLimit,
            gasPrice: gasPrice
        });
showSuccessModal('Successfully claimed tokens from faucet!', tx.transactionHash);
        await updateFromBalance();
        await updatePoolBalancesAndInfo();
        await updateLiquidityList();
    } catch (error) {
        console.error('Failed to claim from faucet:', error);
        let errorMsg = 'Failed to claim tokens from faucet.';
        if (error.message.includes('reverted')) {
            errorMsg += ' You may have already claimed recently or the faucet is out of funds.';
        }
        showErrorModal(errorMsg, error.transactionHash);
    }
});

// Swap Info Toggle
swapInfoToggle.addEventListener('click', () => {
    const isExpanded = swapInfoDetails.style.display === 'block';
    swapInfoDetails.style.display = isExpanded ? 'none' : 'block';
    swapInfoToggle.classList.toggle('expanded', !isExpanded);
});

// Update Swap Info Details
const updateSwapInfoDetails = async () => {
    if (!currentProvider || !fromAmountInput.value || parseFloat(fromAmountInput.value) <= 0) {
        swapInfoDetails.innerHTML = '<p>Enter an amount to see swap details.</p>';
        return;
    }

    const web3 = new Web3(currentProvider);
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    const amountIn = parseFloat(fromAmountInput.value);
    const amountInWei = web3.utils.toWei(amountIn.toString(), 'ether');
    const amountOut = parseFloat(toAmountInput.value) || 0;
    const amountOutWei = web3.utils.toWei(amountOut.toString(), 'ether');

    try {
        const reserves = await swapContract.methods.getReserves(fromToken.address, toToken.address).call();
        const reserveIn = fromToken.address < toToken.address ? reserves.reserveA : reserves.reserveB;
        const reserveOut = fromToken.address < toToken.address ? reserves.reserveB : reserves.reserveA;

        const priceImpact = reserveIn > 0 ? (Number(amountInWei) / (Number(reserveIn) + Number(amountInWei)) * 100).toFixed(2) : '0';
        const fee = (amountIn * 0.003).toFixed(6); // 0.3% fee
        const minimumReceived = web3.utils.fromWei((BigInt(amountOutWei) * BigInt(1000 - slippageTolerance * 10) / BigInt(1000)).toString(), 'ether');

        swapInfoDetails.innerHTML = `
            <p>Price Impact: ${priceImpact}%</p>
            <p>Fee (0.3%): ${fee} ${fromToken.name}</p>
            <p>Minimum Received: ${minimumReceived} ${toToken.name}</p>
            <p>Slippage Tolerance: ${slippageTolerance}%</p>
        `;
    } catch (error) {
        console.error('Error updating swap info details:', error);
        swapInfoDetails.innerHTML = '<p>Unable to fetch swap details.</p>';
    }
};

// Update swap info details on input change
fromAmountInput.addEventListener('input', debounce(async () => {
    await updateSwapInfoDetails();
}, 300));

// Initial Setup on Page Load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing...'); // Debugging

    // Set default tab
    showTab('swap');

    // Set default token display
    fromTokenBtn.innerHTML = `<img src="/assets/img/tea.png" alt="TEA" class="token-img"> TEA`;
    toTokenBtn.innerHTML = `<img src="/assets/img/eth.png" alt="ETH" class="token-img"> ETH`;
    poolTokenABtn.innerHTML = `<img src="/assets/img/tea.png" alt="TEA" class="token-img"> TEA`;
    poolTokenBBtn.innerHTML = `<img src="/assets/img/eth.png" alt="ETH" class="token-img"> ETH`;

    // Check wallet connection
    await checkWalletConnection();

    // Initial updates
    await updateFromBalance();
    await updatePoolBalancesAndInfo();
    await updateLiquidityList();
    await updateSwapButtonState();
    await updateSwapInfoDetails();
    renderSwapHistory();

    // Set default slippage display
    document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;

    console.log('Initialization complete'); // Debugging
});
