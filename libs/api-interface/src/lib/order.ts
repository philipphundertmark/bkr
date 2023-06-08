export type Order = typeof Order[keyof typeof Order];

export const Order = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;
