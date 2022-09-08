import { useContext, useRef, useState, useEffect, useCallback } from "react";
import { Scope } from "../scope/Scope";
import { StoreContext } from "../components/StoreProvider";
import { Store } from "../store/Store";
import { userError } from "../errors/userError";
import { updatedValueFromUpdater } from "../utils/updater";

export const useScopedState = <T>(scope: Scope<T>) => {
  const store = useContext(StoreContext);

  storeProviderExists(store);

  // Used to force rendering
  const [, set] = useState({});
  // We use a ref here because this is never
  // going to update and it skips the check
  // useCallback does
  const forceRenderRef = useRef(() => set({}));

  // We need to keep track of the last scope passed
  // to the hook, because in the first render, this is going
  // to be null and thus we know that we need to initialize
  // the store and subscribe.
  // Also, if the scope changes, we know that we have to
  // redo this process.
  const lastScopeRef = useRef<Scope<T> | null>(null);
  if (lastScopeRef.current !== scope) {
    if (!store.hasRecord(scope)) {
      store.createRecord(scope, scope.initialValue);
    }

    // We want to subscribe BEFORE/DURING the first render
    // so that any calls to setState during the first
    // render will already trigger subscribers
    store.subscribe(scope, forceRenderRef.current);

    lastScopeRef.current = scope;
  }

  useEffect(() => {
    const forceUpdate = forceRenderRef.current;

    return () => {
      // We subscribe on unmount or anytime
      // the scope changes
      store.unsubscribe(scope, forceUpdate);
    };
  }, [scope, store]);

  const state = store.read(scope) as T;

  const setState = useCallback(
    (updater: T | ((currentState: T) => T)) => {
      // We MUST read the currentState directly
      // from the store, because if the user
      // calls setState multiple times in the
      // same render, state becomes stale and
      // it only updates in the next render
      const currentState = store.read(scope) as T;
      const updatedState = updatedValueFromUpdater(currentState, updater);

      store.write(scope, updatedState);
    },
    [scope]
  );

  return [state, setState] as const;
};

const storeProviderExists: (
  store: Store | undefined
) => asserts store is Store = (store) => {
  if (store === undefined) {
    userError("StoreProvider missing!");
  }
};
