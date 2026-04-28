"use client";
import { Recipient, sendLovelace } from "@/utils/transactions";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import { useState, useEffect, ChangeEvent } from "react";

const Wallet = () => {
  const [availableWallets, setAvailableWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>("Disconnected");
  const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
  const [recipient, setRecipient] = useState<Recipient>();

  const connectWallet = async () => {
    try {
      if (selectedWallet === "Disconnected") return;
      const wallet = await MeshCardanoBrowserWallet.enable(selectedWallet);
      setWallet(wallet);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const handleSelectedWalletChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedWallet(e.target.value);
  };

  const handleRecipientChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipient((prev => ({ ...prev, [name]: value } as Recipient)));
  };

  useEffect(() => {
    const getAvailableWallets = async () => {
      const wallets = await MeshCardanoBrowserWallet.getInstalledWallets();
      const walletNames = wallets.map((wallet) => wallet.name);
      setAvailableWallets(walletNames);
    };
    getAvailableWallets();
  }, []);

  return (
    <div>
      <h1>Wallet Component</h1>
      <select value={selectedWallet} onChange={handleSelectedWalletChange}>
        <option value="Disconnected">Select a wallet</option>
        {availableWallets.map((w, i) => (
          <option key={i} value={w}>
            {w}
          </option>
        ))}
      </select>
      <button onClick={connectWallet}>Connect Wallet</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!wallet) {
            console.error("No wallet connected");
            return;
          }
          console.log("Sending Lovelace to:", recipient);
          sendLovelace(wallet, recipient!);
        }}
      >
        <label htmlFor="recipient">Recipient Address:</label>
        <input
          type="text"
          id="recipient"
          name="address"
          value={recipient?.address}
          onChange={handleRecipientChange}
        />
        <label htmlFor="amount">Amount (Lovelace):</label>
        <input
          type="text"
          id="amount"
          name="amount"
          value={recipient?.amount}
          onChange={handleRecipientChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Wallet;
