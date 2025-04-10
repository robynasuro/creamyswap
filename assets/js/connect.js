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

// Pool Elements
const poolAmountAInput = document.getElementById('pool-amount-a');
const poolAmountBInput = document.getElementById('pool-amount-b');
const poolTokenABtn = document.getElementById('pool-token-a-btn');
const poolTokenBBtn = document.getElementById('pool-token-b-btn');
const addLiquidityBtn = document.getElementById('add-liquidity-btn');
const liquidityList = document.getElementById('liquidity-list');
const removeLiquidityBtn = document.getElementById('remove-liquidity-btn');

// Faucet
const faucetBtn = document.getElementById('faucet-btn');

// Token Select Modal
const tokenSelectModal = document.getElementById('token-select-modal');
const tokenList = document.getElementById('token-list');
const customTokenAddressInput = document.getElementById('custom-token-address');
const addCustomTokenBtn = document.getElementById('add-custom-token-btn');

// Contract setup
const swapContractAddress = "0xF4c54E267B56066731B6BA27F2b7b8e9Fe087144";
const faucetContractAddress = "0x2eAb116f6A210ff5656892bD9bb8d7c60fAde92C";

// Swap ABI (Uniswap V2-style untuk CreamySwap)
const swapContractAbi = [
    {
        "inputs": [
            {"internalType": "address", "name": "tokenA", "type": "address"},
            {"internalType": "address", "name": "tokenB", "type": "address"},
            {"internalType": "uint256", "name": "amountADesired", "type": "uint256"},
            {"internalType": "uint256", "name": "amountBDesired", "type": "uint256"},
            {"internalType": "uint256", "name": "amountAMin", "type": "uint256"},
            {"internalType": "uint256", "name": "amountBMin", "type": "uint256"}
        ],
        "name": "addLiquidity",
        "outputs": [
            {"internalType": "uint256", "name": "amountA", "type": "uint256"},
            {"internalType": "uint256", "name": "amountB", "type": "uint256"},
            {"internalType": "uint256", "name": "liquidity", "type": "uint256"}
        ],
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

// Faucet ABI (CreamyFaucet)
const faucetAbi = [
    {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "ethAmount", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "usdtAmount", "type": "uint256"}
        ],
        "name": "Claimed",
        "type": "event"
    }
];

const erc20Abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Simpen provider dan wallet type
let currentProvider = null;
let walletType = null;
let fromToken = { name: 'TEA', address: '0x0000000000000000000000000000000000000000' };
let toToken = { name: 'ETH', address: '0x8339581846eDf61dc147966E807e48763dCb09E8' };
let poolTokenA = { name: 'ETH', address: '0x8339581846eDf61dc147966E807e48763dCb09E8' };
let poolTokenB = { name: 'USDT', address: '0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168' };
let fromBalance = 0;
let slippageTolerance = 0.5;

const TEA_SEPOLIA_CHAIN_ID = '0x27ea'; // 10218 in hex

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (btn.dataset.tab === 'pool') updateLiquidityList();
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
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const address = accounts[0];
    fromBalance = await getTokenBalance(web3, address, fromToken);
    fromBalanceSpan.textContent = `${parseFloat(fromBalance).toFixed(4)}`;
    balanceInfo.style.display = 'flex';
    await updateSwapButtonState();
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
    let reserveIn, reserveOut;
    try {
        reserveIn = await swapContract.methods.reserves(fromToken.address, toToken.address).call();
        reserveOut = await swapContract.methods.reserves(toToken.address, fromToken.address).call();
    } catch (error) {
        console.error('Error fetching reserves:', error);
        swapBtn.textContent = 'Insufficient Liquidity';
        swapBtn.disabled = true;
        return;
    }

    if (reserveIn == 0 || reserveOut == 0) {
        swapBtn.textContent = 'Insufficient Liquidity';
        swapBtn.disabled = true;
        return;
    }

    const amountIn = web3.utils.toWei(fromAmount.toString(), 'ether');
    const amountInWithFee = BigInt(amountIn) * BigInt(997) / BigInt(1000); // 0.3% fee
    const numerator = BigInt(reserveOut) * amountInWithFee;
    const denominator = (BigInt(reserveIn) * BigInt(1000)) + amountInWithFee;
    const amountOut = numerator / denominator;
    const toAmount = web3.utils.fromWei(amountOut.toString(), 'ether');

    toAmountInput.value = toAmount.toFixed(6);
    estimatedOutput.textContent = `~${toAmount.toFixed(6)} ${toToken.name}`;

    const slippageFactor = 1 - (slippageTolerance / 100);
    const minReceived = toAmount * slippageFactor;
    document.getElementById('minimum-received').textContent = `${minReceived.toFixed(6)} ${toToken.name}`;
    document.getElementById('price-impact').textContent = '0.1%';
    document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = 100000;
    const gasFeeInEth = web3.utils.fromWei((gasPrice * gasEstimate).toString(), 'ether');
    const gasFeeInUsd = gasFeeInEth * 2000;
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
        poolAmountBInput.value = amountA.toFixed(6); // Initial 1:1 if no liquidity
    } else {
        const amountB = (amountA * reserveB) / reserveA;
        poolAmountBInput.value = amountB.toFixed(6);
    }
};

