import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class BaseInput{
  @Field(() => String)
  id: string;
}

@InputType()
export class GetToken{
  @ApiProperty({ description: 'Token', required: false })
  public token: string;
}
@InputType()
export class GetId{
  @ApiProperty({ description: 'Id', required: true })
  public id: string;
}