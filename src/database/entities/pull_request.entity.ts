import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum PRStatus {
  Deleted = -2,
  Unset = -1,
  Open = 0,
  Testing = 1,
  Tested = 2,
  Merged = 3,
}

@Entity()
export class PullRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  repo_name!: string;

  @Column()
  github_number!: number;

  @Column({
    default: "",
  })
  forum_thread_id!: string;

  @Column({
    default: "",
  })
  first_post_id!: string;

  @Column({
    default: null,
  })
  last_comment_timestamp?: string;

  @Column({
    default: PRStatus.Unset,
  })
  status!: PRStatus;
}
