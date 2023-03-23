import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MailService from '../mails/mail.service';
import { IUsers } from './users.interface';
import { UsersService } from './users.service';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import { I18nService } from 'nestjs-i18n';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockedUserRepo = {
    findOne: jest.fn(),
    insert: jest.fn().mockResolvedValue({ raw: [{ id: 1, is_active: 1 }] }),
    update: jest.fn()
  };

  const mockedMailService = {
    sendMail: jest.fn().mockResolvedValue(true)
  };

  const mockedI18nService = {
    translate: jest.fn().mockResolvedValue('Already exist user used the email')
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        MailService,
        ConfigService,
        I18nService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepo
        }
      ]
    })
      .overrideProvider(MailService)
      .useValue(mockedMailService)
      .overrideProvider(I18nService)
      .useValue(mockedI18nService)
      .compile();
    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('Throw error when create existed email', async () => {
      const mockData: IUsers = {
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'abc@gmail.com',
        password: 'abc123456',
        id: 1,
        is_active: 1
      };
      mockedUserRepo.findOne.mockResolvedValueOnce(mockData);
      try {
        await service.createUser({
          firstName: mockData.first_name,
          lastName: mockData.last_name,
          email: mockData.email,
          password: mockData.password
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Create user successfully', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce(null);
      const input = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'abc@gmail.com',
        password: 'abc123456'
      };
      expect(await service.createUser(input)).toEqual({
        id: 1,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        is_active: 1
      });
    });
  });

  describe('findByCondition', () => {
    it('Should return user when found', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({});
      expect(await service.findByCondition({ id: 1 })).toEqual({});
    });
  });

  describe('updateUser', () => {
    it('Should throw error when user not found', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce(null);
      try {
        await service.updateUser(1, {});
      } catch (error) {
        expect(error.message).toEqual('User not found.');
      }
    });

    it('Should update user successfully', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({});
      mockedUserRepo.update.mockResolvedValueOnce({});
      expect(await service.updateUser(1, {})).toEqual({});
    });
  });

  describe('preResetPassword', () => {
    it('Should throw error when user not found', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce(null);
      try {
        await service.preResetPassword('abc@gmail.com');
      } catch (error) {
        expect(error.message).toEqual('User not found.');
      }
    });

    it('Success - prepare reset password', async () => {
      mockedUserRepo.findOne.mockResolvedValue({
        id: 1,
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'abc@gmail.com',
        is_active: 1,
        password: 'abc123456'
      });
      mockedUserRepo.update.mockResolvedValueOnce({});
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify({ some: 'data' }));
      expect(await service.preResetPassword('abc@gmail.com')).toEqual({ message: 'Prepare to reset password successfully!' });
    });
  });

  describe('validResetPassword', () => {
    it('Should throw error when user not found', async () => {
      try {
        mockedUserRepo.findOne.mockResolvedValueOnce(null);
        await service.validResetPassword('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Should valid reset password link', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({
        reset_password_at: new Date()
      });
      expect(await service.validResetPassword('')).toEqual(true);
    });
  });

  // describe('saveUserLog', () => {
  //   it('Should save user log', async () => {
  //     mockedUserLogRepo.insert.mockResolvedValueOnce({});
  //     expect(
  //       await service.saveUserLog({
  //         ip: '123',
  //         is_error: 1,
  //         message: 'message'
  //       })
  //     ).toEqual({});
  //   });
  // });
});
