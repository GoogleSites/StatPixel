import BaseCommand from '../../classes/BaseCommand';
import type Main from '../../classes/Main';
import type {
  Message,
  MessageOptions,
  UserCommandUsageEntry
} from '../../typings';

export default class Leaderboard extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('lb');
    this.description = 'Retrieves command usage within the guild';
  }

  public async run({
    author,
    guild
  }: Message): Promise<MessageOptions | string | null> {
    const leaderboard: UserCommandUsageEntry[] =
      await this.client.database.commands
        .aggregate([
          {
            $match: {
              guild_id: guild !== null ? guild.id : this.client.user!.id
            }
          },
          {
            $group: {
              _id: '$discord_id',
              uses: { $push: '$uses' }
            }
          },
          {
            $project: {
              _id: false,
              discord_id: '$_id',
              uses: {
                $reduce: {
                  input: '$uses',
                  initialValue: 0,
                  in: {
                    $add: ['$$this', '$$value']
                  }
                }
              }
            }
          },
          {
            $sort: {
              uses: -1,
              discord_id: 1
            }
          },
          {
            $limit: 10
          }
        ])
        .toArray();

    return {
      embed: {
        author: {
          name: `Leaderboard ➢ Commands`,
          icon_url:
            guild !== null
              ? guild.iconURL({ dynamic: true }) ?? undefined
              : author.displayAvatarURL({ dynamic: true })
        },
        description:
          leaderboard
            .map(
              (l, i) =>
                `\`${i + 1}\`. <@${
                  l.discord_id
                }> — **${this.client.util.formatNumber(l.uses)}**`
            )
            .join('\n') || 'No one has used any commands yet.'
      }
    };
  }
}
