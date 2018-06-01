import nock from 'nock';
import Commercetools from '../../../commercetools';
import AuthService from '../auth.service';
import { NotAuthenticatedError } from '../../../errors';

describe('Auth service', () => {
  const clientId = 'client1';
  const clientSecret = 'secret1';
  const projectKey = 'projectKey1';
  const host = 'https://api.commercetools.co';
  const oauthHost = 'https://auth.commercetools.co';
  let commercetools;
  let authService;

  // The commercetools sdk request for an access token, thus why we mock this commercetools endpoint
  beforeAll(() => {
    nock(oauthHost)
      .persist()
      .post('/oauth/token')
      .reply(200, {
        access_token: 'token1',
      });
  });

  beforeEach(() => {
    commercetools = Commercetools({
      clientId,
      clientSecret,
      projectKey,
      host,
      oauthHost,
    });

    authService = AuthService({ commercetools });
  });

  describe('when signin in a user', () => {
    describe('when success', () => {
      let user;

      beforeEach(async () => {
        nock(host)
          .post(`/${projectKey}/login`, {
            email: 'javier.ortizsaorin@commercetools.de',
            password: '12345',
          })
          .reply(200, {
            customer: {
              id: 'id1',
              email: 'javier.ortizsaorin@commercetools.de',
              password: '12345',
            },
          });

        user = await authService.signIn('javier.ortizsaorin@commercetools.de', '12345');
      });

      it('should return the user', () =>
        expect(user).toEqual({
          id: 'id1',
          email: 'javier.ortizsaorin@commercetools.de',
          password: '12345',
        }));
    });
    describe('when errors', () => {
      describe('when providing invalid credentials', () => {
        beforeEach(async () => {
          nock(host)
            .post(`/${projectKey}/login`, {
              email: 'javier.ortizsaorin@commercetools.de',
              password: '12345',
            })
            .reply(400, {});
        });

        it('should throw a "NotAuthenticatedError', async () =>
          // prettier-ignore
          expect(authService.signIn('javier.ortizsaorin@commercetools.de', '12345'))
            .rejects
            .toEqual(new NotAuthenticatedError()));
      });
      describe('when unhandled error', () => {
        beforeEach(async () => {
          nock(host)
            .post(`/${projectKey}/login`, {
              email: 'javier.ortizsaorin@commercetools.de',
              password: '12345',
            })
            .reply(500, { message: 'Internal Error' });
        });

        it('should throw the unhandled error', async () =>
          // prettier-ignore
          expect(authService.signIn('javier.ortizsaorin@commercetools.de', '12345'))
            .rejects
            .toEqual(new Error('Internal Error')));
      });
    });
  });
});
