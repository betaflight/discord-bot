import { autoInjectable } from 'tsyringe';
import { PRStatus, PullRequestEntity } from './../database/entities/pull_request.entity';
import type { ForumChannel, ThreadChannel, BaseMessageOptions } from 'discord.js';
import { ButtonStyle } from 'discord.js';
import database from '../database';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from '@discordjs/builders';
import GitHub from "../github";

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

    public async process(pr: ArrayElement<RestEndpointMethodTypes["pulls"]["list"]["response"]["data"]>, repo_name: string, channel: ForumChannel) {
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
            thread = await this.makeThread(channel, pr, repo_name, body);

            entity!.forum_thread_id = thread.id;
            entity!.first_post_id = thread.lastMessageId ?? '';

          } else {
            thread = await channel.threads.fetch(entity!.forum_thread_id);

            if (!thread) {
              thread = await this.makeThread(channel, pr, repo_name, body);

              entity!.forum_thread_id = thread.id;
              entity!.first_post_id = thread.lastMessageId ?? '';
            }

            thread!.setName(`#${pr.number}: ${pr.title} by __${pr.user?.login ?? 'Unknown'}__ - (${repo_name})`);

            const msg = await thread!.messages.fetch(entity!.first_post_id);

            msg.edit(this.buildPrPost(pr, body))
          }

          if (entity) {
            await database.repos.PullRequestRepository.save(entity);
          }
    }

    private async makeThread(channel: ForumChannel, pr: any, repo: string, body: string) {
        return await channel.threads.create({
            name: `#${pr.number}: ${pr.title} by ${pr.user?.login ?? 'Unknown'} - (${repo})`,
            message: this.buildPrPost(pr, body)
        })
    }

    private buildPrPost(pr: any, body: string): BaseMessageOptions {
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
                  .setLabel("Copy pr number")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId(`${pr.number}-comment-button`)
                  .setLabel("Add comment")
                  .setStyle(ButtonStyle.Success)
              )
          ]
        };
      }
}

export { PRService };