import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import {
    InteractionHandler,
    InteractionHandlerTypes,
    PieceContext,
} from "@sapphire/framework";

import type { ButtonInteraction } from "discord.js";
import { TextInputStyle } from "discord.js";

export class PrCommentHandler extends InteractionHandler {

    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (!interaction.customId?.endsWith("comment-button")) return this.none();

        return this.some();
    }

    public override async run(interaction: ButtonInteraction) {
        const pr = interaction.customId?.replace("-comment-button", "");

        /* const entity = await database.repos.PullRequestRepository.findOneBy({
            github_number: parseInt(pr)
        }); */

        await interaction.showModal(
            new ModalBuilder()
                .setCustomId(pr + "-comment-modal")
                .setTitle("Comment on PR")
                .addComponents([
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents([
                            new TextInputBuilder()
                                .setCustomId("comment-input")
                                .setLabel("Comment")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        ])
                ])
        )
    }
}
  