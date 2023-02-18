import { EmbedBuilder } from '@discordjs/builders';
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import database from "../database";

export class RabbitCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: "rabbit",
        });
    }

    public async messageRun(message: Message) {
        const counter = await database.repos.ReactionCounterRepository.findOneBy({
            user_id: '658824656194895952',
        });
        const rabbit = await message.guild?.members.fetch('658824656194895952');
        console.log(rabbit?.user.avatarURL());
        if (counter) {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor([255, 0, 0])
                        .setTitle('Rabbit Reaction Counter')
                        .setThumbnail(rabbit?.user.avatarURL() ?? '')
                        .setDescription(`**${counter.counter}**`)
                ]
            })
        } else {
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor([255, 0, 0])
                        .setTitle('Rabbit Reaction Counter')
                        .setThumbnail(rabbit?.user.avatarURL() ?? '')
                        .setDescription(`**0**`)
                ]
            })
        }
    }
}
