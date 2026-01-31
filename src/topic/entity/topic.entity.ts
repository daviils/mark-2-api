import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { Comments } from 'src/comments/entity/comments.entity';
import { CreateDateColumn, DeleteDateColumn, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';


export enum TopicStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REPORTED = 'REPORTED',
}
@ObjectType() // 👈 necessário pro Graph
@Entity()
export class Topic {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  title: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  link: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  createdBy: string;

  @Column({
    type: 'nvarchar',
    length: 20,
    default: TopicStatus.ACTIVE,
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

  @OneToMany(() => Comments, (entity) => entity.topic)
  comments?: Comments[];

}
