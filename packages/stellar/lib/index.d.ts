import { Big as BigNumber } from 'big.js';
import { Asset, Wallet, InitWalletOptions } from '@wallet/platform-api';
export declare type PublicWalletData = {
    publicKey: string;
    testnet: boolean;
};
export declare type PrivateWalletData = {
    privateKey: string;
};
export declare type StellarWallet = Wallet<PrivateWalletData, PublicWalletData>;
export declare function getAssets(): Asset[];
export declare function createPrivateKey(): Promise<any>;
export declare function initWallet(wallet: StellarWallet, privateKey: string, options?: InitWalletOptions): Promise<void>;
export declare type AddressBalanceOptions = {
    testnet?: boolean;
};
export declare function getAddressBalance(address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
export declare function getWalletBalance(wallet: StellarWallet): Promise<BigNumber>;
