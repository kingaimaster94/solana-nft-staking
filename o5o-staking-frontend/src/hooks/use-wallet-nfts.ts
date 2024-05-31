/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import { getNftsForOwner, getNftsForOwner1 } from '../utils/candy-machine';
import useWalletBalance from './use-wallet-balance';
import { printLog } from '../utils/utility';

const useWalletNfts = () => {
	const [balance] = useWalletBalance();
	const wallet = useWallet();
	const [isLoadingWalletNfts, setIsLoadingWalletNfts] = useState(false);
	const [walletNfts, setWalletNfts] = useState<Array<any>>([]);

	useEffect(() => {
		getWalletNfts()
	}, [wallet, balance]);

	const getWalletNfts = async () => {
		try {
			if (
				!wallet ||
				!wallet.publicKey ||
				!wallet.signAllTransactions ||
				!wallet.signTransaction
			) {
				return;
			}
			printLog('loading nfts from wallet')
			setIsLoadingWalletNfts(true);
			const nftsForOwner = await getNftsForOwner1(wallet.publicKey);
			// const nftsForOwner = await getNftsForOwner(connection, wallet.publicKey);
			console.log('loaded nfts from wallet', nftsForOwner)
			setWalletNfts(nftsForOwner as any);
			setIsLoadingWalletNfts(false);
		}
		catch (err) {
			console.log(err);
		}
	}

	return { isLoadingWalletNfts, walletNfts, setWalletNfts, getWalletNfts };
}

export default useWalletNfts;