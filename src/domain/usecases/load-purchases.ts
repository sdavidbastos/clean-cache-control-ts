import { PurchaseModel } from "@/domain/models";

/**
 * Aqui só teremos interfaces e modelos.
 */

export interface LoadPurchases {
  loadAll: () => Promise<Array<LoadPurchases.Result>>;
}
/**
 * Hack para utilizar o type dentro
 * da interface SavePurchases
 */
export namespace LoadPurchases {
  export type Result = PurchaseModel;
}
