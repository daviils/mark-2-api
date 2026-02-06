import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DefaultMessage } from 'src/common/default-message';
import {
  CreateReplyInput,
  DeleteReplyInput,
  ReportReplyInput,
  UpdateReplyInput,
} from '../dto/create-reply.input';
import { Reply } from '../entity/reply.entity';
import { ReplyService } from '../service/reply.service';

@Resolver()
export class ReplyResolver {
  constructor(private service: ReplyService) {}

  @Mutation(() => DefaultMessage)
  async createReply(@Args('input', { type: () => CreateReplyInput }) input: CreateReplyInput) {
    return this.service.create(input);
  }

  @Mutation(() => DefaultMessage)
  async reportReply(@Args('input', { type: () => ReportReplyInput }) input: ReportReplyInput) {
    return this.service.report(input);
  }

  @Mutation(() => DefaultMessage)
  async updateReply(@Args('input', { type: () => UpdateReplyInput }) input: UpdateReplyInput) {
    return this.service.update(input);
  }

  @Mutation(() => DefaultMessage)
  async deleteReply(@Args('input', { type: () => DeleteReplyInput }) input: DeleteReplyInput) {
    return this.service.delete(input);
  }

  @Query(() => Reply)
  async replyById(@Args('id', { type: () => String }) id: string) {
    return this.service.byId(id);
  }

  @Query(() => [Reply])
  async repliesByCommentId(@Args('commentId', { type: () => String }) commentId: string) {
    return this.service.byCommentId(commentId);
  }
}

