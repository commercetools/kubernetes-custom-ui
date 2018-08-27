import { JWT } from 'google-auth-library';

export default ({ clientEmail, privateKey }) => {
  const client = {};

  const googleClient = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  client.getAccessToken = async () =>
    googleClient.authorize().then(res => ({
      token: res.access_token,
      expires: res.expiry_date,
    }));

  return client;
};
