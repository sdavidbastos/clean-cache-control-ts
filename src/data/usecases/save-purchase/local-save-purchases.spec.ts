import { LocalSavePurchases } from "@/data/usecases/save-purchase/local-save-purchases";
import { CacheStore } from "@/data/protocols/cache/cache-store";
import { SavePurchases } from "@/domain";

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.deleteCallsCount++;
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++;
    this.insertKey = key;
    this.insertValues = value;
  }

  /**
   * jest.spyOn().mockImplementationOnce()
   * Espiona o metodo delete e caso esse metodo seja utilizado
   * vai alterar a implementação dele para uma promise reject
   */

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      throw new Error();
    });
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      throw new Error();
    });
  }
}

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: "1",
    date: new Date(),
    value: 50,
  },
  {
    id: "2",
    date: new Date(),
    value: 70,
  },
];

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
    await sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  test("Should not insert new Cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());

    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  test("Should insert new Cache if delete succeeds", async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe("purchases");
    // toEqual: Comparar arrays, objetos ou array de objetos
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  test("Should throws if insert throws", () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());
    expect(promise).rejects.toThrow();
  });
});
