import { Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import * as configs from './configs/index';
import MailService from './modules/mails/mail.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { I18nModule } from 'nestjs-i18n';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: Object.values(configs).map((val) => val.default),
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService]
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'ja',
      loaderOptions: {
        path: join(__dirname, './../i18n/'),
        watch: true,
      },
    }),
    AuthModule,
    UsersModule,
    ArticlesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
      scope: Scope.DEFAULT
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
      scope: Scope.DEFAULT
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
      scope: Scope.DEFAULT
    },
    MailService
  ]
})
export class AppModule {}
