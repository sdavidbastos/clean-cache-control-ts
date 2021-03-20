/**
 * Implementação de uso utilizando cache
 */

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete("purchase");
  }
}

interface CacheStore {
  delete: (key: string) => void;
}

/**
 * Versão Mocada da interface CacheStore
 * para fins de teste
 */
class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  key: string;

  delete(key: string): void {
    this.deleteCallsCount++;
    this.key = key;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

// Design Pattern factory
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);
  return {
    sut,
    cacheStore,
  };
};

describe("LocalSavePurchases", () => {
  test("Should not delete cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test("Should delete old cache on sut.save", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
  });

  test("Should call delete with corret key", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save();
    expect(cacheStore.key).toBe("purchase");
  });
});
