import { PRService } from './../services/pr.service';
import { EmbedBuilder } from "@discordjs/builders";
import { Command } from "@sapphire/framework";
import type { Message, ForumChannel } from "discord.js";
import config from "../config/env";
import db from "../database";
import GitHub from './../github';

export class ScanCommand extends Command {

    private readonly github: GitHub;

    private readonly prService: PRService;

    public constructor(
        context: Command.Context,
        options: Command.Options,
    ) {
        super(context, {
            ...options,
            name: "scan",
            description: "scans all configured repositories",
            preconditions: ["OnlyRoleOrAdmin"],
        });

        this.github = new GitHub();
        this.prService = new PRService();
        //this.prService = Container.get(PRService);
    
    }

    public async messageRun(message: Message) {
        const forum_channel = await db.repos.ConfigRepository.findOneBy({
            name: 'forum-channel'
        })

        if (!forum_channel) {
            return await message.reply("Forum channel not configured, please run init command!");
        }

        if (!message.guild) {
            return await message.reply("Command not on a discord server received!");
        }
    
        const guild = await message.guild.fetch();
        const channel: ForumChannel = (await guild.channels.fetch(forum_channel.value)) as ForumChannel;

        if (!channel) {
            return await message.reply("Forum channel not found, please rerun init command!");
        }

        const labels = config.labels.map(l => l.toLowerCase());

        const embeds: EmbedBuilder[] = [];
        const reply = await message.reply("Scanning...");

        for (const repo of config.github.repos) {
            const prs = await this.github.getTestingRequiredPullRequests(repo);

            if (prs) {
                let total = 0;
                for (const pr of prs.data) {
                    if (
                        pr.labels.find(
                            (l) => labels.includes(l.name.toLowerCase())
                        ) === undefined
                    ) {
                        continue;
                    }

                    ++total;

                    await this.prService.process(pr, repo, channel);
                }

                embeds.push(
                    new EmbedBuilder()
                        .addFields({
                            name: "Repository",
                            value: repo,
                        }, {
                            name: "Total",
                            value: `${total} open testing required pull requests`
                        })
                );
            }
        }

        return await reply.edit({ content: " ", embeds });
    }
}