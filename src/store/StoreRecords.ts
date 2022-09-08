import { libBug } from "../errors/libBug";
import { makeWithBrand } from "../utils/withBrand";
import { Record } from "./Record";

const { factoryWrapper } = makeWithBrand();

export type RecordKey = {};

export const createStoreRecords = factoryWrapper(() => {
  const records = new WeakMap<RecordKey, Record>();

  const checkExistingRecord = (key: RecordKey) => {
    if (!records.has(key)) {
      libBug(`There is no record associated with this key (${key})!`);
    }
  };

  const get = (key: RecordKey) => {
    checkExistingRecord(key);

    return records.get(key)!;
  };

  const set = (key: RecordKey, record: Record) => {
    return records.set(key, record);
  };

  const has = (key: RecordKey) => records.has(key);

  return {
    get,
    set,
    has,
  };
});

/**
 * Represents the aggregated records managed by a store.
 */
export type StoreRecords = ReturnType<typeof createStoreRecords>;
