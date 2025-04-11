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
const chainStatus = document.getElementById('chain-status');
const chainDot = document.getElementById('chain-dot');

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
const swapContractAddress = "0x02fcE2DB122e701BbeB30b12408Cbc202f7B3eC5";
const faucetContractAddress = "0x2D65E6f9cdF755C64755251B686d9d1f0C5437Fa";

// Swap ABI (Uniswap V2-style untuk CreamySwap)
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
        "outputs": [],
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
        "outputs": [],
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
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "lpBalances",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "reserves",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
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

// Simpen provider dan wallet type
let currentProvider = null;
let walletType = null;
let fromToken = { name: 'TEA', address: '0x0000000000000000000000000000000000000000' };
let toToken = { name: 'ETH', address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870' };
let poolTokenA = { name: 'ETH', address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870' };
let poolTokenB = { name: 'USDT', address: '0x581711F99DaFf0db829B77b9c20b85C697d79b5E' };
let fromBalance = 0;
let poolABalance = 0;
let poolBBalance = 0;
let slippageTolerance = 0.5;

const TEA_SEPOLIA_CHAIN_ID = '0x27ea'; // 10218 in hex

// Swap History
let swapHistory = JSON.parse(localStorage.getItem('swapHistory')) || [];

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'pool') {
            updateLiquidityList();
            updatePoolBalancesAndInfo();
        }
        if (btn.dataset.tab === 'history') renderSwapHistory();
    });
});

