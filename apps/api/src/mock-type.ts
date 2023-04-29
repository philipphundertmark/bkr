export type MockType<T, U extends keyof T = keyof T> = {
  [K in U]: T[K] extends (...args: unknown[]) => unknown
    ? jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>
    : T[K];
};
