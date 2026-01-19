import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { hashPasswordTransform } from 'src/common/helpers/crypto';
import { Topic } from 'src/topic/entity/topic.entity';
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // 👈 necessário pro Graph
@Entity()
export class Comments {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  title: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  createdBy: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  @Field()
  status: string;

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

}
