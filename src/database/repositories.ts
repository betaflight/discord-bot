import { RepositoryEntity } from "./entities/repository.entity";
import { PullRequestEntity } from "./entities/pull_request.entity";
import type { DataSource } from "typeorm";
import { ConfigEntity } from "./entities/config.entity";

export default function makeRepositories(db: DataSource) {
  if (!db.isInitialized) {
    throw Error("Database not initialized!");
  }

  const ConfigRepository = db.manager.getRepository(ConfigEntity);
  const PullRequestRepository = db.manager.getRepository(PullRequestEntity);
  const RepositoryRepository = db.manager.getRepository(RepositoryEntity);

  return { ConfigRepository, PullRequestRepository, RepositoryRepository };
}
