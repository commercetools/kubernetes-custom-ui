export default ({ environments }) => {
  const controller = {};

  controller.find = (req, res, next) => {
    try {
      const envs = environments.map(({ key, name }) => ({
        key,
        name,
      }));

      return res.json(envs);
    } catch (err) {
      next(err);
    }
  };

  return controller;
};
