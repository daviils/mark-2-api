import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { hashPasswordTransform } from 'src/common/helpers/crypto';
import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // 👈 necessário pro Graph
@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: number;

  @Column({ nullable: true })
  @Field()
  photoUrl?: string;

  @Column({ type: 'varchar', length: 120 })
  @Field()
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  @Field()
  status?: string;

  @Column({ type: 'varchar', length: 50 })
  @Field()
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Field()
  whatsapp?: string;

  @Column({
    transformer: hashPasswordTransform,
    nullable: true
  })
  @HideField()
  password?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

}