// Fungsi untuk baca balance token
const getTokenBalance = async (web3, address, token) => {
    if (token.address === '0x0000000000000000000000000000000000000000') {
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
    if (chainId === parseInt(TEA_SEPOLIA_CHAIN_ID, 16)) {
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
    if (!accounts || accounts.length === 0) return;

    const address = accounts[0];
    fromBalance = await getTokenBalance(web3, address, fromToken);
    fromBalanceSpan.textContent = `${parseFloat(fromBalance).toFixed(4)}`;
    balanceInfo.style.display = 'flex';
    await updateSwapButtonState();
};

// Update balance di pool
const updatePoolBalancesAndInfo = async () => {
    if (!currentProvider) {
        poolABalanceSpan.textContent = '0.0';
        poolBBalanceSpan.textContent = '0.0';
        document.querySelector('.pool-a-balance-info').style.display = 'none';
        document.querySelector('.pool-b-balance-info').style.display = 'none';
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const address = accounts[0];
    poolABalance = await getTokenBalance(web3, address, poolTokenA);
    poolBBalance = await getTokenBalance(web3, address, poolTokenB);
    poolABalanceSpan.textContent = `${parseFloat(poolABalance).toFixed(4)}`;
    poolBBalanceSpan.textContent = `${parseFloat(poolBBalance).toFixed(4)}`;
    document.querySelector('.pool-a-balance-info').style.display = 'flex';
    document.querySelector('.pool-b-balance-info').style.display = 'flex';

    await updateLiquidityButtonState();
    await updatePoolInfo();
};

// Fungsi helper untuk ambil reserve dengan handle TEA
const getReserveForToken = async (web3, swapContract, tokenIn, tokenOut, amountInWei = '0') => {
    if (tokenIn === '0x0000000000000000000000000000000000000000') {
        const contractBalance = await web3.eth.getBalance(swapContractAddress);
        return BigInt(contractBalance) - BigInt(amountInWei); // Kurangi amountIn kalo tokenIn adalah TEA
    } else {
        return BigInt(await swapContract.methods.reserves(tokenIn, tokenOut).call());
    }
};

// Update estimasi output swap
const updateEstimatedOutput = async () => {
    const fromAmount = parseFloat(fromAmountInput.value) || 0;
    toAmountInput.value = '0.0';
    estimatedOutput.textContent = `~0.0 ${toToken.name}`;
    document.getElementById('minimum-received').textContent = `0.0 ${toToken.name}`;
    document.getElementById('price-impact').textContent = '0%';
    document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;
    document.getElementById('gas-fee-value').textContent = '$0.00';
    document.getElementById('network-cost').textContent = '$0.00';

    if (!currentProvider || fromAmount <= 0) return;

    const web3 = new Web3(currentProvider);
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    const amountInWei = web3.utils.toWei(fromAmount.toString(), 'ether');

    let reserveIn, reserveOut;
    try {
        reserveIn = await getReserveForToken(web3, swapContract, fromToken.address, toToken.address, amountInWei);
        reserveOut = await getReserveForToken(web3, swapContract, toToken.address, fromToken.address);

        if (reserveIn <= 0n || reserveOut <= 0n) {
            swapBtn.textContent = 'Insufficient Liquidity';
            swapBtn.disabled = true;
            return;
        }
    } catch (error) {
        console.error('Error fetching reserves:', error);
        swapBtn.textContent = 'Insufficient Liquidity';
        swapBtn.disabled = true;
        return;
    }

    const amountInWithFee = BigInt(amountInWei) * 997n / 1000n; // 0.3% fee
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn + amountInWithFee;
    const amountOut = numerator / denominator;
    const toAmount = web3.utils.fromWei(amountOut.toString(), 'ether');

    const priceBefore = Number(reserveOut) / Number(reserveIn);
    const priceAfter = Number(reserveOut - amountOut) / Number(reserveIn + BigInt(amountInWei));
    const priceImpact = ((priceBefore - priceAfter) / priceBefore) * 100;

    toAmountInput.value = parseFloat(toAmount).toFixed(6);
    estimatedOutput.textContent = `~${parseFloat(toAmount).toFixed(6)} ${toToken.name}`;

    const slippageFactor = 1 - (slippageTolerance / 100);
    const minReceived = parseFloat(toAmount) * slippageFactor;
    document.getElementById('minimum-received').textContent = `${minReceived.toFixed(6)} ${toToken.name}`;
    document.getElementById('price-impact').textContent = `${priceImpact.toFixed(2)}%`;
    document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = 100000;
    const gasFeeInEth = web3.utils.fromWei((BigInt(gasPrice) * BigInt(gasEstimate)).toString(), 'ether');
    const gasFeeInUsd = gasFeeInEth * 2000; // Asumsi 1 ETH = $2000
    document.getElementById('gas-fee-value').textContent = `$${gasFeeInUsd.toFixed(2)}`;
    document.getElementById('network-cost').textContent = `$${gasFeeInUsd.toFixed(2)}`;
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
    const reserveA = await swapContract.methods.reserves(poolTokenA.address, poolTokenB.address).call();
    const reserveB = await swapContract.methods.reserves(poolTokenB.address, poolTokenA.address).call();

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
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const reserveA = await swapContract.methods.reserves(poolTokenA.address, poolTokenB.address).call();
    const reserveB = await swapContract.methods.reserves(poolTokenB.address, poolTokenA.address).call();
    const totalSupply = await swapContract.methods.totalSupply(poolTokenA.address, poolTokenB.address).call();

    const amountA = parseFloat(poolAmountAInput.value) || 0;
    const amountB = parseFloat(poolAmountBInput.value) || 0;

    const priceAPerB = reserveA > 0 ? (Number(reserveB) / Number(reserveA)).toFixed(6) : '0';
    const priceBPerA = reserveB > 0 ? (Number(reserveA) / Number(reserveB)).toFixed(6) : '0';
    const shareOfPool = totalSupply > 0 && amountA > 0 ? ((amountA * 1e18 / (Number(reserveA) + amountA * 1e18)) * 100).toFixed(2) : '0';

    document.getElementById('price-a-per-b').textContent = priceAPerB;
    document.getElementById('label-a-per-b').textContent = `${poolTokenA.name} per ${poolTokenB.name}`;
    document.getElementById('price-b-per-a').textContent = priceBPerA;
    document.getElementById('label-b-per-a').textContent = `${poolTokenB.name} per ${poolTokenA.name}`;
    document.getElementById('pool-share').textContent = `${shareOfPool}%`;
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
        swapBtn.textContent = 'Enter an amount';
        swapBtn.disabled = true;
        return;
    }

    const reserveIn = await new web3.eth.Contract(swapContractAbi, swapContractAddress)
        .methods.reserves(fromToken.address, toToken.address).call();
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

    if (fromToken.address === '0x0000000000000000000000000000000000000000') {
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
    if (!currentProvider) {
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
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Connect Wallet';
        addLiquidityBtn.dataset.action = 'connect';
        addLiquidityBtn.disabled = false;
        return;
    }

    const amountA = parseFloat(poolAmountAInput.value) || 0;
    const amountB = parseFloat(poolAmountBInput.value) || 0;

    if (amountA <= 0 || amountB <= 0) {
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Enter an amount';
        addLiquidityBtn.disabled = true;
        delete addLiquidityBtn.dataset.action;
        return;
    }

    if (amountA > parseFloat(poolABalance) || amountB > parseFloat(poolBBalance)) {
        approveABtn.style.display = 'none';
        approveBBtn.style.display = 'none';
        addLiquidityBtn.textContent = 'Insufficient Balance';
        addLiquidityBtn.disabled = true;
        delete addLiquidityBtn.dataset.action;
        return;
    }

    let needApproveA = false;
    let needApproveB = false;

    if (poolTokenA.address !== '0x0000000000000000000000000000000000000000') {
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

    if (poolTokenB.address !== '0x0000000000000000000000000000000000000000') {
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
    } else {
        delete addLiquidityBtn.dataset.action;
    }
};

// Event listener input
fromAmountInput.addEventListener('input', debounce(async () => {
    await updateEstimatedOutput();
    await updateSwapButtonState();
}, 300));

poolAmountAInput.addEventListener('input', debounce(async () => {
    await updateLiquidityEstimate();
    await updateLiquidityButtonState();
}, 300));

poolAmountBInput.addEventListener('input', debounce(updateLiquidityButtonState, 300));

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
    tokenList.innerHTML = `
        <div class="token-option" data-token="TEA" data-address="0x0000000000000000000000000000000000000000">
            <img src="/assets/img/tea.png" alt="TEA"> TEA
        </div>
        <div class="token-option" data-token="ETH" data-address="0xadc8988012410F9ED43f840E6499b74C1Cf94870">
            <img src="/assets/img/eth.png" alt="ETH"> ETH
        </div>
        <div class="token-option" data-token="USDT" data-address="0x581711F99DaFf0db829B77b9c20b85C697d79b5E">
            <img src="/assets/img/usdt.png" alt="USDT"> USDT
        </div>
    `;
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
        fromToken = { name: token, address };
        await updateFromBalance();
    } else if (currentInput === 'to') {
        btn = toTokenBtn;
        toToken = { name: token, address };
    } else if (currentInput === 'poolA') {
        btn = poolTokenABtn;
        poolTokenA = { name: token, address };
        await updatePoolBalancesAndInfo();
    } else if (currentInput === 'poolB') {
        btn = poolTokenBBtn;
        poolTokenB = { name: token, address };
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
        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', symbol);
        tokenOption.setAttribute('data-address', tokenAddress);
        tokenOption.innerHTML = `<img src="/assets/img/default-token.png" alt="${symbol}"> ${symbol}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));
        customTokenAddressInput.value = '';
        alert(`${symbol} added successfully!`);
    } catch (error) {
        console.error('Error adding custom token:', error);
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

// Success Modal Function
const showSuccessModal = (message, txHash) => {
    successMessage.textContent = message;
    txLink.href = `https://sepolia.tea.xyz/tx/${txHash}`;
    successModal.classList.add('active');
    overlay.style.display = 'block';
};

closeModal.addEventListener('click', () => {
    successModal.classList.remove('active');
    overlay.style.display = 'none';
});

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
            // Kalo udah connect ke wallet yang sama, skip proses baru
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
                if (chainId === TEA_SEPOLIA_CHAIN_ID) return true; // Skip kalo udah di Tea Sepolia

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
                                rpcUrls: ['https://rpc.teatest.live'],
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
                return false; // Jangan popup langsung, kasih ke caller buat handle
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
                } else {
                    showErrorModal('Failed to switch to Tea Sepolia. Please switch manually.');
                }
            } catch (error) {
                console.error('MetaMask connection error:', error);
                if (error.code === 4001) { // User rejected request
                    showErrorModal('Connection rejected by user.');
                } else {
                    showErrorModal('Failed to connect MetaMask. Check your wallet.');
                }
                currentProvider = null; // Reset kalo gagal
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
                } else {
                    showErrorModal('Failed to switch to Tea Sepolia. Please switch manually.');
                }
            } catch (error) {
                console.error('OKX Wallet connection error:', error);
                if (error.code === 4001) {
                    showErrorModal('Connection rejected by user.');
                } else {
                    showErrorModal('Failed to connect OKX Wallet. Check your wallet.');
                }
                currentProvider = null;
            }
        } else {
            alert(`Please install ${wallet === 'metamask' ? 'MetaMask' : 'OKX Wallet'} to use this wallet!`);
        }

        if (currentProvider) {
            currentProvider.on('accountsChanged', async (accounts) => {
                if (accounts.length > 0) {
                    connectWalletBtn.textContent = formatAddress(accounts[0]);
                    await updateFromBalance();
                    await updatePoolBalancesAndInfo();
                    await updateLiquidityList();
                } else {
                    disconnectWallet();
                }
            });

            currentProvider.on('chainChanged', async () => {
                await updateChainStatus();
                await updateFromBalance();
                await updatePoolBalancesAndInfo();
                await updateLiquidityList();
            });
        }
    });
});

