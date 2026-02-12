import { Body, Controller, Post } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import { CreateCommentsInput, ReportCommentsInput } from '../dto/create-comments.input';
import { CommentsService } from '../service/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Post()
  async createComments(@Body() input: CreateCommentsInput): Promise<DefaultMessage> {
    return this.service.create(input);
  }

  @Post('report')
  async reportTopic(@Body() input: ReportCommentsInput): Promise<DefaultMessage> {
    return this.service.report(input);
  }
}
