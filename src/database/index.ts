import { ReactionCounterEntity } from './entities/reaction-counter';
import { RepositoryEntity } from "./entities/repository.entity";
import { PullRequestEntity } from "./entities/pull_request.entity";
import { ConfigEntity } from "./entities/config.entity";
import { DataSource } from "typeorm";

class Database {
  private db: DataSource;

  constructor() {
    this.db = new DataSource({
      type: "sqlite",
      database: "database.sqlite",
      synchronize: true,
      entities: [RepositoryEntity, ConfigEntity, PullRequestEntity, ReactionCounterEntity],
    });
  }

  init() {
    return this.db.initialize();
  }

  get manager() {
    return this.db.manager;
  }

  get repos() {
    const ConfigRepository = this.db.manager.getRepository(ConfigEntity);
    const PullRequestRepository =
      this.db.manager.getRepository(PullRequestEntity);
    const RepositoryRepository =
      this.db.manager.getRepository(RepositoryEntity);
    const ReactionCounterRepository =
      this.db.manager.getRepository(ReactionCounterEntity);

    return {
      ConfigRepository,
      PullRequestRepository,
      RepositoryRepository,
      ReactionCounterRepository
    };
  }
}

export default new Database();