// Show Assets
const showAssets = async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    assetList.innerHTML = '';

    const tokens = [
        { name: 'TEA', address: '0x0000000000000000000000000000000000000000' },
        { name: 'ETH', address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870' },
        { name: 'USDT', address: '0x581711F99DaFf0db829B77b9c20b85C697d79b5E' }
    ];

    for (const token of tokens) {
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
    liquidityList.innerHTML = '<p>Connect wallet to see your liquidity.</p>';
    removeLiquidityBtn.disabled = true;
};

disconnectWalletBtn.addEventListener('click', () => {
    disconnectWallet();
    assetModal.style.display = 'none';
    overlay.style.display = 'none';
});

// Tombol Swap/Approve
swapBtn.addEventListener('click', async () => {
    if (swapBtn.dataset.action === 'connect') {
        connectWalletModal.style.display = 'block';
        overlay.style.display = 'block';
        return;
    }
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
    let reserveIn, reserveOut;
    try {
        reserveIn = await getReserveForToken(web3, swapContract, fromToken.address, toToken.address, amountIn);
        reserveOut = await getReserveForToken(web3, swapContract, toToken.address, fromToken.address);

        if (reserveIn <= 0n || reserveOut <= 0n) {
            alert('Insufficient liquidity in the pool. Please add liquidity first!');
            return;
        }
    } catch (error) {
        alert('Failed to fetch reserves. Liquidity pool might be empty.');
        return;
    }

    const amountInWithFee = BigInt(amountIn) * 997n / 1000n;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn + amountInWithFee;
    const amountOut = numerator / denominator;
    const amountOutMin = BigInt(Math.floor(Number(amountOut) * slippageFactor));

    try {
        if (swapBtn.dataset.action === 'approve' && fromToken.address !== '0x0000000000000000000000000000000000000000') {
            const tokenContract = new web3.eth.Contract(erc20Abi, fromToken.address);
            swapBtn.textContent = `Approving ${fromToken.name}...`;
            swapBtn.disabled = true;
            const tx = await tokenContract.methods.approve(swapContractAddress, amountIn).send({ from: accounts[0] });
            await new Promise(resolve => setTimeout(resolve, 2000));
            showSuccessModal(`Approved ${fromToken.name} successfully!`, tx.transactionHash);
            swapBtn.textContent = 'Swap';
            swapBtn.dataset.action = 'swap';
            swapBtn.disabled = false;
            return;
        }

        swapBtn.textContent = 'Swapping...';
        swapBtn.disabled = true;
        const txOptions = fromToken.address === '0x0000000000000000000000000000000000000000'
            ? { from: accounts[0], value: amountIn, gas: 300000 }
            : { from: accounts[0], gas: 300000 };
        const tx = await swapContract.methods.swap(
            fromToken.address,
            toToken.address,
            amountIn,
            amountOutMin
        ).send(txOptions);

        const toAmount = web3.utils.fromWei(amountOut.toString(), 'ether');
        addToSwapHistory('swap', fromAmount, fromToken.name, toAmount, toToken.name, tx.transactionHash);
        showSuccessModal(`Swapped ${fromAmount} ${fromToken.name} to ${toAmount} ${toToken.name}!`, tx.transactionHash);
        await updateFromBalance();
        fromAmountInput.value = '';
        toAmountInput.value = '';
        swapBtn.textContent = 'Swap';
        swapBtn.disabled = false;
    } catch (error) {
        console.error('Swap/Approve error:', error);
        let errorMsg = 'Transaction failed!';
        if (error.message.includes('reverted')) {
            errorMsg = 'Transaction reverted by the EVM. Check liquidity or slippage.';
        } else if (error.message.includes('insufficient funds')) {
            errorMsg = 'Insufficient funds for gas or token amount.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
        swapBtn.textContent = swapBtn.dataset.action === 'approve' ? `Approve ${fromToken.name}` : 'Swap';
        swapBtn.disabled = false;
    }
});

// Approve Token A
approveABtn.addEventListener('click', async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const amountA = parseFloat(poolAmountAInput.value);
    const amountAWei = web3.utils.toWei(amountA.toString(), 'ether');

    try {
        approveABtn.textContent = `Approving ${poolTokenA.name}...`;
        approveABtn.disabled = true;
        const tokenAContract = new web3.eth.Contract(erc20Abi, poolTokenA.address);
        const tx = await tokenAContract.methods.approve(swapContractAddress, amountAWei).send({ from: accounts[0] });
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccessModal(`Approved ${poolTokenA.name} successfully!`, tx.transactionHash);
        await updateLiquidityButtonState();
    } catch (error) {
        console.error('Approve A error:', error);
        let errorMsg = `Failed to approve ${poolTokenA.name}!`;
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction reverted by the EVM.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
        approveABtn.textContent = `Approve ${poolTokenA.name}`;
        approveABtn.disabled = false;
    }
});

// Approve Token B
approveBBtn.addEventListener('click', async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const amountB = parseFloat(poolAmountBInput.value);
    const amountBWei = web3.utils.toWei(amountB.toString(), 'ether');

    try {
        approveBBtn.textContent = `Approving ${poolTokenB.name}...`;
        approveBBtn.disabled = true;
        const tokenBContract = new web3.eth.Contract(erc20Abi, poolTokenB.address);
        const tx = await tokenBContract.methods.approve(swapContractAddress, amountBWei).send({ from: accounts[0] });
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccessModal(`Approved ${poolTokenB.name} successfully!`, tx.transactionHash);
        await updateLiquidityButtonState();
    } catch (error) {
        console.error('Approve B error:', error);
        let errorMsg = `Failed to approve ${poolTokenB.name}!`;
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction reverted by the EVM.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
        approveBBtn.textContent = `Approve ${poolTokenB.name}`;
        approveBBtn.disabled = false;
    }
});

