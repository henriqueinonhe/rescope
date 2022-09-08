import { makeWithBrand } from "../utils/withBrand";
import { createStoreRecords, RecordKey } from "./StoreRecords";
import { Subscriber } from "./Subscriber";
import { createRecord as createInternalRecord } from "./Record";
import { libBug } from "../errors/libBug";

const { factoryWrapper } = makeWithBrand();

export const createStore = factoryWrapper(() => {
  const records = createStoreRecords();

  const createRecord = (key: RecordKey, initialValue: unknown) => {
    if (records.has(key)) {
      libBug(
        `There already exists a record associated with this key (${key}) !`
      );
    }

    records.set(
      key,
      createInternalRecord({
        initialValue,
      })
    );
  };

  const hasRecord = (key: RecordKey) => {
    return records.has(key);
  };

  const subscribe = (key: RecordKey, subscriber: Subscriber) => {
    const record = records.get(key);
    record.subscribers.add(subscriber);
  };

  const unsubscribe = (key: RecordKey, subscriber: Subscriber) => {
    const record = records.get(key);
    record.subscribers.delete(subscriber);
  };

  const notifySubscribers = (key: RecordKey) => {
    records.get(key).subscribers.forEach((subscriber) => subscriber());
  };

  const read = (key: RecordKey) => {
    return records.get(key).value;
  };

  const write = (key: RecordKey, value: unknown) => {
    const selectedRecord = records.get(key);
    selectedRecord.value = value;

    notifySubscribers(key);
  };

  return {
    createRecord,
    hasRecord,
    subscribe,
    unsubscribe,
    read,
    write,
  };
});

export type Store = ReturnType<typeof createStore>;
