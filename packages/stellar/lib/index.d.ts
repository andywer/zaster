import { Big as BigNumber } from 'big.js';
import { Asset, Wallet, InitWalletOptions } from '@wallet/platform-api';
export declare type PublicWalletData = {
    publicKey: string;
};
export declare type PrivateWalletData = {
    privateKey: string;
};
export declare type StellarWallet = Wallet<PrivateWalletData, PublicWalletData>;
export declare function getAssets(): Asset[];
export declare function createPrivateKey(): Promise<any>;
export declare function prepareNewWallet(wallet: StellarWallet, privateKey: string, options?: InitWalletOptions): Promise<void>;
export declare type AddressBalanceOptions = {
    testnet?: boolean;
};
export declare function getAddressBalance(address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
export declare function getWalletBalance(wallet: StellarWallet): Promise<BigNumber>;
export declare function getWalletAddress(wallet: StellarWallet): Promise<string>;
