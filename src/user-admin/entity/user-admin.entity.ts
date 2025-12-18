import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { hashPasswordTransform } from 'src/common/helpers/crypto';
import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // 👈 necessário pro Graph
@Entity()
export class UserAdmin {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  email: string;

  @Column({
    transformer: hashPasswordTransform,
    nullable: true
  })
  @HideField()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

}
