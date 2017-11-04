import { Big as BigNumber } from 'big.js';
import { Asset, KeyStore, Platform, Wallet, AddressBalanceOptions } from '@wallet/platform-api';
export declare type RequestPassword = (wallet: Wallet) => Promise<string>;
export declare type LoadSDKOptions = {
    requestPassword?: RequestPassword;
};
export declare function loadSDK(keyStore: KeyStore, platforms: Platform[], {requestPassword}?: LoadSDKOptions): {
    readonly assets: Asset[];
    getWalletIDs(): string[];
    getAddressBalance(asset: string, address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
    getWalletBalance(walletID: string): Promise<BigNumber>;
};
