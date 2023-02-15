import { Command } from "@sapphire/framework";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { Message } from "discord.js";
import { ActionRowBuilder } from "@discordjs/builders";

export class InitCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "init",
      description: "Initializes the bot",
      preconditions: ["OnlyRoleOrAdmin"],
    });
  }

  public override async messageRun(message: Message) {
    const msg = await message.reply({
      content: `Setup is loading ...`,
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("forum-channel-setup-button")
        .setLabel("Forum Channel")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("bot-channel-setup-button")
        .setLabel("Bot Spam Channel")
        .setStyle(ButtonStyle.Danger)
    );

    return msg.edit({
      content: "Setup",
      components: [row],
    });
  }
}
