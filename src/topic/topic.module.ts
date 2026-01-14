import { Module } from '@nestjs/common';
import { TopicService } from './service/topic.service';
import { TopicResolver } from './resolver/topic.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Topic
    ]),
  ],
  providers: [TopicService, TopicResolver]
})
export class TopicModule { }
