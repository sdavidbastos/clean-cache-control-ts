import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/usecases";

/**
 * Implementação de uso utilizando cache
 */

export class LocalLoadPurchases {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace("purchases", {
      timestamp: this.timestamp,
      value: purchases,
    });
  }
}
