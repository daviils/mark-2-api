import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entity/comments.entity';
import { ReplyResolver } from './resolver/reply.resolver';
import { Reply } from './entity/reply.entity';
import { ReplyService } from './service/reply.service';
import { ReplyController } from './controller/reply.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply, Comments]),
  ],
  providers: [ReplyResolver, ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}