// Fungsi cek allowance dan update tombol Approve/Swap
const updateSwapButtonState = async () => {
    if (!currentProvider) {
        swapBtn.textContent = 'Connect Wallet';
        swapBtn.dataset.action = 'connect';
        swapBtn.disabled = false;
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

// Event listener buat input "From" dan "Pool A"
fromAmountInput.addEventListener('input', async () => {
    await updateEstimatedOutput();
    await updateSwapButtonState();
});

poolAmountAInput.addEventListener('input', updateLiquidityEstimate);

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
            <img src="assets/img/tea.png" alt="TEA"> TEA
        </div>
        <div class="token-option" data-token="ETH" data-address="0x8339581846eDf61dc147966E807e48763dCb09E8">
            <img src="assets/img/eth.png" alt="ETH"> ETH
        </div>
        <div class="token-option" data-token="USDT" data-address="0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168">
            <img src="assets/img/usdt.png" alt="USDT"> USDT
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
        await updateLiquidityEstimate();
    } else if (currentInput === 'poolB') {
        btn = poolTokenBBtn;
        poolTokenB = { name: token, address };
        await updateLiquidityEstimate();
    }
    btn.innerHTML = `<img src="assets/img/${token.toLowerCase()}.png" alt="${token}" class="token-img"> ${token}`;
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
        document.getElementById('max-slippage').textContent = `Auto ${slippageTolerance}%`;
        updateEstimatedOutput();
        slippagePopup.style.display = 'none';
    });
});

// Tombol Swap/Approve
swapBtn.addEventListener('click', async () => {
    if (!currentProvider && swapBtn.dataset.action === 'connect') {
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
        reserveIn = await swapContract.methods.reserves(fromToken.address, toToken.address).call();
        reserveOut = await swapContract.methods.reserves(toToken.address, fromToken.address).call();
    } catch (error) {
        alert('Failed to fetch reserves. Liquidity pool might be empty.');
        return;
    }

    if (reserveIn == 0 || reserveOut == 0) {
        alert('Insufficient liquidity in the pool. Please add liquidity first!');
        return;
    }

    const amountInWithFee = BigInt(amountIn) * BigInt(997) / BigInt(1000);
    const numerator = BigInt(reserveOut) * amountInWithFee;
    const denominator = (BigInt(reserveIn) * BigInt(1000)) + amountInWithFee;
    const amountOut = numerator / denominator;
    const amountOutMin = BigInt(Math.floor(Number(amountOut) * slippageFactor));

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

        swapBtn.textContent = 'Swapping...';
        swapBtn.disabled = true;
        const tx = await swapContract.methods.swap(
            fromToken.address,
            toToken.address,
            amountIn,
            amountOutMin
        ).send({
            from: accounts[0],
            value: fromToken.address === '0x0000000000000000000000000000000000000000' ? amountIn : 0,
            gas: 300000
        });

        showSuccessModal(`Swapped ${fromAmount} ${fromToken.name} to ${toToken.name}!`, tx.transactionHash);
        await updateFromBalance();
        swapBtn.textContent = 'Swap';
        swapBtn.disabled = false;
    } catch (error) {
        console.error('Swap/Approve error:', error);
        alert(`Transaction failed! ${error.message || 'Check console for details.'}`);
        swapBtn.textContent = swapBtn.dataset.action === 'approve' ? `Approve ${fromToken.name}` : 'Swap';
        swapBtn.disabled = false;
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

        const ensureTeaSepolia = async (provider) => {
            try {
                const chainId = await provider.request({ method: 'eth_chainId' });
                if (chainId !== TEA_SEPOLIA_CHAIN_ID) {
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
                await updateChainStatus();
                await updateFromBalance();

                provider.on('chainChanged', () => {
                    updateChainStatus();
                    updateFromBalance();
                });
                provider.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        connectWalletBtn.textContent = formatAddress(accounts[0]);
                        updateFromBalance();
                    } else {
                        disconnectWallet();
                    }
                });
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
                await updateChainStatus();
                await updateFromBalance();

                provider.on('chainChanged', () => {
                    updateChainStatus();
                    updateFromBalance();
                });
                provider.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        connectWalletBtn.textContent = formatAddress(accounts[0]);
                        updateFromBalance();
                    } else {
                        disconnectWallet();
                    }
                });
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

    const teaBalance = await getTokenBalance(web3, address, { name: 'TEA', address: '0x0000000000000000000000000000000000000000' });
    assetList.innerHTML += `<div class="asset-item"><span>TEA</span><span>${parseFloat(teaBalance).toFixed(4)} TEA</span></div>`;
    const ethBalance = await getTokenBalance(web3, address, { name: 'ETH', address: '0x8339581846eDf61dc147966E807e48763dCb09E8' });
    assetList.innerHTML += `<div class="asset-item"><span>ETH</span><span>${parseFloat(ethBalance).toFixed(4)} ETH</span></div>`;
    const usdtBalance = await getTokenBalance(web3, address, { name: 'USDT', address: '0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168' });
    assetList.innerHTML += `<div class="asset-item"><span>USDT</span><span>${parseFloat(usdtBalance).toFixed(4)} USDT</span></div>`;

    assetModal.style.display = 'block';
    overlay.style.display = 'block';
};

