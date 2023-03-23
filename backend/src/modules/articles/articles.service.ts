import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articles } from './articles.entity';
import { IArticle, IGetArticles } from './articles.interface';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private readonly repo: Repository<Articles>,
    private readonly i18n: I18nService
  ) {}

  async getArticles(take = 5, page = 1): Promise<IGetArticles> {
    const [articles, total] = await this.repo
      .createQueryBuilder('Articles')
      .take(take)
      .skip((page - 1) * take)
      .orderBy({ created_at: 'ASC' })
      .getManyAndCount();
    const totalPage = Math.ceil(total / take);

    return {
      articles,
      paginate: {
        page,
        total,
        totalPage
      }
    };
  }

  async getArticleById(id: number): Promise<IArticle> {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(this.i18n.translate('messages.ARTICLE_NOT_FOUND'));
    }

    return article;
  }
}
