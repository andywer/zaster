import { KeyStore, Implementation, Asset } from '@wallet/implementation-api';
export declare function loadSDK(keyStore: KeyStore, implementations: Implementation[], {requestPassword}?: {
    requestPassword?: () => never;
}): {
    readonly assets: Asset[];
};
