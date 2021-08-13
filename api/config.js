// hardcoded for the example

module.exports = {
  JWT_SECRET: 'this_is_a_secret',
  PG_ADMIN_CONNECTION: 'postgresql://logistimatics_postgraphql:password@localhost:5432/logistimatics?sslmode=disable',
  PORT: process.env.PORT || 5002,
};
