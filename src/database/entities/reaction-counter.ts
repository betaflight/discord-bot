import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReactionCounterEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true
  })
  user_id!: string;

  @Column({
    default: 0
  })
  counter!: number;
}
