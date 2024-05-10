import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environments } from './common/utils/enviroments';
import {
  salesProvider,
  userProvider,
} from './database/providers/models.provider';
import { databaseProviders } from './database/database.provider';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { SalesModule } from './sales/sales.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';

const pathsExclude = ['/auth/signup', '/auth/signin'];

@Module({
  imports: [
    AuthModule,
    SalesModule,
    ConfigModule.forRoot({
      load: [environments],
    }),
    JwtModule.register({}),
    UsersModule,
    CustomersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [...databaseProviders, ...userProvider, ...salesProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...pathsExclude)
      .forRoutes('*');
  }
}
