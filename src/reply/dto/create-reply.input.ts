import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReplyInput {
  @Field()
  content: string;

  @Field()
  commentId: string;

  @Field()
  createdBy: string;
}

@InputType()
export class UpdateReplyInput extends CreateReplyInput {
  @Field()
  id: string;
}

@InputType()
export class DeleteReplyInput {
  @Field()
  id: string;
}

@InputType()
export class ReportReplyInput {
  @Field()
  id: string;
}

