import {
    InteractionHandler,
    InteractionHandlerTypes,
    PieceContext,
} from "@sapphire/framework";

import { ButtonInteraction, ForumChannel, ChannelType } from "discord.js";
import type { PullRequest } from "../../types/global";
import database from "../database";
import GitHub from "../github";
import { PRService } from "../services/pr.service";

export class PrRefreshButtonHandler extends InteractionHandler {

    private readonly pr_service: PRService;
    private readonly github: GitHub;

    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button,
        });

        this.pr_service = new PRService();
        this.github = new GitHub();
    }

    public override async parse(interaction: ButtonInteraction) {
        if (!interaction.customId?.endsWith("refresh-button")) return this.none();

        return this.some();
    }

    public override async run(interaction: ButtonInteraction) {
        const pr = interaction.customId?.replace("-refresh-button", "");
        
        const entity = await database.repos.PullRequestRepository.findOneBy({
            github_number: parseInt(pr)
        });

        await interaction.deferReply({
            ephemeral: true,
        })

        if (entity && interaction.channel?.type === ChannelType.PublicThread) {
            const gh_pr = (await this.github.getPullRequest(entity.repo_name, parseInt(pr))).data as PullRequest;

            await this.pr_service.process(gh_pr, entity.repo_name, interaction.channel.parent as ForumChannel);

            return await interaction.editReply({
                content: 'Refreshed PR',
            })
        }

        return await interaction.editReply({
            content: 'Something went wrong',
        })
    }
}
