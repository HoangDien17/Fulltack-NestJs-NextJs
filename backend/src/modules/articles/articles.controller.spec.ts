import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const ArticlesServiceMock = {
    getArticles: jest.fn(),
    getArticleById: jest.fn()
  };

  const UsersServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [ArticlesService, UsersService]
    })
      .overrideProvider(ArticlesService)
      .useValue(ArticlesServiceMock)
      .overrideProvider(UsersService)
      .useValue(UsersServiceMock)
      .compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of articles', async () => {
    await controller.getArticles({ take: 10, page: 1 });
    expect(ArticlesServiceMock.getArticles).toBeCalledWith(10, 1);
  });

  it('should return an article by id', async () => {
    await controller.getArticleById(1);
    expect(ArticlesServiceMock.getArticleById).toBeCalledWith(1);
  });
});
