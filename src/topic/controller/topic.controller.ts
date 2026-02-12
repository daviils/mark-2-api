import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import { CreateTopicInput, ReportTopicInput } from '../dto/create-topic.input';
import { SearchTopicInput } from '../dto/search-topic.input';
import { TopicPage } from '../dto/topic-page';
import { Topic } from '../entity/topic.entity';
import { TopicService } from '../service/topic.service';

@Controller('topic')
export class TopicController {
  constructor(private service: TopicService) {}

  @Post('search')
  async searchTopics(@Body() input: SearchTopicInput): Promise<TopicPage> {
    return this.service.search(input);
  }

  @Post('report')
  async reportTopic(@Body() input: ReportTopicInput): Promise<DefaultMessage> {
    return this.service.report(input);
  }

  @Post()
  async createTopic(@Body() input: CreateTopicInput): Promise<DefaultMessage> {
    return this.service.create(input);
  }

  @Get(':id')
  async byIdTopic(@Param('id') id: string): Promise<Topic> {
    return this.service.byId(id);
  }
}
