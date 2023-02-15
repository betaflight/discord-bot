import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  github_id!: number;
}
