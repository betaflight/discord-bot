import {
    InteractionHandler,
    InteractionHandlerTypes,
    PieceContext,
} from "@sapphire/framework";

import type { ButtonInteraction } from "discord.js";

export class PrButtonHandler extends InteractionHandler {

    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (!interaction.customId?.endsWith("pr-button")) return this.none();

        return this.some();
    }

    public override async run(interaction: ButtonInteraction) {
        const pr = interaction.customId?.replace("-pr-button", "");

        await interaction.reply({
            ephemeral: true,
            content: pr,
        })
    }
}
