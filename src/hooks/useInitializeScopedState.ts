import { useRef } from "react";
import { Scope } from "../scope/Scope";
import { useWriteScopedState } from "./useWriteScopedState";

type Initializer<T> = T | (() => T);

export const useInitializeScopedState = <T>(
  scope: Scope<T>,
  initializer: Initializer<T>
) => {
  const setState = useWriteScopedState(scope);

  // We need to keep track of the last scope passed
  // to the hook, because in the first render, this is going
  // to be null and thus we know that we need to initialize
  // the store and subscribe.
  // Also, if the scope changes, we know that we have to
  // redo this process.
  const lastScopeRef = useRef<Scope<T> | null>(null);
  if (lastScopeRef.current !== scope) {
    // We initialize DURING the first render
    setState(initializer);

    lastScopeRef.current = scope;
  }
};
