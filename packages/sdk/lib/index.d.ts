import { Big as BigNumber } from 'big.js';
import { Asset, Operation, Platform, Transaction, Wallet, AddressBalanceOptions, InitWalletOptions } from '@wallet/platform-api';
export { OperationType } from '@wallet/platform-api';
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
export declare type SDKTransaction = {
    asset: Asset;
    body: Transaction;
    walletOptions: InitWalletOptions;
};
export declare type LedgerAPI = {
    getAddressBalance(asset: Asset, address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
    getWalletBalance(walletID: string): Promise<BigNumber>;
    getWalletAddress(walletID: string): Promise<string>;
    createTransaction(walletID: string, operations: Operation[], options?: object): Promise<SDKTransaction>;
    sendTransaction(transaction: SDKTransaction): Promise<SDKTransaction>;
};
export declare type WalletsAPI = {
    addWallet(id: string, asset: Asset, privateKey: string, password: string, options?: object): Promise<Wallet>;
    createWallet(id: string, asset: Asset, password: string, options?: object): Promise<Wallet>;
    getWallet(id: string): Promise<Wallet>;
    getWalletIDs(): string[];
    removeWallet(id: string): Promise<void>;
};
export declare type RequestPassword = (wallet: Wallet) => Promise<string>;
export declare type LoadSDKOptions = {
    requestPassword?: RequestPassword;
};
export declare function loadSDK(keyStore: KeyStore, platforms: Platform[], {requestPassword}?: LoadSDKOptions): SDK;
