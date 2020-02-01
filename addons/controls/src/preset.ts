module.exports = {
  config: (entry: any[] = []) => {
    return [...entry, ...[require.resolve('./config')]];
  },
};
