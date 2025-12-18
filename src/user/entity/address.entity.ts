import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity()
export class Address {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: number;

  @Column({ nullable: true })
  @Field()
  CEP?: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  @Field()
  lat?: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  @Field()
  lon?: number;

  @Column()
  @Field()
  state: string;

  @Column()
  @Field()
  city: string;

  @Column({ nullable: true })
  @Field()
  neighborhood?: string;

  @Column({ nullable: true })
  @Field()
  street?: string;

  @Column({ nullable: true })
  @Field()
  number?: string;

  @Column({ nullable: true })
  @Field()
  referencePoint?: string;

  @Column()
  @Field()
  isPrincipal: boolean;

  //  @ManyToOne(() => User, (entityUser) => entityUser.address)
  //  @JoinColumn()
  //  user: User;
}
