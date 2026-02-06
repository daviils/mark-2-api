import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/comments/entity/comments.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ReplyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REPORTED = 'REPORTED',
}

@ObjectType()
@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 500 })
  @Field()
  content: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  link: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  createdBy: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: ReplyStatus.ACTIVE,
  })
  @Field()
  status: string;

  @Column({ type: 'int', default: 0 })
  reportCount: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field()
  deletedAt?: Date;

  @ManyToOne(() => Comments, (entity) => entity.replies)
  @JoinColumn()
  comment: Comments;
}

