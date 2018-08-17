/**
 * Get environment alias.
 * @param {string} environmentName - Environment name.
 * @returns {string} Environment alias.
 */
function getEnvironmentAlias(environmentName: string): string {
  let environmentAlias: string;

  if (!environmentName || environmentName === 'development') {
    environmentAlias = 'dev';
  } else if (environmentName === 'production') {
    environmentAlias = 'prod';
  } else {
    environmentAlias = 'unknown';
  }

  return environmentAlias;
}

export default require(`./environment.${getEnvironmentAlias(process.env.NODE_ENV)}`).default;
