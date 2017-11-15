import { Big as BigNumber } from 'big.js';
export declare type Platform = {
    getAssets(): Asset[];
    createPrivateKey(): Promise<string>;
    getAddressBalance(address: string, options?: AddressBalanceOptions): Promise<BigNumber>;
    getWalletBalance(wallet: Wallet): Promise<BigNumber>;
    getWalletAddress(wallet: Wallet): Promise<string>;
    prepareNewWallet(wallet: Wallet, privateKey: string, options?: InitWalletOptions): Promise<void>;
    createTransaction(wallet: Wallet, operations: Operation[], options?: object): Promise<Transaction>;
    sendTransaction(transaction: Transaction, options: InitWalletOptions): Promise<Transaction>;
};
export declare type AddressBalanceOptions = {
    testnet?: boolean;
};
export declare type InitWalletOptions = {
    testnet?: boolean;
};
export declare type Asset = {
    id: string;
    aliases: string[];
    name: string;
};
export declare type Wallet<WalletPrivateData = any, WalletPublicData = any> = {
    readonly asset: Asset;
    readPrivate(): Promise<WalletPrivateData>;
    savePrivate(data: WalletPrivateData): Promise<void>;
    readPublic(): Promise<WalletPublicData>;
    savePublic(data: WalletPublicData): Promise<void>;
    getOptions(): Promise<InitWalletOptions>;
};
export declare type Transaction = object | string;
export declare type Operation = PaymentOperation | {
    type: OperationType;
};
export declare type PaymentOperation = {
    type: OperationType.Payment;
    amount: BigNumber;
    destination: string;
};
export declare enum OperationType {
    Payment = "PAYMENT",
}
