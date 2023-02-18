import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
      id!: number;

  @Column({
      unique: true,
  })
      name!: string;

  @Column()
      github_id!: number;
}
