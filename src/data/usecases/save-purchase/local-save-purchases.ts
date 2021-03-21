import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain";

/**
 * Implementação de uso utilizando cache
 */

export class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete("purchases");
    this.cacheStore.insert("purchases", purchases);
  }
}
