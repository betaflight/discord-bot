import { Listener } from '@sapphire/framework';
import type { User, Message} from 'discord.js';
import database from '../database';

export class ReactionListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'messageReactionAdd'
        });
    }

    public async run(_: Message, user: User) {
        if (user.id === '658824656194895952') {
            const entity = await database.repos.ReactionCounterRepository.findOneBy({
                user_id: user.id,
            })
            if (entity) {
                entity.counter++;
                await database.manager.save(entity);
            }
        }
    }
}