// Add Liquidity
addLiquidityBtn.addEventListener('click', async () => {
    if (addLiquidityBtn.dataset.action === 'connect') {
        connectWalletModal.style.display = 'block';
        overlay.style.display = 'block';
        return;
    }
    if (!currentProvider) return;

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const amountA = parseFloat(poolAmountAInput.value);
    const amountB = parseFloat(poolAmountBInput.value);
    const amountAWei = web3.utils.toWei(amountA.toString(), 'ether');
    const amountBWei = web3.utils.toWei(amountB.toString(), 'ether');
    const slippageFactor = 1 - (slippageTolerance / 100);
    const amountAMin = BigInt(Math.floor(amountAWei * slippageFactor));
    const amountBMin = BigInt(Math.floor(amountBWei * slippageFactor));

    try {
        addLiquidityBtn.textContent = 'Adding Liquidity...';
        addLiquidityBtn.disabled = true;

        const txOptions = poolTokenA.address === '0x0000000000000000000000000000000000000000'
            ? { from: accounts[0], value: amountAWei, gas: 500000 }
            : poolTokenB.address === '0x0000000000000000000000000000000000000000'
            ? { from: accounts[0], value: amountBWei, gas: 500000 }
            : { from: accounts[0], gas: 500000 };
        const tx = await swapContract.methods.addLiquidity(
            poolTokenA.address,
            poolTokenB.address,
            amountAWei,
            amountBWei,
            amountAMin,
            amountBMin
        ).send(txOptions);

        showSuccessModal(`Added ${amountA} ${poolTokenA.name} + ${amountB} ${poolTokenB.name} liquidity!`, tx.transactionHash);
        addToSwapHistory('add', amountA, poolTokenA.name, amountB, poolTokenB.name, tx.transactionHash);
        poolAmountAInput.value = '';
        poolAmountBInput.value = '';
        await updatePoolBalancesAndInfo();
        await updateLiquidityList();
    } catch (error) {
        console.error('Add liquidity error:', error);
        let errorMsg = 'Failed to add liquidity!';
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction reverted by the EVM. Check token balances or allowances.';
        } else if (error.message.includes('insufficient funds')) {
            errorMsg += ' Insufficient funds for gas or tokens.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
    } finally {
        addLiquidityBtn.textContent = 'Add Liquidity';
        addLiquidityBtn.disabled = false;
    }
});

