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
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
