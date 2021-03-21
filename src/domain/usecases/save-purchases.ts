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
  export type Params = {
    id: string;
    date: Date;
    value: number;
  };
}
