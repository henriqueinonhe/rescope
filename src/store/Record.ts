import { makeWithBrand } from "../utils/withBrand";
import { Subscriber } from "./Subscriber";

const { factoryWrapper } = makeWithBrand();

type CreateRecordParameters = {
  initialValue: unknown;
};

export const createRecord = factoryWrapper(
  ({ initialValue }: CreateRecordParameters) => ({
    value: initialValue,
    subscribers: new Set<Subscriber>(),
  })
);

/**
 * Individual Record that represents
 * a slice of the state.
 */
export type Record = ReturnType<typeof createRecord>;
