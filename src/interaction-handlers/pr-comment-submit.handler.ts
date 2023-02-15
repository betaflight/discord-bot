import {
    InteractionHandler,
    InteractionHandlerTypes,
    PieceContext,
} from "@sapphire/framework";

import type { ModalSubmitInteraction } from "discord.js";
import database from "../database";
import GitHub from "../github";

export class PrCommentSubmitHandler extends InteractionHandler {

    private readonly github: GitHub;

    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
        });

        this.github = new GitHub();
    }

    public override async parse(interaction: ModalSubmitInteraction) {
        if (!interaction.customId?.endsWith("comment-modal")) return this.none();

        return this.some();
    }

    public override async run(interaction: ModalSubmitInteraction) {
        const pr = interaction.customId?.replace("-comment-modal", "");
        console.log(interaction.fields);
        const body = interaction.fields.getTextInputValue("comment-input");

        const entity = await database.repos.PullRequestRepository.findOneBy({
            github_number: parseInt(pr)
        });

        if (!entity) {
            return await interaction.reply({
                ephemeral: true,
                content: 'Could not find PR'
            })
        }

        const comment = await this.github.addComment(entity.repo_name, parseInt(pr), body, interaction.user);

        return await interaction.reply({
            ephemeral: true,
            content: 'Comment added: ' + comment.data.url,
        })
    }
}
