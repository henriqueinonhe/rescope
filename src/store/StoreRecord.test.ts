import { createRecord } from "./Record";
import { createStoreRecords, RecordKey } from "./StoreRecords";

describe("When getting record", () => {
  const setup = () => {
    const storeRecords = createStoreRecords();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    storeRecords.set(
      existingRecordKey,
      createRecord({
        initialValue: "Yada",
      })
    );

    return { storeRecords, existingRecordKey, newRecordKey };
  };

  describe("And record doesn't exist", () => {
    const secondSetup = () => {
      const { storeRecords, newRecordKey } = setup();

      storeRecords.get(newRecordKey);
    };

    it("Throws an error", () => {
      expect(() => secondSetup()).toThrow();
    });
  });

  describe("And record exists", () => {
    const secondSetup = () => {
      const { storeRecords, existingRecordKey } = setup();

      return { record: storeRecords.get(existingRecordKey) };
    };

    it("Returns record", () => {
      const { record } = secondSetup();

      expect(record.value).toBe("Yada");
    });
  });
});

describe("When setting record", () => {
  const setup = () => {
    const storeRecords = createStoreRecords();

    const key: RecordKey = {};

    storeRecords.set(
      key,
      createRecord({
        initialValue: "Yada",
      })
    );

    return {
      storeRecords,
      key,
    };
  };

  it("Sets record correctly", () => {
    const { storeRecords, key } = setup();

    expect(storeRecords.get(key).value).toBe("Yada");
  });
});

describe("When checking whether record exists", () => {
  const setup = () => {
    const storeRecords = createStoreRecords();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    storeRecords.set(
      existingRecordKey,
      createRecord({
        initialValue: "Yada",
      })
    );

    return { storeRecords, existingRecordKey, newRecordKey };
  };

  describe("And record doesn't exist", () => {
    const secondSetup = setup;

    it("Returns false", () => {
      const { newRecordKey, storeRecords } = secondSetup();

      expect(storeRecords.has(newRecordKey)).toBe(false);
    });
  });

  describe("And record exists", () => {
    const secondSetup = setup;

    it("Returns true", () => {
      const { existingRecordKey, storeRecords } = secondSetup();

      expect(storeRecords.has(existingRecordKey)).toBe(true);
    });
  });
});
