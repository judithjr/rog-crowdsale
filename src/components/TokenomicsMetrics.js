// TokenomicsImage.js
import React from 'react';
import tokenomicsImage from '../assets/tokenmics.png';

const TokenomicsImage = () => {
    return (
        <div className="mt-5" style={{ opacity: 0.7 /* Adjust the opacity as needed */ }}>
            <img src={tokenomicsImage} alt="Tokenomics" className="w-full h-auto" />
        </div>
    );
}

export default TokenomicsImage;
