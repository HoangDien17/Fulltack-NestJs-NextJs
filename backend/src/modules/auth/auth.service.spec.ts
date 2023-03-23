import { AuthService } from './auth.service';
import { TestingModule, Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import MailService from '../mails/mail.service';
import * as fs from 'fs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('token') }));
jest.mock('nestjs-i18n', () => ({
  I18nService: jest.fn().mockImplementation(() => ({
    translate: jest.fn().mockReturnValue('This is an error message')
  }))
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true)
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserService = {
    findByCondition: jest.fn(),
    createUser: jest.fn().mockResolvedValue({ id: 1, firstName: 'nam', lastName: 'nguyen', email: 'abc@gmail.com' }),
    updateUser: jest.fn().mockResolvedValue({})
  };

  const mockedMailService = {
    sendMail: jest.fn().mockResolvedValue(true)
  };

  const mockedConfigService = {
    get: jest.fn().mockReturnValue('secret')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, UsersService, MailService, I18nService]
    })
      .overrideProvider(UsersService)
      .useValue(mockedUserService)
      .overrideProvider(MailService)
      .useValue(mockedMailService)
      .overrideProvider(ConfigService)
      .useValue(mockedConfigService)
      .compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw error when email already exist', async () => {
      mockedUserService.findByCondition.mockResolvedValueOnce({ email: 'test' });
      try {
        await service.signUp({
          firstName: 'test',
          lastName: 'test',
          email: 'test',
          password: 'test'
        });
      } catch (error) {
        expect(error.message).toBe('This is an error message');
      }
    });

    it('Success - sign up successfully', async () => {
      mockedUserService.findByCondition.mockResolvedValueOnce(null);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ some: 'data' }));
      expect(
        await service.signUp({
          firstName: 'test',
          lastName: 'test',
          email: 'test',
          password: 'test'
        })
      ).toBeDefined();
    });
  });

  describe('confirmRegister', () => {
    it('should throw error when user not found', async () => {
      mockedUserService.findByCondition.mockResolvedValueOnce(null);
      try {
        await service.confirmRegister('token');
      } catch (error) {
        expect(error.message).toBe('This is an error message');
      }
    });

    it('Success - confirm register successfully', async () => {
      mockedUserService.findByCondition.mockResolvedValueOnce({
        id: 1,
        firstName: 'nam',
        lastName: 'nguyen',
        email: 'abc@gmail.com',
        confirm_email_at: new Date()
      });
      expect(await service.confirmRegister('token')).toBeUndefined();
    });
  });

  describe('signIn', () => {
    it('Error - User not found', async () => {
      try {
        mockedUserService.findByCondition.mockResolvedValueOnce(null);
        await service.signIn({ email: 'abc@gmail.com', password: '123456' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('Error - Block login', async () => {
      mockedUserService.findByCondition.mockResolvedValueOnce({
        id: 1,
        firstName: 'nam',
        lastName: 'nguyen',
        email: 'abc@gmail.com',
        lock_time: new Date(new Date().getTime() + 5 * 60 * 1000)
      });
      try {
        await service.signIn({ email: 'abc@gmail.com', password: '123456' });
      } catch (error) {
        expect(error.message).toBe('This is an error message');
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Error - Wrong password', async () => {
      mockedUserService.findByCondition.mockResolvedValueOnce({
        id: 1,
        firstName: 'nam',
        lastName: 'nguyen',
        email: 'abc@gmail.com',
        password: 'abc123'
      });
      try {
        await service.signIn({
          email: 'abc@gmail.com',
          password: 'abc123'
        });
      } catch (error) {
        expect(error.message).toBe('This is an error message');
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Success - Sign in successfully', async () => {
      const user = {
        id: 1,
        firstName: 'nam',
        lastName: 'nguyen',
        email: 'abc@gmail.com',
        password: 'abc123'
      };
      mockedUserService.findByCondition.mockResolvedValueOnce(user);

      expect(
        await service.signIn({
          email: 'abc@gmail.com',
          password: 'abc123'
        })
      ).toEqual({
        refreshToken: 'token',
        user,
        accessToken: 'token'
      });
    });
  });
});