// Update Liquidity List
const updateLiquidityList = async () => {
    if (!currentProvider) {
        liquidityList.innerHTML = '<p>Connect wallet to see your liquidity.</p>';
        removeLiquidityBtn.disabled = true;
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    liquidityList.innerHTML = '';
    // Daftar token yang mungkin ada di liquidity (default + custom)
    const knownTokens = [
        { address: '0x0000000000000000000000000000000000000000', name: 'TEA' },
        { address: '0xadc8988012410F9ED43f840E6499b74C1Cf94870', name: 'ETH' },
        { address: '0x581711F99DaFf0db829B77b9c20b85C697d79b5E', name: 'USDT' }
        // Custom token bakal ditambah otomatis via addCustomTokenBtn
    ];

    let hasLiquidity = false;
    for (let i = 0; i < knownTokens.length; i++) {
        for (let j = i + 1; j < knownTokens.length; j++) {
            const tokenA = knownTokens[i].address;
            const tokenB = knownTokens[j].address;
            const lpBalance = await swapContract.methods.lpBalances(accounts[0], tokenA, tokenB).call().catch(() => '0');
            if (BigInt(lpBalance) > 0n) {
                const totalSupply = await swapContract.methods.totalSupply(tokenA, tokenB).call();
                const reserveA = await swapContract.methods.reserves(tokenA, tokenB).call();
                const reserveB = await swapContract.methods.reserves(tokenB, tokenA).call();

                const share = (Number(lpBalance) / Number(totalSupply)) * 100;
                const amountA = (BigInt(lpBalance) * BigInt(reserveA)) / BigInt(totalSupply);
                const amountB = (BigInt(lpBalance) * BigInt(reserveB)) / BigInt(totalSupply);

                const amountAFormatted = web3.utils.fromWei(amountA.toString(), 'ether');
                const amountBFormatted = web3.utils.fromWei(amountB.toString(), 'ether');

                const li = document.createElement('div');
                li.className = 'liquidity-item';
                li.innerHTML = `
                    <span>${knownTokens[i].name}/${knownTokens[j].name}: ${parseFloat(amountAFormatted).toFixed(4)} ${knownTokens[i].name} + ${parseFloat(amountBFormatted).toFixed(4)} ${knownTokens[j].name}</span>
                    <span>${share.toFixed(2)}%</span>
                `;
                li.dataset.tokenA = tokenA;
                li.dataset.tokenB = tokenB;
                li.dataset.lpAmount = lpBalance;
                li.addEventListener('click', () => {
                    document.querySelectorAll('.liquidity-item').forEach(item => item.classList.remove('selected'));
                    li.classList.add('selected');
                    removeLiquidityBtn.disabled = false;
                });
                liquidityList.appendChild(li);
                hasLiquidity = true;
            }
        }
    }

    if (!hasLiquidity) {
        liquidityList.innerHTML = '<p>No liquidity provided yet.</p>';
        removeLiquidityBtn.disabled = true;
    }
};

// Update addCustomTokenBtn biar nambah ke knownTokens
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
        // Tambah ke knownTokens kalo belum ada
        if (!knownTokens.some(t => t.address.toLowerCase() === tokenAddress.toLowerCase())) {
            knownTokens.push({ address: tokenAddress, name: symbol });
        }
        const tokenOption = document.createElement('div');
        tokenOption.className = 'token-option';
        tokenOption.setAttribute('data-token', symbol);
        tokenOption.setAttribute('data-address', tokenAddress);
        tokenOption.innerHTML = `<img src="/assets/img/default-token.png" alt="${symbol}"> ${symbol}`;
        tokenList.appendChild(tokenOption);
        tokenOption.addEventListener('click', () => selectToken(tokenOption));
        customTokenAddressInput.value = '';
        alert(`${symbol} added successfully!`);
        await updateLiquidityList(); // Refresh liquidity list setelah nambah token
    } catch (error) {
        console.error('Error adding custom token:', error);
        alert('Failed to add token!');
    }
});

