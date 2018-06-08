export default ({ router, authLocalMiddleware, authController }) => {
  router.post('/signin', authLocalMiddleware, authController.signIn);

  return router;
};
