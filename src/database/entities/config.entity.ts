import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    default: ''
  })
  guild_id!: string;

  @Column({
    default: "",
  })
  value!: string;
}
