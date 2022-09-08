import { useCallback, useRef } from "react";
import { Scope } from "../scope/Scope";
import { updatedValueFromUpdater } from "../utils/updater";
import { useStore } from "./useStore";

export const useWriteScopedState = <T>(scope: Scope<T>) => {
  const store = useStore();

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

    // In this case we DO NOT subscribe
    // so that this hook doesn't rerender
    lastScopeRef.current = scope;
  }

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

  return setState;
};
