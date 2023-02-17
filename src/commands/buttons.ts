import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { ChannelType } from "discord.js";
import database from "../database";
import { PRService } from "../services/pr.service";

export class ButtonsCommand extends Command {
    private readonly pr_service: PRService;

    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ['b'],
        });
        this.pr_service = new PRService();
    }

    public async messageRun(message: Message) {
        if (message.channel.type === ChannelType.PublicThread) {
            const entity = await database.repos.PullRequestRepository.findOneBy({
                forum_thread_id: message.channel.id
            });
            if (entity) {
                await message.channel.send({
                    components: [
                        this.pr_service.makeButtons(entity.github_number)
                    ]
                })
            }
        }
    }
}
