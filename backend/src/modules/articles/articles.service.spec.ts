import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Articles } from './articles.entity';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const mockedArticleRepo = {
    createQueryBuilder: jest.fn().mockImplementation(() => {
      return {
        take: jest.fn().mockImplementation(() => {
          return {
            skip: jest.fn().mockImplementation(() => {
              return {
                orderBy: jest.fn().mockImplementation(() => {
                  return {
                    getManyAndCount: jest.fn().mockResolvedValue([[], 3])
                  };
                })
              };
            })
          };
        })
      };
    }),
    findOne: jest.fn().mockResolvedValue({ id: 1 })
  };
  const mockedI18nService = {
    translate: jest.fn().mockReturnValue('This is an error message')
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        I18nService,
        {
          provide: getRepositoryToken(Articles),
          useValue: mockedArticleRepo
        }
      ]
    })
      .overrideProvider(I18nService)
      .useValue(mockedI18nService)
      .compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return an array of articles', async () => {
      const result = await service.getArticles(10);
      expect(result).toEqual({
        articles: [],
        paginate: {
          page: 1,
          total: 3,
          totalPage: 1
        }
      });
    });
  });

  describe('getArticleById', () => {
    it('should return an article by id', async () => {
      const result = await service.getArticleById(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should return an error if article not found', async () => {
      mockedArticleRepo.findOne.mockResolvedValue(null);
      try {
        await service.getArticleById(1);
      } catch (error) {
        expect(error.message).toEqual('This is an error message');
        expect(error.status).toEqual(404);
      }
    });
  });
});
