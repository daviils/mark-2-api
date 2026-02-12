import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DefaultMessage } from 'src/common/default-message';
import {
  CreateReplyInput,
  DeleteReplyInput,
  ReportReplyInput,
  UpdateReplyInput,
} from '../dto/create-reply.input';
import { Reply } from '../entity/reply.entity';
import { ReplyService } from '../service/reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private service: ReplyService) {}

  @Post()
  async createReply(@Body() input: CreateReplyInput): Promise<DefaultMessage> {
    return this.service.create(input);
  }

  @Post('report')
  async reportReply(@Body() input: ReportReplyInput): Promise<DefaultMessage> {
    return this.service.report(input);
  }

  @Put()
  async updateReply(@Body() input: UpdateReplyInput): Promise<DefaultMessage> {
    return this.service.update(input);
  }

  @Delete()
  async deleteReply(@Body() input: DeleteReplyInput): Promise<DefaultMessage> {
    return this.service.delete(input);
  }

  @Get('comment/:commentId')
  async repliesByCommentId(@Param('commentId') commentId: string): Promise<Reply[]> {
    return this.service.byCommentId(commentId);
  }

  @Get(':id')
  async replyById(@Param('id') id: string): Promise<Reply> {
    return this.service.byId(id);
  }
}
