import nock from 'nock';
import Commercetools from '../../../commercetools';
import UsersService from '../users.service';
import { CommercetoolsError } from '../../../errors';

describe('Auth service', () => {
  const clientId = 'client1';
  const clientSecret = 'secret1';
  const projectKey = 'projectKey1';
  const host = 'https://api.commercetools.co';
  const oauthHost = 'https://auth.commercetools.co';
  let commercetools;
  let usersService;

  // The commercetools sdk requests for an access token,
  // this is why we mock this commercetools endpoint
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

    usersService = UsersService({ commercetools });
  });

  describe('when creating a user', () => {
    describe('when success', () => {
      let user;

      beforeEach(async () => {
        nock(host)
          .post(`/${projectKey}/customers`, {
            firstName: 'dummy-name',
            lastName: 'dummy-last-name',
            email: 'dummy-email@commercetools.de',
            password: '12345',
          })
          .reply(200, {
            customer: {
              id: 'id1',
              firstName: 'dummy-name',
              lastName: 'dummy-last-name',
              email: 'dummy-email@commercetools.de',
              password: '12345',
            },
          });

        user = await usersService.create({
          firstName: 'dummy-name',
          lastName: 'dummy-last-name',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        });
      });

      it('should return the new user', () =>
        expect(user).toEqual({
          id: 'id1',
          firstName: 'dummy-name',
          lastName: 'dummy-last-name',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        }));
    });
    describe('when errors', () => {
      beforeEach(async () => {
        nock(host)
          .post(`/${projectKey}/customers`, {
            firstName: 'dummy-name',
            lastName: 'dummy-last-name',
            email: 'dummy-email@commercetools.de',
            password: '12345',
          })
          .reply(500, {
            message: 'Internal Error',
          });
      });

      it('should throw a CommercetoolsError', async () =>
        expect(usersService.create({
          firstName: 'dummy-name',
          lastName: 'dummy-last-name',
          email: 'dummy-email@commercetools.de',
          password: '12345',
        })).rejects.toEqual(new CommercetoolsError({
          message: 'Internal Error',
        })));
    });
  });
});
