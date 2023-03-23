import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const ConfigServiceMock = {
    get: jest.fn().mockReturnValue('http://localhost:3000')
  };
  const AuthServiceMock = {
    signUp: jest.fn(),
    confirmRegister: jest.fn(),
    signIn: jest.fn()
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ConfigService]
    })
      .overrideProvider(ConfigService)
      .useValue(ConfigServiceMock)
      .overrideProvider(AuthService)
      .useValue(AuthServiceMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signUp', async () => {
    await controller.signUp({} as any);
    expect(AuthServiceMock.signUp).toBeCalledWith({});
  });

  it('confirmRegister', async () => {
    const mockResponse = {
      redirect: jest.fn().mockReturnValue({})
    } as any;
    await controller.confirmRegister(
      {
        token: 'token'
      } as any,
      mockResponse
    );
    expect(AuthServiceMock.confirmRegister).toBeCalledWith('token');
  });

  it('signIn', async () => {
    const input = {
      email: 'token@example.com',
      password: 'password'
    };
    await controller.signIn(input);
    expect(AuthServiceMock.signIn).toBeCalledWith(input);
  });
});
