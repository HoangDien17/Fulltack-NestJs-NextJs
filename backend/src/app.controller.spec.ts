import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    appController = new AppController();
  });

  it('Should response pong', () => {
    const res = appController.ping();
    expect(res).toEqual('pong');
  });
});
