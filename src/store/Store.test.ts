import { createStore } from "./Store";
import { RecordKey } from "./StoreRecords";

describe("When creating a record", () => {
  const setup = () => {
    const store = createStore();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    store.createRecord(existingRecordKey, "Duba");

    return { store, existingRecordKey, newRecordKey };
  };

  describe("And there is already a record associated with the given key", () => {
    const secondSetup = () => {
      const { existingRecordKey, store } = setup();

      store.createRecord(existingRecordKey, "Dobs");
    };

    it("Throws an error", () => {
      expect(() => secondSetup()).toThrow();
    });
  });

  describe("And there is NOT a record associated with the given key", () => {
    const secondSetup = () => {
      const { newRecordKey, store } = setup();

      store.createRecord(newRecordKey, "Dobs");

      return {
        store,
        newRecordKey,
      };
    };

    it("Creates record successfully", () => {
      const { newRecordKey, store } = secondSetup();

      expect(store.hasRecord(newRecordKey)).toBe(true);
      expect(store.read(newRecordKey)).toBe("Dobs");
    });
  });
});

describe("When checking whether a record exists", () => {
  const setup = () => {
    const store = createStore();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    store.createRecord(existingRecordKey, "Duba");

    return { store, existingRecordKey, newRecordKey };
  };

  describe("And it exists", () => {
    const secondSetup = setup;

    it("Returns true", () => {
      const { existingRecordKey, store } = secondSetup();

      expect(store.hasRecord(existingRecordKey)).toBe(true);
    });
  });

  describe("And it doesn't exist", () => {
    const secondSetup = setup;

    it("Returns false", () => {
      const { newRecordKey, store } = secondSetup();

      expect(store.hasRecord(newRecordKey)).toBe(false);
    });
  });
});

describe("When subscribing", () => {
  const setup = () => {
    const store = createStore();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    store.createRecord(existingRecordKey, "Duba");

    return { store, existingRecordKey, newRecordKey };
  };

  describe("And there is not a record associated with the given key", () => {
    const secondSetup = () => {
      const { newRecordKey, store } = setup();

      store.subscribe(newRecordKey, () => {});
    };

    it("Throws an error", () => {
      expect(() => secondSetup()).toThrow();
    });
  });

  describe("And there IS a record associated with the given key", () => {
    const secondSetup = () => {
      const { existingRecordKey, store } = setup();

      const subscriber = jest.fn();

      store.subscribe(existingRecordKey, subscriber);
      store.write(existingRecordKey, "Daba");

      return {
        existingRecordKey,
        store,
        subscriber,
      };
    };

    it("Subscriber starts being notified after subscription", () => {
      const { subscriber } = secondSetup();

      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});

describe("When unsubscribing", () => {
  const setup = () => {
    const store = createStore();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    store.createRecord(existingRecordKey, "Duba");

    return { store, existingRecordKey, newRecordKey };
  };

  describe("And there is not a record associated with the given key", () => {
    const secondSetup = () => {
      const { newRecordKey, store } = setup();

      store.subscribe(newRecordKey, () => {});
    };

    it("Throws an error", () => {
      expect(() => secondSetup()).toThrow();
    });
  });

  describe("And there IS a record associated with the given key and subscriber was previously subscribed", () => {
    const secondSetup = () => {
      const { existingRecordKey, store } = setup();

      const subscriber = jest.fn();

      store.subscribe(existingRecordKey, subscriber);
      store.unsubscribe(existingRecordKey, subscriber);
      store.write(existingRecordKey, "Daba");

      return {
        existingRecordKey,
        store,
        subscriber,
      };
    };

    it("Subscriber stops being notified after unsubscription", () => {
      const { subscriber } = secondSetup();

      expect(subscriber).not.toHaveBeenCalled();
    });
  });
});

describe("When reading data", () => {
  const setup = () => {
    const store = createStore();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    store.createRecord(existingRecordKey, "Duba");

    return { store, existingRecordKey, newRecordKey };
  };
  describe("And there is not a record associated with the given key", () => {
    const secondSetup = () => {
      const { store, newRecordKey } = setup();

      store.read(newRecordKey);
    };

    it("Throws an error", () => {
      expect(() => secondSetup()).toThrow();
    });
  });

  describe("And there IS a record associated with the given key", () => {
    const secondSetup = () => {
      const { store, existingRecordKey } = setup();

      const data = store.read(existingRecordKey);

      return {
        data,
      };
    };

    it("Returns data associated with record", () => {
      const { data } = secondSetup();

      expect(data).toBe("Duba");
    });
  });
});

describe("When writing data", () => {
  const setup = () => {
    const store = createStore();

    const existingRecordKey: RecordKey = {};
    const newRecordKey: RecordKey = {};

    store.createRecord(existingRecordKey, "Duba");

    return { store, existingRecordKey, newRecordKey };
  };

  describe("And there is not a record associated with the given key", () => {
    const secondSetup = () => {
      const { store, newRecordKey } = setup();

      store.write(newRecordKey, "Yada");
    };

    it("Throws an error", () => {
      expect(() => secondSetup()).toThrow();
    });
  });

  describe("And there IS a record associated with the given key", () => {
    const secondSetup = () => {
      const { store, existingRecordKey } = setup();

      const firstSubscriber = jest.fn();
      const secondSubscriber = jest.fn();

      store.subscribe(existingRecordKey, firstSubscriber);
      store.subscribe(existingRecordKey, secondSubscriber);

      store.write(existingRecordKey, "Yada");

      const data = store.read(existingRecordKey);

      return {
        data,
        firstSubscriber,
        secondSubscriber,
      };
    };

    it("Writes data to record", () => {
      const { data } = secondSetup();

      expect(data).toBe("Yada");
    });

    it("Notifies all associated subscribers", () => {
      const { firstSubscriber, secondSubscriber } = secondSetup();

      expect(firstSubscriber).toHaveBeenCalledTimes(1);
      expect(secondSubscriber).toHaveBeenCalledTimes(1);
    });
  });
});
