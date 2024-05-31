import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletBalanceProvider } from "./hooks/use-wallet-balance";
import { NEXT_PUBLIC_SOLANA_NETWORK } from "./constant/env";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import "./components/assets/impact.ttf"
import Stake from "./pages/Stake";
import Mint from "./pages/Mint";
import Account from "./pages/Account";
import LeaderBoard from './pages/LeaderBoard';
import Index from './pages/Index';
import Bridge from './pages/Bridge';
import Admin from "./pages/Admin";
import Footer from "./components/views/Footer";

let WALLETS: any = {
  getPhantomWallet: () => ({ name: "Phantom" }),
  getSolflareWallet: () => ({ name: "Solflare" }),
  getSolletWallet: () => ({ name: "Sollet" }),
  getLedgerWallet: () => ({ name: "Ledger" }),
  getSlopeWallet: () => ({ name: "Slope" }),
  getSolletExtensionWallet: () => ({ name: "SolletExtension" }),
};

if (typeof window !== "undefined") {
  WALLETS = require("@solana/wallet-adapter-wallets");
}
const network = NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork;

const App: React.FC = () => {
  // const endpoint = useMemo(() => NEXT_PUBLIC_SOLANA_NETWORK == "devnet" ? "https://metaplex.devnet.rpcpool.com" : "https://metaplex.mainnet.rpcpool.com", []);
  const endpoint = useMemo(() => NEXT_PUBLIC_SOLANA_NETWORK == "devnet" ? "https://api.devnet.solana.com" : "https://metaplex.mainnet.rpcpool.com", []);
  const wallets = useMemo(
    () => [
      WALLETS.getPhantomWallet(),
      WALLETS.getSolflareWallet(),
      WALLETS.getSolletWallet({ network }),
      WALLETS.getLedgerWallet(),
      WALLETS.getSlopeWallet(),
      WALLETS.getSolletExtensionWallet({ network }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletBalanceProvider>
            <div className="h-screen">
              {/* <Navbar /> */}
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/stake" element={<Stake />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
                <Route path="/account" element={<Account />} />
                <Route path="/bridge" element={<Bridge />} />
                <Route path="/" element={<Index />} />
              </Routes>
              <Footer />
              <Toaster />
            </div>
          </WalletBalanceProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
