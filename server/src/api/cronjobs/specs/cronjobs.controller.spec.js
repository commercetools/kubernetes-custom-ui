import CronjobsController from '../cronjobs.controller';
import CronjobsService from '../cronjobs.service';

describe('Cronjobs controller', () => {
  let cronjobsService;
  let cronjobsController;
  let req;
  let res;
  let next;

  beforeEach(() => {
    cronjobsService = CronjobsService();
    cronjobsController = CronjobsController({ cronjobsService });
    req = {};
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('when listing', () => {
    describe('when success', () => {
      beforeEach(() => {
        cronjobsService.listCronJobs = jest.fn().mockReturnValue(Promise.resolve([
          {
            id: 'id1',
            status: 'sucess',
          },
        ]));

        cronjobsController.listCronJobs(req, res, next);
      });

      it('should call the cronjobsService to get the cronjob list', () =>
        expect(cronjobsService.listCronJobs).toHaveBeenCalled());

      it('should return the cronjob list', () =>
        expect(res.json).toHaveBeenCalledWith([
          {
            id: 'id1',
            status: 'sucess',
          },
        ]));
    });
    describe('when errors', () => {
      beforeEach(() => {
        cronjobsService.listCronJobs = jest
          .fn()
          .mockReturnValue(Promise.reject(new Error('Internal Server Error')));

        cronjobsController.listCronJobs(req, res, next);
      });

      it('should not return the cronjob list', () => expect(res.json).not.toHaveBeenCalled());

      it('should pass down the error', () =>
        expect(next).toHaveBeenCalledWith(new Error('Internal Server Error')));
    });
  });
});