// Disconnect Wallet
const disconnectWallet = () => {
    currentProvider = null;
    walletType = null;
    connectWalletBtn.textContent = 'Connect Wallet';
    assetModal.style.display = 'none';
    overlay.style.display = 'none';
    balanceInfo.style.display = 'none';
    chainDot.classList.remove('online');
    chainDot.classList.add('offline');
    chainStatus.textContent = 'Tea Sepolia';
};

disconnectWalletBtn.addEventListener('click', disconnectWallet);

// Swap Info Toggle
swapInfoToggle.addEventListener('click', () => {
    swapInfoToggle.classList.toggle('active');
    swapInfoDetails.classList.toggle('active');
});

// Faucet Button
faucetBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet to Tea Sepolia first!');
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
    } catch (error) {
        console.error('Faucet error:', error);
        alert(`Faucet failed! ${error.message || 'Might be due to cooldown or insufficient faucet balance.'}`);
    } finally {
        faucetBtn.textContent = 'Get Faucet';
        faucetBtn.disabled = false;
    }
});

// Add Liquidity
addLiquidityBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet to Tea Sepolia first!');
        return;
    }
    const amountA = parseFloat(poolAmountAInput.value) || 0;
    const amountB = parseFloat(poolAmountBInput.value) || 0;
    if (amountA <= 0 || amountB <= 0) {
        alert('Please enter valid amounts!');
        return;
    }

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    const amountAWei = web3.utils.toWei(amountA.toString(), 'ether');
    const amountBWei = web3.utils.toWei(amountB.toString(), 'ether');
    const amountAMin = web3.utils.toWei((amountA * 0.95).toString(), 'ether'); // 5% slippage
    const amountBMin = web3.utils.toWei((amountB * 0.95).toString(), 'ether');

    try {
        if (poolTokenA.address !== '0x0000000000000000000000000000000000000000') {
            const tokenAContract = new web3.eth.Contract(erc20Abi, poolTokenA.address);
            await tokenAContract.methods.approve(swapContractAddress, amountAWei).send({ from: accounts[0] });
        }
        if (poolTokenB.address !== '0x0000000000000000000000000000000000000000') {
            const tokenBContract = new web3.eth.Contract(erc20Abi, poolTokenB.address);
            await tokenBContract.methods.approve(swapContractAddress, amountBWei).send({ from: accounts[0] });
        }

        const tx = await swapContract.methods.addLiquidity(
            poolTokenA.address,
            poolTokenB.address,
            amountAWei,
            amountBWei,
            amountAMin,
            amountBMin
        ).send({
            from: accounts[0],
            value: poolTokenA.address === '0x0000000000000000000000000000000000000000' ? amountAWei : poolTokenB.address === '0x0000000000000000000000000000000000000000' ? amountBWei : 0,
            gas: 500000
        });

        showSuccessModal(`Added ${amountA} ${poolTokenA.name} + ${amountB} ${poolTokenB.name} liquidity!`, tx.transactionHash);
        await updateLiquidityList();
    } catch (error) {
        console.error('Add liquidity error:', error);
        alert(`Failed to add liquidity! ${error.message}`);
    }
});

