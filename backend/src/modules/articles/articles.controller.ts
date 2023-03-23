import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../middlewares/auth.middware';
import { ArticleResponseDto, ArticlesListQuery, ArticlesListResponseDto } from './articles.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Articles list', operationId: 'ArticlesList', description: 'Articles list' })
  @ApiQuery({ name: 'query', required: false, type: ArticlesListQuery })
  @ApiOkResponse({ description: 'Articles list', type: ArticlesListResponseDto })
  async getArticles(@Query() query: ArticlesListQuery) {
    const { take, page } = query;
    return await this.articlesService.getArticles(take, page);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Article detail', operationId: 'ArticleDetail', description: 'Article Detail' })
  @ApiOkResponse({ description: 'Articles list', type: ArticleResponseDto })
  @ApiParam({ name: 'id', required: true, type: Number })
  async getArticleById(@Param('id') id: number) {
    return await this.articlesService.getArticleById(id);
  }
}
