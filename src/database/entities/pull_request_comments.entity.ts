import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PullRequestCommentEntity {
  @PrimaryGeneratedColumn()
      id!: number;

  @Column()
      github_id!: string;

  @Column()
      body!: string;
}
