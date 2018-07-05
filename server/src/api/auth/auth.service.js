import { NotAuthenticatedError, CommercetoolsError } from '../../errors';

export default ({ commercetools }) => {
  const service = {};
  const { client, getRequestBuilder } = commercetools;

  service.signIn = async (email, password) => {
    const requestBuilder = getRequestBuilder();

    return client
      .execute({
        uri: `${requestBuilder.project.build()}login`,
        method: 'POST',
        body: { email, password },
      })
      .then(res => res.body.customer)
      .catch(err => {
        // If the credentials are not valid commercetools returns HTTP 400
        if (err.statusCode) {
          if (err.statusCode === 400) {
            throw new NotAuthenticatedError();
          }

          throw new CommercetoolsError(err);
        }

        throw err;
      });
  };

  return service;
};
