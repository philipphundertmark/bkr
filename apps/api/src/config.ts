const IS_TEST_ENV = process.env.NODE_ENV === 'test';

const ADMIN_CODE = process.env.ADMIN_CODE ?? (IS_TEST_ENV ? '<mocked>' : undefined);
if (typeof ADMIN_CODE === 'undefined') {
  throw new Error('Required environment variable ADMIN_CODE is missing');
}

const ORIGIN = process.env.ORIGIN ?? (IS_TEST_ENV ? '<mocked>' : undefined);
if (typeof ORIGIN === 'undefined') {
  throw new Error('Required environment variable ORIGIN is missing');
}

const SECRET = process.env.SECRET ?? (IS_TEST_ENV ? '<mocked>' : undefined);
if (typeof SECRET === 'undefined') {
  throw new Error('Required environment variable SECRET is missing');
}

export const config = {
  IS_TEST_ENV,
  ADMIN_CODE,
  ORIGIN,
  SECRET,
};
