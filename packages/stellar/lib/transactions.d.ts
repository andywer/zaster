import { Operation, Transaction, Wallet } from '@wallet/platform-api';
export declare function createTransaction(wallet: Wallet, operations: Operation[], options?: {}): Promise<Transaction>;
export declare function sendTransaction(transaction: Transaction, options?: {
    testnet?: boolean;
}): Promise<Transaction>;
