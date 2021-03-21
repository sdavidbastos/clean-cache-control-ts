import { LocalLoadPurchases } from "@/data/usecases/load-purchase/local-load-purchases";
import { CacheStoreSpy, mockPurchases } from "@/data/tests";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

// Design Pattern factory
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);
  return {
    sut,
    cacheStore,
  };
};

describe("LocalLoadPurchases", () => {
  test("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test("Should return empty list if load fails", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateFetchtError();
    const purchases = await sut.loadAll();
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });

  test("Should return a list of purchases if cache is less than 3 days old", async () => {
    const timestamp = new Date();
    const { cacheStore, sut } = makeSut(timestamp);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchase = await sut.loadAll();
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(purchase).toEqual(cacheStore.fetchResult.value);
  });
});
