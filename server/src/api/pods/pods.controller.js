export default ({ podsService }) => {
  const controller = {};

  controller.getLog = async (req, res, next) => {
    const { name } = req.params;

    try {
      return res.json(await podsService.getLog(name));
    } catch (err) {
      next(err);
    }
  };

  return controller;
};
