import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { createScope } from "../scope/Scope";
import { useScopedState } from "./useScopedState";
import React, { useEffect, useState } from "react";
import { StoreProvider } from "../components/StoreProvider";

describe("When StoreProvider is missing", () => {
  const setup = () => {
    const scope = createScope({
      initialValue: "Yada",
    });

    renderHook(() => useScopedState(scope));
  };

  it("Throws an error", () => {
    expect(() => setup()).toThrow();
  });
});

describe("When there is a single component using a single scope", () => {
  const setup = () => {
    const scope = createScope({
      initialValue: "Yada",
    });

    const Component = () => {
      const [state, setState] = useScopedState(scope);

      return (
        <input
          data-testid="input"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      );
    };

    render(
      <StoreProvider>
        <Component />
      </StoreProvider>
    );

    const getInput = () => screen.getByTestId("input");

    return {
      getInput,
    };
  };

  it("Initial value is read correctly", () => {
    const { getInput } = setup();

    expect(getInput()).toHaveValue("Yada");
  });

  describe("And value is updated", () => {
    const secondSetup = () => {
      const { getInput } = setup();

      fireEvent.change(getInput(), {
        target: {
          value: "Duba",
        },
      });

      return {
        getInput,
      };
    };

    it("Hook rerenders with the updated state", async () => {
      const { getInput } = secondSetup();

      await waitFor(() => {
        expect(getInput()).toHaveValue("Duba");
      });
    });
  });
});

describe("When there are multiple components using the same scope", () => {
  const setup = () => {
    const firstScope = createScope({
      initialValue: "Yada",
    });

    const secondScope = createScope({
      initialValue: "Abacate",
    });

    const ComponentA = () => {
      const [state, setState] = useScopedState(firstScope);

      return (
        <input
          data-testid="inputA"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      );
    };

    const ComponentB = () => {
      const [state, setState] = useScopedState(firstScope);

      return (
        <input
          data-testid="inputB"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      );
    };

    const componentCRenderProbe = jest.fn();
    const ComponentC = () => {
      const [state, setState] = useScopedState(secondScope);

      componentCRenderProbe();

      return (
        <input
          data-testid="inputC"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      );
    };

    render(
      <StoreProvider>
        <ComponentA />
        <ComponentB />
        <ComponentC />
      </StoreProvider>
    );

    const getInputA = () => screen.getByTestId("inputA");
    const getInputB = () => screen.getByTestId("inputB");
    const getInputC = () => screen.getByTestId("inputC");

    return {
      getInputA,
      getInputB,
      getInputC,
      componentCRenderProbe,
    };
  };

  describe("And one component triggers a state update", () => {
    const secondSetup = () => {
      const { getInputA, getInputB, componentCRenderProbe, getInputC } =
        setup();

      fireEvent.change(getInputA(), {
        target: {
          value: "Duba",
        },
      });

      return {
        getInputA,
        getInputB,
        getInputC,
        componentCRenderProbe,
      };
    };

    it("All components using the same scope are re-rendered with the updated state", async () => {
      const { getInputA, getInputB } = secondSetup();

      expect(getInputA()).toHaveValue("Duba");
      expect(getInputB()).toHaveValue("Duba");
    });

    it("Other components using other scopes are NOT rerendered", () => {
      const { getInputC, componentCRenderProbe } = secondSetup();

      expect(getInputC()).toHaveValue("Abacate");
      expect(componentCRenderProbe).toHaveBeenCalledTimes(1);
    });
  });
});

describe("When there are multiple calls to set state (using the function updater method)", () => {
  const setup = () => {
    const scope = createScope({
      initialValue: "Yada",
    });

    const Component = () => {
      const [state, setState] = useScopedState(scope);

      useEffect(() => {
        setState((state) => state + "Da");
        setState((state) => state + "ba");
      }, []);

      return (
        <input
          data-testid="input"
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      );
    };

    render(
      <StoreProvider>
        <Component />
      </StoreProvider>
    );

    const getInput = () => screen.getByTestId("input");

    return {
      getInput,
    };
  };

  it("Each call receives the resulting state from the last call", async () => {
    const { getInput } = setup();

    await waitFor(() => {
      expect(getInput()).toHaveValue("YadaDaba");
    });
  });
});

describe("When changing the scope", () => {
  const setup = () => {
    const initialScope = createScope({
      initialValue: "Yada",
    });

    const Component = () => {
      const [scope, setScope] = useState(initialScope);
      const [state, setState] = useScopedState(scope);

      const updateScope = () => {
        const newScope = createScope({
          initialValue: "Duba",
        });

        setScope(newScope);
      };

      return (
        <>
          <input
            data-testid="input"
            value={state}
            onChange={(event) => setState(event.target.value)}
          />
          <button data-testid="button" onClick={updateScope}>
            Update
          </button>
        </>
      );
    };

    render(
      <StoreProvider>
        <Component />
      </StoreProvider>
    );

    const getInput = () => screen.getByTestId("input");
    const getButton = () => screen.getByTestId("button");

    fireEvent.click(getButton());

    return {
      getInput,
      getButton,
    };
  };

  it("Subscribes to the new scope", () => {
    const { getInput } = setup();

    expect(getInput()).toHaveValue("Duba");
  });
});
