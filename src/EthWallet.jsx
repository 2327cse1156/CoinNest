import { mnemonicToSeed } from "bip39";
import  { useState,useEffect } from "react";
import { HDNodeWallet, Wallet } from "ethers";
import { ClipboardIcon } from "@heroicons/react/solid";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  // Clear Wallets whenever mnemonic changes
  useEffect(()=>{
    setAddresses([]);
    setCurrentIndex([0])
  },[mnemonic])
  // Function to copy address to clipboard
  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  // Function to clear all ETH wallets
  const clearAllWallets = () => {
    setAddresses([]);
    setCurrentIndex(0);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
        Ethereum Wallets
      </h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={async function () {
            if(!mnemonic)
            {
              alert("Please Generate a seed phrase first.")
              return;
            }
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0/0`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const wallet = new Wallet(child.privateKey);
            setCurrentIndex(currentIndex + 1);
            setAddresses([...addresses, wallet.address]);
          }}
          className="flex-1 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-lg focus:outline-none"
        >
          + Add ETH Wallet
        </button>

        <button 
          onClick={clearAllWallets}
          className="ml-4 py-3 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-lg focus:outline-none"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <p className="text-center text-gray-500">No wallets added yet.</p>
        ) : (
          addresses.map((address, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm flex items-center justify-between">
              <div className="text-sm font-mono text-gray-700 truncate">
                Eth - {address}
              </div>
              <button
                onClick={() => copyToClipboard(address)}
                className="ml-2 text-blue-500 hover:text-blue-700"
                title="Copy to clipboard"
              >
                <ClipboardIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
