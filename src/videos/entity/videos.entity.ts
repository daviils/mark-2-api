import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { hashPasswordTransform } from 'src/common/helpers/crypto';
import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // 👈 necessário pro Graph
@Entity()
export class Videos {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: number;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  title: string;

  @Column({ type: 'varchar', length: 250 })
  @Field()
  description: string;

  @Column({ type: 'varchar' })
  @Field()
  thumb: string;

  @Column({ type: 'varchar' })
  @Field()
  urlExternal: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  site: string;

  @Column({ type: 'int', default: 0 })
  @Field()
  likes: number;

  @Column({ type: 'int', default: 0 })
  @Field()
  deslikes: number;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  tags: string;

  @Column({ type: 'int', default: 0 })
  @Field()
  reports: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

}
