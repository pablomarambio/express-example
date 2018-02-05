module.exports = {
  development: {
    dialect: "postgres",
    database: 'customerdb2_development'
  },
  test: {
    dialect: "postgres",
    database: 'customerdb2_test'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres'
  }
};
