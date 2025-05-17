import { mnemonicToSeed } from "bip39";
import  { useState } from "react";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { ClipboardIcon } from "@heroicons/react/solid";
import { useEffect } from "react";

export const SolanaWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  // Clear wallets whenever mnemonic changes
  useEffect(()=>{
    setPublicKeys([])
    setCurrentIndex(0)
  },[mnemonic])

  // Function to copy address to clipboard
  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  // Function to clear all Solana wallets
  const clearAllWallets = () => {
    setPublicKeys([]);
    setCurrentIndex(0);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
        Solana Wallets
      </h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={async function () {
            if(!mnemonic) {
              alert("Please generate a seed phrase first.");
              return;
            }
            const seed = await mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
          }}
          className="flex-1 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 shadow-lg focus:outline-none"
        >
          + Add SOL Wallet
        </button>

        <button 
          onClick={clearAllWallets}
          className="ml-4 py-3 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-lg focus:outline-none"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {publicKeys.length === 0 ? (
          <p className="text-center text-gray-500">No wallets added yet.</p>
        ) : (
          publicKeys.map((p, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm flex items-center justify-between">
              <div className="text-sm font-mono text-gray-700 truncate">
                Sol - {p}
              </div>
              <button
                onClick={() => copyToClipboard(p)}
                className="ml-2 text-green-500 hover:text-green-700"
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
