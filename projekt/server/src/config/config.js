module.exports = {
  port: process.env.PORT || 8081,
  APP_SECRET: 'secret',
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
  },
};