// Update Liquidity List
const updateLiquidityList = async () => {
    if (!currentProvider) return;
    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return;

    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);
    liquidityList.innerHTML = '';

    const pairs = [
        { tokenA: '0x0000000000000000000000000000000000000000', tokenB: '0x8339581846eDf61dc147966E807e48763dCb09E8', nameA: 'TEA', nameB: 'ETH' },
        { tokenA: '0x0000000000000000000000000000000000000000', tokenB: '0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168', nameA: 'TEA', nameB: 'USDT' },
        { tokenA: '0x8339581846eDf61dc147966E807e48763dCb09E8', tokenB: '0x9e1C4327ee92248C6b8B76d175d20B8F5cf1b168', nameA: 'ETH', nameB: 'USDT' }
    ];

    for (const pair of pairs) {
        const lpBalance = await swapContract.methods.lpBalances(pair.tokenA, pair.tokenB, accounts[0]).call();
        if (lpBalance > 0) {
            const reserveA = await swapContract.methods.reserves(pair.tokenA, pair.tokenB).call();
            const reserveB = await swapContract.methods.reserves(pair.tokenB, pair.tokenA).call();
            const totalSupply = await swapContract.methods.totalSupply(pair.tokenA, pair.tokenB).call();
            const amountA = (lpBalance * reserveA) / totalSupply;
            const amountB = (lpBalance * reserveB) / totalSupply;
            liquidityList.innerHTML += `
                <div class="liquidity-item" data-token-a="${pair.tokenA}" data-token-b="${pair.tokenB}" data-lp="${lpBalance}">
                    <span>${pair.nameA}/${pair.nameB}</span>
                    <span>${(amountA / 1e18).toFixed(4)} ${pair.nameA} + ${(amountB / 1e18).toFixed(4)} ${pair.nameB}</span>
                </div>
            `;
        }
    }
    liquidityList.querySelectorAll('.liquidity-item').forEach(item => {
        item.addEventListener('click', () => {
            liquidityList.querySelectorAll('.liquidity-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            removeLiquidityBtn.disabled = false;
        });
    });
};

// Remove Liquidity
removeLiquidityBtn.addEventListener('click', async () => {
    if (!currentProvider) {
        alert('Please connect your wallet to Tea Sepolia first!');
        return;
    }
    const selected = liquidityList.querySelector('.liquidity-item.selected');
    if (!selected) {
        alert('Please select a liquidity position!');
        return;
    }

    const tokenA = selected.dataset.tokenA;
    const tokenB = selected.dataset.tokenB;
    const lpAmount = selected.dataset.lp;

    const web3 = new Web3(currentProvider);
    const accounts = await web3.eth.getAccounts();
    const swapContract = new web3.eth.Contract(swapContractAbi, swapContractAddress);

    try {
        const tx = await swapContract.methods.removeLiquidity(
            tokenA,
            tokenB,
            lpAmount,
            0, // amountAMin
            0  // amountBMin
        ).send({
            from: accounts[0],
            gas: 500000
        });

        showSuccessModal('Liquidity removed successfully!', tx.transactionHash);
        await updateLiquidityList();
        removeLiquidityBtn.disabled = true;
    } catch (error) {
        console.error('Remove liquidity error:', error);
        alert(`Failed to remove liquidity! ${error.message}`);
    }
});

// Success Modal
const showSuccessModal = (message, txHash) => {
    const modal = document.getElementById('success-modal');
    const messageEl = document.getElementById('success-message');
    const txLink = document.getElementById('tx-link');
    const closeModal = document.getElementById('close-modal');

    messageEl.textContent = message;
    txLink.href = `https://sepolia.tea.xyz/tx/${txHash}`;
    txLink.textContent = 'View on Explorer';
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
};

// Overlay Click
overlay.addEventListener('click', () => {
    connectWalletModal.style.display = 'none';
    tokenSelectModal.style.display = 'none';
    assetModal.style.display = 'none';
    document.getElementById('success-modal').style.display = 'none';
    slippagePopup.style.display = 'none';
    overlay.style.display = 'none';
});

// Initial Update
updateChainStatus();
updateFromBalance();
updateLiquidityList();
