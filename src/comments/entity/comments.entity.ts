import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { Reply } from 'src/reply/entity/reply.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REPORTED = 'REPORTED',
}

@ObjectType() // 👈 necessário pro Graph
@Entity()
export class Comments {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  content: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  @Field()
  link?: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  createdBy: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: CommentStatus.ACTIVE,
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

  @ManyToOne(() => Topic, (entity) => entity.comments)
  @JoinColumn()
  topic: Topic;

  @OneToMany(() => Reply, (entity) => entity.comment)
  @Field(() => [Reply], { nullable: true })
  replies?: Reply[];

}
