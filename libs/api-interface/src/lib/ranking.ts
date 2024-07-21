export type Ranking = (typeof Ranking)[keyof typeof Ranking];

export const Ranking = {
  A: 'A',
  B: 'B',
} as const;