// Remove Liquidity
removeLiquidityBtn.addEventListener('click', async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const selectedItem = document.querySelector('.liquidity-item.selected');
    if (!selectedItem) {
        alert('Please select a liquidity position to remove!');
        return;
    }

    const tokenA = selectedItem.dataset.tokenA;
    const tokenB = selectedItem.dataset.tokenB;
    const lpAmount = selectedItem.dataset.lpAmount;
    const slippageFactor = 1 - (slippageTolerance / 100);

    const reserveA = await swapContract.methods.reserves(tokenA, tokenB).call();
    const reserveB = await swapContract.methods.reserves(tokenB, tokenA).call();
    const totalSupply = await swapContract.methods.totalSupply(tokenA, tokenB).call();

    const amountA = (lpAmount * reserveA) / totalSupply;
    const amountB = (lpAmount * reserveB) / totalSupply;
    const amountAMin = BigInt(Math.floor(Number(amountA) * slippageFactor));
    const amountBMin = BigInt(Math.floor(Number(amountB) * slippageFactor));

    try {
        const tx = await swapContract.methods.removeLiquidity(
            tokenA,
            tokenB,
            lpAmount,
            amountAMin,
            amountBMin
        ).send({ from: accounts[0], gas: 500000 });

        const amountAFormatted = web3.utils.fromWei(amountA.toString(), 'ether');
        const amountBFormatted = web3.utils.fromWei(amountB.toString(), 'ether');

        showSuccessModal(`Removed ${amountAFormatted} ${poolTokenA.name} + ${amountBFormatted} ${poolTokenB.name} liquidity!`, tx.transactionHash);
        addToSwapHistory('remove', amountAFormatted, poolTokenA.name, amountBFormatted, poolTokenB.name, tx.transactionHash);
        await updateLiquidityList();
        await updatePoolBalancesAndInfo();
        removeLiquidityBtn.disabled = true;
    } catch (error) {
        console.error('Remove liquidity error:', error);
        let errorMsg = 'Failed to remove liquidity!';
        if (error.message.includes('reverted')) {
            errorMsg += ' Transaction reverted by the EVM.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
    }
});

