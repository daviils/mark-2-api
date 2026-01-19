import { Module } from '@nestjs/common';
import { CommentsService } from './service/comments.service';
import { CommentsResolver } from './resolver/comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entity/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comments
    ]),
  ],
  providers: [CommentsService, CommentsResolver]
})
export class CommentsModule {}
