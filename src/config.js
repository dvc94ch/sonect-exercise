module.exports = {
  secret: (() => {
    if (process.env.NODE_ENV == 'test') {
      return 'secret';
    }
    return process.env.SECRET;
  })(),
};
