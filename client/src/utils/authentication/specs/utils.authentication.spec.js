import UtilsAuthentication from '../utils.authentication'

describe('Utils Authentication', () => {
  const utilsAuthentication = UtilsAuthentication()

  it('should decode a token', () => {
    // JWT Token for the payload
    // {
    //   "id": "id1",
    //   "email": "dummy-email@commercetools.de",
    //   "iat": 382233600,
    //   "exp": 382320000
    // }
    const token =
      // eslint-disable-next-line
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlkMSIsImVtYWlsIjoiZHVtbXktZW1haWxAY29tbWVyY2V0b29scy5kZSIsImlhdCI6MzgyMjMzNjAwLCJleHAiOjM4MjMyMDAwMH0.UQ9mDqvzU_RY1sOQGmkzkCKikoJBa5w2QT5CFr2nzFE'

    expect(utilsAuthentication.decodeToken(token)).toEqual({
      id: 'id1',
      email: 'dummy-email@commercetools.de',
      iat: 382233600,
      exp: 382320000,
    })
  })

  it('should check if the token has expired', () => {
    Date.now = jest.fn().mockReturnValue(new Date('2018-01-01T00:00:00.000Z').getTime())

    // no token and expiresAt after
    expect(utilsAuthentication.isTokenExpired(null, '2018-01-02T00:00:00.000Z')).toBeTruthy()
    expect(utilsAuthentication.isTokenExpired('', '2018-01-02T00:00:00.000Z')).toBeTruthy()
    // with token and no expiresAt
    expect(utilsAuthentication.isTokenExpired('123456789', '')).toBeTruthy()
    // with token and expiresAt before now
    expect(utilsAuthentication.isTokenExpired('123456789', '2017-12-31T23:59:59.999Z')).toBeTruthy()
    // with token and expiresAt after now
    expect(utilsAuthentication.isTokenExpired('123456789', '2018-01-01T00:00:00.001Z')).toBeFalsy()
  })
})
