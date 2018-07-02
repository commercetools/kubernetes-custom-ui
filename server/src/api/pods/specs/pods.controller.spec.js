import PodsController from '../pods.controller';
import PodsService from '../pods.service';

describe('Pods controller', () => {
  let podsService;
  let podsController;
  let k8sClient;
  let environments;
  let req;
  let res;
  let next;

  beforeEach(() => {
    k8sClient = {};
    environments = [
      {
        key: 'test',
        name: 'test environment',
        host: 'http://test.com',
        namespaces: ['default', 'test'],
      },
    ];
    podsService = PodsService({ k8sClient, environments });
    podsController = PodsController({ podsService });
    req = {};
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('when getting the pod log ', () => {
    beforeEach(() => {
      req = {
        params: {
          name: 'dummy-pod-1',
        },
        query: {
          environment: 'test',
          namespace: 'test',
        },
      };
    });

    describe('when success', () => {
      beforeEach(async () => {
        podsService.getLog = jest.fn().mockResolvedValue('This is the log data');

        await podsController.getLog(req, res, next);
      });

      it('should have call the podsService to get the log', () =>
        expect(podsService.getLog).toHaveBeenCalledWith('dummy-pod-1', 'test', 'test'));

      it('should return the log data', () =>
        expect(res.json).toHaveBeenCalledWith('This is the log data'));
    });
    describe('when errors', () => {
      beforeEach(() => {
        podsService.getLog = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

        podsController.getLog(req, res, next);
      });

      it('should not return the pod log', () => expect(res.json).not.toHaveBeenCalled());

      it('should pass down the error', () =>
        expect(next).toHaveBeenCalledWith(new Error('Internal Server Error')));
    });
  });
});
