import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesSchema } from './articles.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticlesSchema]), UsersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule {}
