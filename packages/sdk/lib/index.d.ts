import { Big as BigNumber } from 'big.js';
import { Asset, Platform, Wallet, AddressBalanceOptions } from '@wallet/platform-api';
export declare type KeyStore = {
    getWalletIDs(): string[];
    readWallet(walletID: string, password: string): Promise<any>;
    saveWallet(walletID: string, password: string, data: any): Promise<void>;
    readWalletPublicData(walletID: string): Promise<any>;
    saveWalletPublicData(walletID: string, data: any): Promise<void>;
    removeWallet(walletID: string): Promise<void>;
};
export declare type SDK = {
    ledger: LedgerAPI;
    wallets: WalletsAPI;
    readonly assets: Asset[];
    getAsset(assetID: string): Asset | null;
};
export declare type LedgerAPI = {
    getAddressBalance(asset: Asset, address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
    getWalletBalance(walletID: string): Promise<BigNumber>;
};
export declare type WalletsAPI = {
    addWallet(id: string, asset: Asset, privateKey: string, options?: object): Promise<Wallet>;
    createWallet(id: string, asset: Asset, options?: object): Promise<Wallet>;
    getWalletIDs(): string[];
    removeWallet(id: string): Promise<void>;
};
export declare type RequestPassword = (wallet: Wallet) => Promise<string>;
export declare type LoadSDKOptions = {
    requestPassword?: RequestPassword;
};
export declare function loadSDK(keyStore: KeyStore, platforms: Platform[], {requestPassword}?: LoadSDKOptions): SDK;
