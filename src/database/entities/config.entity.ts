import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConfigEntity {
  @PrimaryGeneratedColumn()
      id!: number;

  @Column()
      name!: string;

  @Column()
      guild_id!: string;

  @Column()
      value!: string;
}
