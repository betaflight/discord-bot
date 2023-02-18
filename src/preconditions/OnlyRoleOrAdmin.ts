import { Precondition } from "@sapphire/framework";
import {
    CommandInteraction,
    PermissionFlagsBits,
    Message,
    GuildMember,
} from "discord.js";

import env from "../config/env";

export class OnlyRoleOrAdminPrecondition extends Precondition {
    #message = "This command can only be used by admins or configured roles.";

    public override async chatInputRun(interaction: CommandInteraction) {
    // for slash command
        const user = await interaction.guild?.members.fetch(interaction.user.id);
        return this.checkRole(user);
    }

    public override async messageRun(message: Message) {
        const user = await message.guild?.members.fetch(message.author.id);
        // for normal command
        return this.checkRole(user);
    }

    private async checkRole(user?: GuildMember) {
        if (!user) return this.error();
        // check if user has role
        if (
            user.permissions.has(PermissionFlagsBits.Administrator) ||
      user.roles.cache.some((r) => env.roles.includes(r.id))
        ) {
            return this.ok();
        }
        // if (hasRole) return this.ok();
        return this.error({ message: this.#message });
    }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OnlyRoleOrAdmin: never;
  }
}
