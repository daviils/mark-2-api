import { Module } from '@nestjs/common';
import { CommentsService } from './service/comments.service';
import { CommentsResolver } from './resolver/comments.resolver';
import { CommentsController } from './controller/comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entity/comments.entity';
import { Topic } from 'src/topic/entity/topic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comments,
      Topic
    ]),
  ],
  providers: [CommentsService, CommentsResolver],
  controllers: [CommentsController]
})
export class CommentsModule {}
