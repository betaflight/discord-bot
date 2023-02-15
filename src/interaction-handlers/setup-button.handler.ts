import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
} from "@sapphire/framework";
import { ButtonInteraction, ChannelType } from "discord.js";
import {
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  StringSelectMenuBuilder,
} from "@discordjs/builders";

import { chunks } from "../helper";

import db from "../database";
import type { Repository } from "typeorm";
import type { ConfigEntity } from "../database/entities/config.entity";

export class SetupButtonHandler extends InteractionHandler {
  private readonly repo: Repository<ConfigEntity>;

  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });

    this.repo = db.repos.ConfigRepository;
  }

  public override async parse(interaction: ButtonInteraction) {
    if (!interaction.customId?.endsWith("setup-button")) return this.none();

    return this.some();
  }

  public override async run(interaction: ButtonInteraction) {
    const action = interaction.customId?.replace("-setup-button", "");

    await interaction.deferReply({ ephemeral: true });

    const config_entry = await this.repo.findOneBy({
      name: action,
    });

    const channels = interaction.guild?.channels.cache
      .filter((c) => c.type === (action.includes('forum') ? ChannelType.GuildForum : ChannelType.GuildText))
      .map((channel) => ({
        label: channel.name,
        value: channel.id,
      }));

    return await interaction.editReply({
      content: `Please select the ${action} channel:`,
      embeds: [
        new EmbedBuilder().addFields({
          name: action,
          value: `<#${config_entry?.value ?? "NULL"}>`,
        }),
      ],
      components:
        channels?.length ?? 0 > 0
          ? [...chunks(channels ?? [], 25)].map((chunk, i) => {
              return new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                  new StringSelectMenuBuilder()
                    .setCustomId(`${action}-${i}-setup-select`)
                    .addOptions(chunk)
                );
            })
          : undefined,
    });
  }
}
