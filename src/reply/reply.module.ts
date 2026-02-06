import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entity/comments.entity';
import { ReplyResolver } from './resolver/reply.resolver';
import { Reply } from './entity/reply.entity';
import { ReplyService } from './service/reply.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply, Comments]),
  ],
  providers: [ReplyResolver, ReplyService],
})
export class ReplyModule {}

