import { LocalSavePurchases } from "@/data/usecases/save-purchase/local-save-purchases";
import { CacheStore } from "@/data/protocols/cache/cache-store";

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
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
    expect(cacheStore.key).toBe("purchase");
  });

  test("Should not insert new Cache if delete fails", async () => {
    const { sut, cacheStore } = makeSut();
    /**
     * jest.spyOn()
     * Vai espionar a instância e methodo delete
     * mockImplementationOnce()
     * Altera a implementação do methodo
     * fazendo-o retornar uma função que vai retornar 
     * um throw new Error.

     */
    jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.save();
    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });
});
