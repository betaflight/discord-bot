import {
  InteractionHandler,
  InteractionHandlerTypes,
  PieceContext,
} from "@sapphire/framework";
import type { StringSelectMenuInteraction } from "discord.js";

import db from "../database";
import type { Repository } from "typeorm";
import { ConfigEntity } from "../database/entities/config.entity";

export class SetupMenuHandler extends InteractionHandler {
  private readonly repo: Repository<ConfigEntity>;

  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu,
    });

    this.repo = db.repos.ConfigRepository;
  }

  public override async parse(interaction: StringSelectMenuInteraction) {
    if (!interaction.customId?.endsWith("setup-select")) return this.none();

    //await interaction.deferReply({ ephemeral: true, fetchReply: true })

    return this.some();
  }

  public override async run(interaction: StringSelectMenuInteraction) {
    const action = interaction.customId?.replace(/\-[0-9]+\-setup\-select/, "");

    let config_entry = await this.repo.findOneBy({
      name: action,
    });

    if (!config_entry) {
      config_entry = new ConfigEntity();
      config_entry.name = action;
    }

    config_entry.value = interaction.values[0];
    config_entry.guild_id = interaction.guildId ?? '';

    this.repo.save(config_entry);

    return await interaction.update({
      content: `Updated ${action} to <#${interaction.values[0]}>`,
      embeds: [],
      components: [],
    });
  }
}
