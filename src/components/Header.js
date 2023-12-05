import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import logo from './../assets/logo.png';


const HeaderComponent = () => {

    const { account, addAccount, delAccount } = useContext(GlobalContext);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask');
            return
        }
        const web3modal = new Web3Modal();
        const instance = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        addAccount({ id: address });
        
    }
    useEffect(() => {
        const enforceNetwork = async () => {
            if (window.ethereum) {
                try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
                    if (chainId !== '0x38') { // '0x61' is the chain ID for Binance Smart Chain Mainnet (97)
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x38' }], // Switch to Binance Smart Chain Mainnet (97)
                        });
                    }
                } catch (error) {
                    console.error('Error checking or switching network:', error.message);
                    // Handle the error, e.g., inform the user to manually switch networks
                }
            }
        };
    
        enforceNetwork();
    
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                if (accounts.length === 0) {
                    // User disconnected, reset enforcement when they reconnect
                    enforceNetwork();
                } else {
                    addAccount({ id: accounts[0] });
                }
            });
    
            window.ethereum.on('chainChanged', async chainId => {
                if (chainId !== '0x38') { // '0x61' is the chain ID for Binance Smart Chain Mainnet (97)
                    enforceNetwork();
                } else {
                    window.location.reload();
                }
            });
        }
    }, []);
    
    return (
        <div className="w-full flex items-center justify-between  flex-col sm:flex-row">
        <div className="max-w-[100px] p-2 flex items-center">
                <img src={logo} alt="logo" />
                <span className="ml-2 text-lg font-bold text-yellow-1600 whitespace-nowrap">PattieSwap Presale</span>
            </div>
            <div className="mt-4 sm:mt-0">
                {account ? (
                    <div className="flex items-center flex-col">
                        <a
                            href={`https://bscscan.com/address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-300 rounded">
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                        </a>
                        <button className="text-xs text-right hover:text-yellow-500" onClick={() => delAccount()}>Disconnect</button>
                    </div>
                ) : (
                    <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-300 rounded" onClick={() => connectWallet()}>Connect Wallet</button>
                )}
            </div>

        </div>
    );
};

export default HeaderComponent;
