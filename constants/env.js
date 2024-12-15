const getEnv = (key, defaultValue) => {
  const value = process.env[key] || defaultValue;
  if (value === undefined)
    throw Error(`Missing String environment variable for ${key}`);
  return value;
};

module.exports = {
  PORT: getEnv("PORT", "4000"),
  DB_URL: getEnv("DB_URL"),
  ACCESS_KEY: getEnv("ACCESS_KEY"),
  REFRESH_KEY: getEnv("REFRESH_KEY"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "http://localhost:5173"),
  NODE_ENV: getEnv("NODE_ENV"),
};
