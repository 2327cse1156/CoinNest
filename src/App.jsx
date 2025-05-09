import React, { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [activeTab, setActiveTab] = useState("eth");

  // Function to export the seed phrase as a text file
  const downloadMnemonic = () => {
    const element = document.createElement("a");
    const file = new Blob([mnemonic], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "seed-phrase.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-96 max-w-lg">
        <h1 className="text-3xl font-semibold text-center mb-4 text-gray-700">
          Crypto Wallet Generator
        </h1>

        <textarea 
          value={mnemonic} 
          onChange={(e) => setMnemonic(e.target.value)} 
          readOnly
          rows={3}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
          placeholder="Seed phrase will appear here"
        />

        <div className="flex gap-3 mb-4">
          <button 
            onClick={async () => {
              const mn = generateMnemonic();
              setMnemonic(mn);
            }} 
            className="flex-1 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg focus:outline-none"
          >
            Create Seed Phrase
          </button>

          {mnemonic && (
            <>
              <button 
                onClick={() => navigator.clipboard.writeText(mnemonic)}
                className="py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 shadow-lg focus:outline-none"
              >
                Copy
              </button>

              <button 
                onClick={downloadMnemonic}
                className="py-3 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 shadow-lg focus:outline-none"
              >
                Download
              </button>
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            className={`py-2 px-4 rounded ${activeTab === "eth" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("eth")}
          >
            Ethereum
          </button>
          <button
            className={`py-2 px-4 rounded ${activeTab === "sol" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveTab("sol")}
          >
            Solana
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "eth" ? (
            <EthWallet mnemonic={mnemonic} />
          ) : (
            <SolanaWallet mnemonic={mnemonic} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
