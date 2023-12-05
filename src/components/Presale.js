import { ethers } from 'ethers';
import { useContext, useRef, useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { GlobalContext } from '../context/GlobalContext';
import './Presale.css';

import CROWDSALE_ABI from './../abi/abi.json';
const crowdsaleAddress = "0xC197c6CCc8dC869b3fA1043B9c390718c0e40C3B";

function Presale() {
    const { account } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const ethPrice = useRef(null);

    const addToken = async () => {
        const tokenAddress = '0x0eE4024E8d5ae9afFCe26f692028407dD2050B7D';
        const tokenSymbol = 'PATTIE';
        const tokenDecimals = 18;
        const tokenImage = 'https://raw.githubusercontent.com/Pattieswap/assets/main/logo.png';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }
    const tokenAddress = '0x0eE4024E8d5ae9afFCe26f692028407dD2050B7D';
    const [isCopied, setIsCopied] = useState(false);

    const copyAddressToClipboard = () => {
        navigator.clipboard.writeText(tokenAddress);
        setIsCopied(true);

        // Reset the copied state after a short delay (e.g., 3 seconds)
        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };


    const presaleAddress = '0xC197c6CCc8dC869b3fA1043B9c390718c0e40C3B'; // Add the Presale address here
    const [isPresaleCopied, setIsPresaleCopied] = useState(false);

    const copyPresaleAddressToClipboard = () => {
        navigator.clipboard.writeText(presaleAddress);
        setIsPresaleCopied(true);

        // Reset the copied state after a short delay (e.g., 3 seconds)
        setTimeout(() => {
            setIsPresaleCopied(false);
        }, 3000);
    };

    const buyToken = async (e) => {
        try {
            e.preventDefault();
            if (!window.ethereum) {
                alert('Please install MetaMask');
                return
            }
            if (!account) {
                alert('Please connnect wallet');
                return;
            }
            setLoading(true);
            const web3modal = new Web3Modal();
            const instance = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(crowdsaleAddress, CROWDSALE_ABI, signer);
            const price = ethers.utils.parseEther(ethPrice.current.value);
            const balance = ethers.utils.formatEther(await provider.getBalance(signer.getAddress()));

            if (balance < ethPrice.current.value) {
                setLoading(false);
                alert('Insufficient Balance');
                return;
            }

            const transaction = await contract.buyTokens(account, { value: price.toString() });
            await transaction.wait();

            setLoading(false);
            alert('purchase done');
        } catch (e) {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Calculate the time remaining until the next stage
        const nextStageTime = new Date("2023-01-01T00:00:00Z"); // Replace with the actual date and time
        const now = new Date();
        const timeDifference = nextStageTime - now;

        if (timeDifference > 0) {
            const interval = setInterval(() => {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds });

                if (timeDifference <= 0) {
                    clearInterval(interval);
                } else {
                    timeDifference -= 1000;
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);


    useEffect(() => {
        // Calculate the time remaining until the next stage (starting from 5 hours, 11 minutes, and 54 seconds)
        let nextStageTime = new Date();
        nextStageTime.setHours(nextStageTime.getHours() + 5);
        nextStageTime.setMinutes(nextStageTime.getMinutes() + 11);
        nextStageTime.setSeconds(nextStageTime.getSeconds() + 54);

        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = nextStageTime - now;

            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds });

                if (timeDifference <= 0) {
                    // Move to the next stage (add 7 days)
                    nextStageTime = new Date(nextStageTime.getTime() + 7 * 24 * 60 * 60 * 1000);
                    
                    // Update the "Current" and "Next Stage" information
                    // You should replace these placeholder values with actual data
                    setCurrentRateData({
                        currentRate: '+17.82%',
                        currentPrice: '0.003395 USDT',
                        nextPrice: '0.004000 USDT',
                    });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const [currentRateData, setCurrentRateData] = useState({
        currentRate: '+17.82%',
        currentPrice: '0.003395 USDT',
        nextPrice: '0.004000 USDT',
    });

    const [progress, setProgress] = useState(12.92); // Initial progress percentage

    const progressBarStyle = {
        width: '100%', // Set the initial width to 100%
        height: '30px', // Increased height to accommodate the text
        backgroundColor: '#ddd',
        borderRadius: '15px',
        marginTop: '10px',
        position: 'relative',
    };

    const progressStyle = {
        height: '100%',
        width: `${progress}%`, // Dynamically set the progress percentage
        backgroundColor: '#4CAF50',
        borderRadius: '15px',
        position: 'absolute',
        transition: 'width 0.5s', // Add transition for a smooth effect
    };

    const labelStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'red',
        fontWeight: 'bold',
    };

    // Function to update the progress based on real-time data
    const getRandomIncrement = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    // Function to update the progress based on real-time data
    const updateProgress = () => {
        // Increment progress within the range 0.01% to 0.05%
        setProgress(prevProgress => Math.min(prevProgress + getRandomIncrement(0.01, 0.05), 100));
    };

    // Simulate real-time updates with setInterval
    useEffect(() => {
        const interval = setInterval(() => {
            updateProgress();
        }, 5000); // Update progress every 5 seconds (adjust as needed)

        return () => clearInterval(interval);
    }, []);


    // Simulate real-time updates with setInterval
    useEffect(() => {
        const interval = setInterval(() => {
            updateProgress();
        }, 5000); // Update progress every 5 seconds (adjust as needed)

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="my-11 p-7 flex items-center flex-col md:flex-row justify-between border border-white border-opacity-20 rounded-3xl shadow-xl ">
            <div className="md:pl-8 text-center md:text-left md:mr-2">
                <h1 className="text-base sm:text-xl font-bold uppercase" >Initial Coin Offering</h1>
                <h1 className="text-2xl sm:text-4xl font-bold uppercase text-yellow-500" >PATTIE Token</h1>
                <div className="flex items-center mt-2">
                    <div className="bg-gray-800 p-2 rounded">
                        <bold className=" text-white ">Token Address:</bold> 
                        <a
                            href={`https://bscscan.com/address/${tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500"
                        >
                            <code>{tokenAddress}</code>
                        </a>
                    </div>
                    <button
                        className={`px-4 py-2 uppercase bg-yellow-500 text-white rounded font-semibold ${
                            isCopied ? 'bg-green-500' : 'hover:bg-yellow-300'
                        }`}
                        onClick={copyAddressToClipboard}
                    >
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="flex items-center mt-2">
                    <div className="bg-gray-800 p-2 rounded">
                        <bold className="text-white">Presale Address:</bold> 
                        <a
                            href={`https://bscscan.com/address/${presaleAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500"
                        >
                            <code>{presaleAddress}</code>
                        </a>
                    </div>
                    <button
                        className={`px-4 py-2 uppercase bg-yellow-500 text-white rounded font-semibold ${
                            isPresaleCopied ? 'bg-green-500' : 'hover:bg-yellow-300'
                        }`}
                        onClick={copyPresaleAddressToClipboard}
                    >
                        {isPresaleCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <button className='mt-5 px-6 py-2 bg-yellow-500 text-white rounded font-semibold' onClick={() => addToken()}>Add PATTIE to your MetaMask</button>
                {/* <div className='mt-3 hidden md:block'>
                <p className="text-lg">For Progress, Investment & Success</p>
            </div> */}
                <div className='mt-10 text-left'>
                    <h3 className=' uppercase text-sm font-semibold mb-2 text-yellow-500'>Instructions:</h3>
                    <ul className='text-sm list-outside list-disc'>
                        <li className='ml-4'>Minimum purchase allowed: 0.01 BNB</li>
                        <li className='ml-4'>Maxmimum purchase allowed: 200 BNB</li>
                    </ul>
                </div>
            </div>
            <div className="my-10 border p-10 rounded-xl border-white border-opacity-30  ">

            <div className="mt-3">
    <h3 className="uppercase text-base font-semibold mb-2 text-yellow-500">Countdown Until Next Stage:</h3>
    <p className="text-base countdown-timer">
        {`${countdown.days}d : ${countdown.hours}h : ${countdown.minutes}m : ${countdown.seconds}s`}
    </p>
</div>


                <div className="mt-10">
                   
                    <div className="flex items-center">
                        <div className="mr-4">
                            <p className="text-base font-semibold">Current</p>
                             {/**  <p className="text-xl text-green-500">+17.82%</p>*/}
                            <p className="text-base">1 BNB = 320,741 PATTIE</p>
                            <p className="text-xl text-green-500">+10% Bonus</p>
                        </div>
                        <div>
                            <p className="text-base font-semibold">Next Stage</p>
                            <p className="text-base">1 BNB = 300,741 PATTIE</p>
                            <p className="text-xl text-green-500">+9% Bonus</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={buyToken}>
                    <div className="my-3">
                        <label className="text-base font-bold text-yellow-500">Amount BNB</label>
                        <input ref={ethPrice} type="text" className="w-full h-12 rounded-lg p-2 text-xl focus:outline-none mt-1 bg-white bg-opacity-30" required />
                    </div>
                    

                 
                    <div className="mt-10">
                        <button disabled={loading} className="w-full py-2 px-6 uppercase bg-yellow-500 hover:bg-yellow-300 rounded  font-semibold">
                            {loading ? 'Buying in progress...' : 'Buy Now'}
                        </button>
                        <div style={progressBarStyle}>
                            <div style={progressStyle}></div>
                            <div style={labelStyle}>{`${progress.toFixed(2)}% SOLD`}</div>
                        </div>
                    </div>
                </form>
                
            </div>
           
        </div>
        
    );
}

export default Presale;
