import {
    InteractionHandler,
    InteractionHandlerTypes,
    PieceContext,
} from "@sapphire/framework";

import type { ModalSubmitInteraction, ThreadChannel } from "discord.js";
import database from "../database";
import GitHub from "../github";
import { PRService } from "../services/pr.service";

export class PrCommentSubmitHandler extends InteractionHandler {

    private readonly github: GitHub;
    private readonly pr_service: PRService;

    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
        });

        this.github = new GitHub();
        this.pr_service = new PRService();
    }

    public override async parse(interaction: ModalSubmitInteraction) {
        if (!interaction.customId?.endsWith("comment-modal")) return this.none();

        return this.some();
    }

    public override async run(interaction: ModalSubmitInteraction) {
        const pr = interaction.customId?.replace("-comment-modal", "");
        
        const body = interaction.fields.getTextInputValue("comment-input");

        const entity = await database.repos.PullRequestRepository.findOneBy({
            github_number: parseInt(pr)
        });

        const thread = await interaction.guild?.channels.fetch(entity!.forum_thread_id) as ThreadChannel;

        if (!entity) {
            return await interaction.reply({
                ephemeral: true,
                content: 'Could not find PR'
            })
        }

        const comment = await this.github.addComment(entity.repo_name, parseInt(pr), body, interaction.user);

        await this.pr_service.processComments(thread, parseInt(pr));

        return await interaction.reply({
            ephemeral: true,
            content: 'Comment added: ' + comment.data.html_url,
        })
    }
}
