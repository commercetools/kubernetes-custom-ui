import { CommercetoolsError } from '../../errors';

export default ({ commercetools }) => {
  const service = {};
  const { client, getRequestBuilder } = commercetools;

  const handleCommercetoolsError = err => {
    throw new CommercetoolsError(err);
  };

  service.create = async userDraft => {
    const requestBuilder = getRequestBuilder();

    return client
      .execute({
        uri: requestBuilder.customers.build(),
        method: 'POST',
        body: userDraft,
      })
      .then(res => res.body.customer)
      .catch(handleCommercetoolsError);
  };

  return service;
};
