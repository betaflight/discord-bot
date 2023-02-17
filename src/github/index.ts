import { RepositoryEntity } from "./../database/entities/repository.entity";
import type { User } from "discord.js";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import config from "../config/env";
import db from "../database";
import { autoInjectable } from "tsyringe";
import type { OctokitResponse } from "@octokit/types";
import type { ArrayElement } from "../../types/global";

export type GitHubComment = ArrayElement<RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"]>;

let inited = false;

@autoInjectable()
export default class GitHub {
  private octokit: Octokit;

  constructor() {
    if (
      !config.github.org ||
      !config.github.repos ||
      config.github.repos.length === 0
    ) {
      throw new Error("Invalid GitHub configuration");
    }

    this.octokit = new Octokit({
      auth: config.github.token,
    });

    if (!inited) {
      this.init();
      inited = true;
    }
  }

  async init() {
    for (let i = 0; i < config.github.repos.length; ++i) {
      let repo = await db.repos.RepositoryRepository.findOneBy({
        name: config.github.repos[i],
      });

      if (!repo) {
        const data = await this.octokit.repos.get({
          owner: config.github.org ?? "",
          repo: config.github.repos[i],
        });

        repo = new RepositoryEntity();
        repo.name = config.github.repos[i];
        repo.github_id = data.data.id;

        await db.manager.save(repo);
      }
    }
  }

  async getPullRequests(repo: string): Promise<RestEndpointMethodTypes["pulls"]["list"]["response"]> {
    const prs = await this.octokit.pulls.list({
      owner: config.github.org ?? "",
      repo,
    });

    return prs;
  }

  async getTestingRequiredPullRequests(repo: string) {
    const entity = await db.manager.findOneBy(RepositoryEntity, {
      name: repo,
    });

    if (entity) {
      return await this.octokit.pulls.list({
        owner: config.github.org ?? "",
        repo: repo,
        state: "open",
      });
    }

    return null;
  }

  async getPullRequest(repo: string, n: number) {
    const entity = await this.octokit.pulls.get({
      owner: config.github.org ?? "",
      repo: repo,
      pull_number: n
    });

    return entity;
  }

  async fetchComments(repo: string, pr: number, timestamp?: string): Promise<OctokitResponse<GitHubComment[]>> {
    const request: {
      owner: string;
      repo: string;
      issue_number: number;
      since?: string;
    } = {
      owner: config.github.org ?? "",
      repo: repo,
      issue_number: pr,
    };
    if (timestamp) {
      request.since = timestamp;
    }
    return await this.octokit.issues.listComments(request);
  }

  async addComment(repo: string, pr: number, body: string, user: User) {
    return await this.octokit.issues.createComment({
      owner: config.github.org ?? "",
      repo: repo,
      issue_number: pr,
      body: `<img src='${user.avatarURL()}' width="24" height="24"> **${user.username}\#${user.discriminator}** (Discord) commented:\n${body}`,
    });
  }
}
