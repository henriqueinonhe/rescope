export type Scope<T> = {
  initialValue: T;
};

type CreateScopeParameters<T> = {
  initialValue: T;
};

export const createScope = <T>({
  initialValue,
}: CreateScopeParameters<T>): Scope<T> => ({
  initialValue,
});
