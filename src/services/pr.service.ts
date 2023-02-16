import { autoInjectable } from 'tsyringe';
import { PRStatus, PullRequestEntity } from './../database/entities/pull_request.entity';
import type { ForumChannel, ThreadChannel, BaseMessageOptions } from 'discord.js';
import { ButtonStyle } from 'discord.js';
import database from '../database';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import GitHub from "../github";import type { PullRequest } from '../../types/global';
;

@autoInjectable()
class PRService {

    private readonly _github: GitHub;

    constructor() {
        this._github = new GitHub();
    }

    public async clean(channel: ForumChannel) {
        const entities = await database.repos.PullRequestRepository.find();

        for (let i = 0; i < entities.length; ++i) {
            const entity = entities[i];

            const gh_entity = await this._github!.getPullRequest(entity.repo_name, entity.github_number);
            const thread = await channel.threads.fetch(entity.forum_thread_id);

            if (!gh_entity) {

                if (thread) {
                    await thread.setArchived(true, "pr deleted");
                }

                entity.status = PRStatus.Deleted;
            } else if (gh_entity.data.merged) {
                console.log(gh_entity.data);
                entity.status = PRStatus.Merged;

                await thread?.setArchived(true, gh_entity.data.merge_commit_sha ?? '');
            }


            await database.repos.PullRequestRepository.save(entity);
        }
    }

    public async process(pr: PullRequest, repo_name: string, channel: ForumChannel) {
      let entity = await database.repos.PullRequestRepository.findOneBy({
        github_number: pr.number,
        repo_name,
      });

      if (!entity) {
        entity = new PullRequestEntity();
        entity!.github_number = pr.number;
        entity!.repo_name = repo_name;
        entity!.name = pr.title;
      }

      let thread: ThreadChannel | null = null;

      let body = pr.body;

      if (!body || body.length === 0) {
          body = "No description provided";
      }

      if (body.length > 4095) {
          body = body.substring(0, 4092) + "...";
      }

      if (!entity!.forum_thread_id) {
        thread = (await this.createOrUpdateThread(channel, null, null, pr, repo_name, body) as ThreadChannel);

        entity!.forum_thread_id = thread.id;
        entity!.first_post_id = thread.lastMessageId ?? '';

      } else {
        thread = await channel.threads.fetch(entity!.forum_thread_id);

        await this.createOrUpdateThread(channel, thread, entity!.first_post_id, pr, repo_name, body);
      }

      if (entity) {
        await database.repos.PullRequestRepository.save(entity);
      }
    }

    private async createOrUpdateThread(
      channel: ForumChannel,
      thread: ThreadChannel | null, 
      first_post_id: string | null,
      pr: PullRequest,
      repo: string,
      body: string
    ) {
        let name = `#${pr.number}: ${pr.title} by __${pr.user?.login ?? 'Unknown'}__ - (${repo})`;
        if (name.length > 100) {
          name = `#${pr.number}: ${pr.title.substring(0, pr.title.length - (name.length - 100))} by __${pr.user?.login ?? 'Unknown'}__ - (${repo})`
        }

        const message = this.buildPrPost(pr, body);

        if (!thread) {
          const t = await channel.threads.create({
              name: name,
              message: message
          });
          await this.processComments(t, pr.number);
          return t;
        }

        thread.setName(name);
        
        const msg = await thread.messages.fetch(first_post_id!);

        await this.processComments(thread, pr.number);

        return await msg.edit(message);
    }

    private async processComments(thread: ThreadChannel, pr: number) {
      const entity = await database.repos.PullRequestRepository.findOneBy({
        github_number: pr,
      });

      const comments = await this._github.fetchComments(entity!.repo_name, pr, entity!.last_comment_timestamp);

      console.log(thread, comments);
  
    }

    private buildPrPost(pr: PullRequest, body: string): BaseMessageOptions {
      return {
        embeds: [
          new EmbedBuilder()
            .addFields({
              name: 'Number',
              value: `${pr.number}`,
              inline: true
            }, {
              name: 'Author',
              value: pr.user?.login ?? '<Unknown>',
              inline: true
            }, {
              name: 'Title',
              value: pr.title,
            }, {
              name: 'Labels',
              value: pr.labels.map((l: any) => l.name).join(', '),
            }, {
                name: "URL",
                value: pr.html_url
            }),
          new EmbedBuilder()
            .setDescription(body)
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`${pr.number}-pr-button`)
                .setLabel("PR number")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`${pr.number}-comment-button`)
                .setLabel("Add comment")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`${pr.number}-refresh-button`)
                .setLabel("Refresh")
                .setStyle(ButtonStyle.Danger)
            )
        ]
      };
    }
}

export { PRService };