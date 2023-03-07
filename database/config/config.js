module.exports = {
  development: {
    username: process.env.pg_username,
    password: process.env.pg_password,
    database: process.env.pg_database,
    host: process.env.pg_host,
    dialect: 'postgres',
    port: process.env.pg_port,
  },
};
