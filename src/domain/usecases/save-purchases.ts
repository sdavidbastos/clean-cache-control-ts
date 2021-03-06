import { PurchaseModel } from "@/domain/models";

/**
 * Aqui só teremos interfaces e modelos.
 */

export interface SavePurchases {
  save: (purchases: Array<SavePurchases.Params>) => Promise<void>;
}
/**
 * Hack para utilizar o type dentro
 * da interface SavePurchases
 */
export namespace SavePurchases {
  export type Params = PurchaseModel;
}
