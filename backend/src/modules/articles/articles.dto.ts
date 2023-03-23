import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  created_at?: Date;

  @ApiPropertyOptional()
  updated_at?: Date;
}

export class ArticlesListQuery {
  @ApiProperty({
    required: false,
    description: 'Limit of articles',
    type: Number
  })
  take: number;

  @ApiProperty({
    required: false,
    description: 'Page of articles',
    type: Number
  })
  page: number;
}

export class ArticlesListResponseDto {
  @ApiProperty({ type: [ArticleResponseDto] })
  data: ArticleResponseDto[];

  @ApiProperty()
  paginate: {
    page: number;
    total: number;
    totalPage: number;
  };
}
