import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtKEY } from 'src/config/jwt.config';
import { AuthMiddleware } from './auth.middleware';
import { Genre } from 'src/entities/genre.entity';
import { Review } from 'src/entities/review.entity';
import { Comment } from 'src/entities/comment.entity';
import { Like } from 'src/entities/like.entity';
import { Tag } from 'src/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Genre, Review, Comment, Like, Tag]),
    JwtModule.register({
      secret: jwtKEY.secreteKey,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})

//미들웨어 적용하기 위함
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/users');
  }
}
