import { Big as BigNumber } from 'big.js';
import { Asset, Implementation, KeyStore, Wallet, AddressBalanceOptions } from '@wallet/implementation-api';
export declare type RequestPassword = (wallet: Wallet) => Promise<string>;
export declare type LoadSDKOptions = {
    requestPassword?: RequestPassword;
};
export declare function loadSDK(keyStore: KeyStore, implementations: Implementation[], {requestPassword}?: LoadSDKOptions): {
    readonly assets: Asset[];
    getWalletIDs(): string[];
    getAddressBalance(asset: string, address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
    getWalletBalance(walletID: string): Promise<BigNumber>;
};
