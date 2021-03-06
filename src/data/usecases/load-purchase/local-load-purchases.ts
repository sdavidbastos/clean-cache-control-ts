import { CacheStore } from "@/data/protocols/cache";
import { LoadPurchases, SavePurchases } from "@/domain/usecases";

/**
 * Implementação de uso utilizando cache
 */

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = "purchases";
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases,
    });
  }

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);
      return cache.value;
    } catch (error) {
      this.cacheStore.delete(this.key);
      return [];
    }
  }
}
