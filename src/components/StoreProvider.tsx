import React, { createContext, ReactNode, useRef } from "react";
import { createStore, Store } from "../store/Store";

export type StoreContextValue = Store;

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef(createStore());

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};