// Swap History
const addToSwapHistory = (type, amountA, tokenA, amountB, tokenB, txHash) => {
    const historyItem = {
        type,
        amountA: parseFloat(amountA).toFixed(4),
        tokenA,
        amountB: parseFloat(amountB).toFixed(4),
        tokenB,
        txHash,
        timestamp: new Date().toISOString()
    };
    swapHistory.unshift(historyItem);
    localStorage.setItem('swapHistory', JSON.stringify(swapHistory));
    renderSwapHistory();
};

const renderSwapHistory = () => {
    swapHistoryList.innerHTML = swapHistory.map(item => `
        <div class="history-item">
            <span>${item.type === 'swap' ? `Swapped ${item.amountA} ${item.tokenA} to ${item.amountB} ${item.tokenB}` : 
                    item.type === 'add' ? `Added ${item.amountA} ${item.tokenA} + ${item.amountB} ${item.tokenB}` : 
                    `Removed ${item.amountA} ${item.tokenA} + ${item.amountB} ${item.tokenB}`}</span>
            <a href="https://sepolia.tea.xyz/tx/${item.txHash}" target="_blank">Tx</a>
        </div>
    `).join('') || '<p>No swap history yet.</p>';
};

// Faucet Claim
faucetBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet first!');
        return;
    }
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const faucetContract = new web3.eth.Contract(faucetAbi, faucetContractAddress);

    try {
        faucetBtn.textContent = 'Claiming...';
        faucetBtn.disabled = true;
        const tx = await faucetContract.methods.claim().send({ from: accounts[0], gas: 200000 });
        showSuccessModal('Claimed 10 ETH and 10 USDT!', tx.transactionHash);
        await updateFromBalance();
        await updatePoolBalancesAndInfo();
    } catch (error) {
        console.error('Faucet error:', error);
        let errorMsg = 'Faucet failed!';
        if (error.message.includes('reverted')) {
            errorMsg += ' Might be due to cooldown or insufficient faucet balance.';
        }
        showErrorModal(errorMsg, error.transactionHash || null);
    } finally {
        faucetBtn.textContent = 'Get Faucet';
        faucetBtn.disabled = false;
    }
});

// Toggle Swap Info Details
swapInfoToggle.addEventListener('click', () => {
    swapInfoDetails.classList.toggle('active');
    swapInfoToggle.classList.toggle('active');
    const chevron = swapInfoToggle.querySelector('.chevron');
    chevron.textContent = swapInfoDetails.classList.contains('active') ? '▲' : '▼';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('dark-mode') && !document.body.classList.contains('light-mode')) {
        document.body.classList.add('dark-mode');
    }
    updateChainStatus();
    updateFromBalance();
    updatePoolBalancesAndInfo();
    updateLiquidityList();
    renderSwapHistory();
});
