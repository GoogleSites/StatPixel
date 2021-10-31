import { loadImage } from 'canvas';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import Canvas from '../../classes/Canvas';
import type Main from '../../classes/Main';
import type { DuelsData, Message, MessageOptions } from '../../typings';

export default class Duels extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('duel');
    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchHypixelProfile(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      ),
      new Argument(
        'page',
        'The page to skip to',
        Argument.isPositiveInteger,
        '', {
          optional: true, overwrite: true
        }
      )
    ];
  }

  public async run(
    { channel, author, id }: Message,
    player: Player,
    page = 1
  ): Promise<MessageOptions | string | null> {
    const data = this.client.hutil.formatDuels(player);
    const username = this.client.hutil.computeDisplayName(player, true);
    const title = this.client.hutil.computeDuelsTitle(player, true);
    const level = this.client.hutil.calculateNetworkLevelProgress(
      player.networkExp
    );

    const [head, guild] = await Promise.all([
      loadImage(
        `https://crafatar.com/avatars/${player.uuid}?overlay&size=220`
      ).catch(() => null),
      this.client.hypixel
        .guild(player.uuid, 'player')
        .catch(() => null)
    ]);

    const template = new Canvas(1683 + 100, 1100 + 100, 1, {
      background: '#111111',
      primary: '#006dff',
      primary_light: 'rgba(0, 109, 255, 0.18)',
      secondary: '#ffffff',
      tertiary: '#858585'
    }, {
      offsetX: 50,
      offsetY: 50
    });

    template
      .roundImage(this.client.profile.images['background.png'], -50, -50, 1783, 1200, 100);

    template.ctx.shadowColor = '#000000';
    template.ctx.shadowOffsetX = -1;
    template.ctx.shadowOffsetY = 1;
    template.ctx.shadowBlur = 8;

    // All boxes
    template
      .roundRect(1683, 369, 0, 0, { radius: 50, colour: 'background' })
      .roundRect(1683, 100, 0, 432.5, { radius: 25, colour: 'background' })
      .roundRect(531, 504, 0, 596, { radius: 50, colour: 'background' })
      .roundRect(531, 504, 576, 596, { radius: 50, colour: 'background' })
      .roundRect(531, 504, 1152, 596, { radius: 50, colour: 'background' });

    template.ctx.shadowColor = 'transparent';

    // Header box
    template
      .line(305, 220, 1600, 220, { thickness: 2, colour: 'primary' })
      .text('DUELS // OVERALL', 305, 100, {
        colour: 'tertiary',
        size: 30,
        parseColours: false
      })
      .text(
        `Winstreak: ${this.client.util.formatNumber(data.overall.winstreak)}`,
        305,
        300,
        { colour: 'secondary', size: 36, parseColours: false }
      )
      .text(
        `Best Winstreak: ${this.client.util.formatNumber(
          data.overall.best_winstreak
        )}`,
        550,
        300,
        { colour: 'tertiary', size: 36, parseColours: false }
      )
      .progressCircle(160, 184.5, level.progress, {
        radius: 110,
        outline: 'primary',
        empty: 'primary_light',
        thickness: 20,
        colour: '#23272a'
      });

    template
      .circularImage(head, 160, 184.5, 110);

    template
      .text(username, 305, 185, {
        colour: 'secondary',
        font: 'Segoe UI Bold',
        size: 90,
        minecraftChatColours: true
      })
      .roundRect(112.87, 63.61, 103.565, 260, { radius: 20, colour: 'primary' })
      .text('LEVEL', 160, 285, {
        colour: 'secondary',
        font: 'Segoe UI Bold',
        size: 18.35,
        align: 'center',
        parseColours: false
      })
      .text(level.current.toString(), 160, 312, {
        colour: 'secondary',
        font: 'Segoe UI Bold',
        size: 27.53,
        align: 'center',
        parseColours: false
      });

    if (title !== null) {
      const plain = this.client.hutil.computeDuelsTitle(player)!;

      template
        .strokeText(plain, 1599, 301, { size: 36, align: 'right', colour: 'secondary', width: 2, parseColours: false })
        .text(title, 1600, 300, { size: 36, align: 'right', minecraftChatColours: true });
    }

    // Guild tag
    if (guild !== null && guild.tag) {
      const labelWidth = template.measure('DUELS // OVERALL', { size: 30 });
      const guildTagWidth = template.measure(guild.tag, { size: 30, font: 'Segoe UI Bold' });

      template
        .roundRect(guildTagWidth + 20, 60, labelWidth + 305 + 20, 60, { radius: 35, colour: 'primary' })
        .text(guild.tag, labelWidth + 305 + 30 + guildTagWidth / 2, 100, { colour: 'secondary', minecraftChatColours: true, size: 30, align: 'center', font: 'Segoe UI Bold' });
    }

    // Long horizontal box
    template
      .line(561, 445, 561, 520, { thickness: 3, colour: 'primary' })
      .line(1122, 445, 1122, 520, { thickness: 3, colour: 'primary' })
      .text(
        `$[secondary:Melee Accuracy: $]$[primary:${this.client.util.formatNumber(
          data.overall.melee_accuracy
        )}%$]`,
        280.5,
        495.5,
        { colour: 'secondary', size: 36, align: 'center' }
      )
      .text(
        `$[secondary:Games: $]$[primary:${this.client.util.formatNumber(
          data.overall.games_played
        )}$]`,
        841.5,
        495.5,
        { colour: 'secondary', size: 36, align: 'center' }
      )
      .text(
        `$[secondary:Blocks Placed: $]$[primary:${this.client.util.formatNumber(
          data.overall.blocks_placed
        )}$]`,
        1402.5,
        495.5,
        { colour: 'secondary', size: 36, align: 'center' }
      );

    // Three bottom boxes
    template
      .line(50, 690, 481, 690, { thickness: 3, colour: 'primary' })
      .line(626, 690, 1057, 690, { thickness: 3, colour: 'primary' })
      .line(1202, 690, 1633, 690, { thickness: 3, colour: 'primary' });

    for (let i = 0; i < 3; ++i) {
      const x = 50 + 576 * i;

      template
        .text('Wins:', x, 750, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Losses:', x, 805, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('W/L:', x, 860, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Kills:', x, 945, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Deaths:', x, 1000, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('K/D:', x, 1055, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        });
    }

    const generate = async (labels: string[], keys: (keyof DuelsData)[]) => {
      const canvas = new Canvas(1683 + 100, 1100 + 100, 1, {
        background: '#111111',
        primary: '#006dff',
        primary_light: 'rgba(0, 109, 255, 0.18)',
        secondary: '#ffffff',
        tertiary: '#858585'
      }, {
        offsetX: 50,
        offsetY: 50
      });

      canvas.image(template.canvas, -50, -50, 1683 + 100, 1100 + 100);

      for (const [i, key] of keys.entries()) {
        const x = 481 + 576 * i;

        canvas
          .text(this.client.util.formatNumber(data[key].wins), x, 750, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(this.client.util.formatNumber(data[key].losses), x, 805, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(
            this.client.util.formatNumber(data[key].win_loss_ratio),
            x,
            860,
            {
              colour: 'secondary',
              size: 36,
              parseColours: false,
              align: 'right'
            }
          )
          .text(this.client.util.formatNumber(data[key].kills), x, 945, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(this.client.util.formatNumber(data[key].deaths), x, 1000, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(
            this.client.util.formatNumber(data[key].kill_death_ratio),
            x,
            1055,
            {
              colour: 'secondary',
              size: 36,
              parseColours: false,
              align: 'right'
            }
          )
          .text(labels[i], 265.5 + 576 * i, 660, {
            colour: 'secondary',
            size: 38,
            align: 'center',
            parseColours: false
          });
      }

      for (let i = keys.length; i < 3; ++i) {
        const x = 576 * i;

        canvas
          .roundRect(531, 504, x, 432.5, { radius: 50, colour: 'background' })
          .text('?', x + 576 / 2 - 22.6, 809, { colour: 'tertiary', font: 'Segoe UI Bold', align: 'center', size: 300, parseColours: false });
      }

      return canvas.toBuffer();
    };

    const images = await Promise.all([
      generate(
        ['General', 'Solo UHC', 'Doubles UHC'],
        ['overall', 'solo_uhc', 'doubles_uhc']
      ),
      generate(
        ['Solo SkyWars', 'Doubles SkyWars', 'Solo Mega Walls'],
        ['solo_skywars', 'doubles_skywars', 'solo_mega_walls']
      ),
      generate(
        ['Doubles Mega Walls', 'Solo Combo', 'Doubles Combo'],
        ['doubles_mega_walls', 'solo_combo', 'doubles_combo']
      ),
      generate(
        ['Solo NoDebuff', 'Doubles NoDebuff', 'Solo Classic'],
        ['solo_no_debuff', 'doubles_no_debuff', 'solo_classic']
      ),
      generate(
        ['Doubles Classic', 'Solo Bow', 'Doubles Bow'],
        ['doubles_classic', 'solo_bow', 'doubles_bow']
      ),
      generate(
        ['Solo OP', 'Doubles OP', 'Solo BowSpleef'],
        ['solo_op', 'doubles_op', 'solo_bowspleef']
      ),
      generate(
        ['Solo Sumo', 'SkyWars Tournament', 'OP Tournament'],
        ['solo_sumo', 'skywars_tournament', 'op_tournament']
      )
    ]);

    this.client.util.imageScroller(
      channel,
      author,
      images,
      i => `You are on page #${i + 1} of ${images.length}`,
      {
        reply: id,
        page: page - 1
      }
    );

    return null;
  }
}
