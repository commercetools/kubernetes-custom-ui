import request from 'request-promise-native';

export default ({ authService }) => async params => {
  const getAccessToken = async () => {
    if (authService) {
      return authService.getAccessToken().then(res => res.token);
    }

    return Promise.resolve('');
  };

  return request({
    auth: {
      bearer: await getAccessToken(),
    },
    rejectUnauthorized: false, // allows self signed certificates
    json: true,
    ...params,
  });
};
