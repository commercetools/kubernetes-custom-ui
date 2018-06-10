import PodsController from '../pods.controller';
import PodsService from '../pods.service';

describe('Pods controller', () => {
  let podsService;
  let podsController;
  let k8sClient;
  let req;
  let res;
  let next;

  beforeEach(() => {
    k8sClient = {};
    podsService = PodsService({ k8sClient });
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
      };
    });

    describe('when success', () => {
      beforeEach(async () => {
        podsService.getLog = jest.fn().mockResolvedValue('This is the log data');

        await podsController.getLog(req, res, next);
      });

      it('should have call the podsService to get the log', () =>
        expect(podsService.getLog).toHaveBeenCalledWith('dummy-pod-1'));

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
