import { Command } from "@sapphire/framework";
import type { Message, ForumChannel } from "discord.js";
import database from "../database";
import { PRService } from "../services/pr.service";

export class CleanCommand extends Command {

    private readonly prService: PRService;  

    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "clean",
            description: "cleans current prs",
        });

        this.prService = new PRService();
    }

    public async messageRun(message: Message) {

        const msg = await message.reply({
            content: "cleaning ...",
        });

        const forum_channel = await database.repos.ConfigRepository.findOneBy({
            name: 'forum-channel'
        });

        if (!forum_channel) {
            return await message.reply("Forum channel not configured, please run init command!");
        }

        if (message.guild) {

            const guild = await message.guild.fetch();
            const channel: ForumChannel = (await guild.channels.fetch(forum_channel.value)) as ForumChannel;

            if (!channel) {
                return await message.reply("Forum channel not found, please rerun init command!");
            }

            await this.prService.clean(channel);

            await msg.edit({
                content: "cleaned",
            })
        }
        
        return null;
    }
}
