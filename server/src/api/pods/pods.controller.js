export default ({ podsService }) => {
  const controller = {};

  controller.getLog = async (req, res, next) => {
    const { name } = req.params;
    const { environment, namespace } = req.query;

    try {
      return res.json(await podsService.getLog(name, environment, namespace));
    } catch (err) {
      next(err);
    }
  };

  return controller;
};
