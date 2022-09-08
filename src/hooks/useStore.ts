import { useContext } from "react";
import { StoreContext } from "../components/StoreProvider";
import { userError } from "../errors/userError";
import { Store } from "../store/Store";

export const useStore = () => {
  const store = useContext(StoreContext);

  storeProviderExists(store);

  return store;
};

const storeProviderExists: (
  store: Store | undefined
) => asserts store is Store = (store) => {
  if (store === undefined) {
    userError("StoreProvider missing!");
  }
};
