/**
 * Require an environment variable to be set and return its value
 *
 * @param name The name of the environment variable to require
 * @returns The value of the environment variable
 */
function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (typeof value === 'undefined') {
    throw new Error(`Required environment variable ${name} is missing`);
  }

  return value;
}

export const config = {
  ADMIN_CODE: requireEnvironmentVariable('ADMIN_CODE'),
  ORIGIN: requireEnvironmentVariable('ORIGIN'),
  SECRET: requireEnvironmentVariable('SECRET'),
};
