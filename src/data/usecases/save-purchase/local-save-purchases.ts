import { CacheStore } from "@/data/protocols/cache";

/**
 * Implementação de uso utilizando cache
 */

export class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete("purchases");
    this.cacheStore.insert("purchases");
  }
}
