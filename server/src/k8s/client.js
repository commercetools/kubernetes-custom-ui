import request from 'request-promise-native';

export default ({ authService, host }) => async params => {
  const getAccessToken = async () => {
    if (authService) {
      return authService.getAccessToken().then(res => res.token);
    }

    return '';
  };

  return request({
    auth: {
      bearer: await getAccessToken(),
    },
    baseUrl: host,
    rejectUnauthorized: false, // allows self signed certificates
    json: true,
    ...params,
  });
};
