import { loadImage } from 'canvas';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import Canvas from '../../classes/Canvas';
import type Main from '../../classes/Main';
import type { BedWarsData, Message, MessageOptions } from '../../typings';

export default class BedWars extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.aliases.push('bw');
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
    const data = this.client.hutil.formatBedWars(player);
    const username = `${this.client.hutil.computeBedWarsLevelDisplay(data.overall.level)} ${this.client.hutil.computeDisplayName(player, true)}`;
    const level = this.client.hutil.calculateNetworkLevelProgress(
      player.networkExp
    );
    const bedwars = this.client.hutil.calculateBedWarsLevelProgress(data.overall.experience);

    const [head, guild] = await Promise.all([
      loadImage(
        `https://crafatar.com/avatars/${player.uuid}?overlay&size=220`
      ).catch(() => null),
      this.client.hypixel
        .guild(player.uuid, 'player')
        .catch(() => null)
    ]);

    const template = new Canvas(1683 + 100, 936.5 + 240, 1, {
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
      .roundImage(this.client.profile.images['background.png'], -50, -50, 1783, 1036.5 + 140, 100);

    template.ctx.shadowColor = '#000000';
    template.ctx.shadowOffsetX = -1;
    template.ctx.shadowOffsetY = 1;
    template.ctx.shadowBlur = 8;

    // All boxes
    template
      .roundRect(1683, 369, 0, 0, { radius: 50, colour: 'background' })
      .roundRect(531, 644, 0, 432.5, { radius: 50, colour: 'background' })
      .roundRect(531, 644, 576, 432.5, { radius: 50, colour: 'background' })
      .roundRect(531, 644, 1152, 432.5, { radius: 50, colour: 'background' });

    template.ctx.shadowColor = 'transparent';

    // Header box
    template
      .line(305, 220, 1600, 220, { thickness: 2, colour: 'primary' })
      .progressCircle(160, 184.5, level.progress, {
        radius: 110,
        outline: 'primary',
        empty: 'primary_light',
        thickness: 20,
        colour: '#23272a'
      })
      .text('BEDWARS // OVERALL', 305, 100, {
        colour: 'tertiary',
        size: 30,
        parseColours: false
      });

    // Guild tag
    if (guild !== null && guild.tag) {
      const labelWidth = template.measure('BEDWARS // OVERALL', { size: 30 });
      const guildTagWidth = template.measure(guild.tag, { size: 30, font: 'Segoe UI Bold' });

      template
        .roundRect(guildTagWidth + 20, 60, labelWidth + 305 + 20, 60, { radius: 35, colour: 'primary' })
        .text(guild.tag, labelWidth + 305 + 30 + guildTagWidth / 2, 100, { colour: 'secondary', minecraftChatColours: true, size: 30, align: 'center', font: 'Segoe UI Bold' });
    }

    template
      .circularImage(head, 160, 184.5, 110);

    template
      .text(username, 305, 180, {
        colour: 'secondary',
        font: 'Segoe UI Bold',
        size: 60,
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
      })
      .roundRect(135, 36, 316, 246, { radius: 10, colour: 'primary' })
      .text(`${bedwars.level} STARS`, 383.5, 271, { colour: 'secondary', size: 22, parseColours: false, align: 'center', font: 'Segoe UI Bold' })
      .text(`$[secondary:${this.client.util.formatNumber(bedwars.current, 1)} $]$[tertiary:17:XP $]$[secondary:/ ${this.client.util.formatNumber(bedwars.required, 1)} $]$[tertiary:17:XP$]`, 461.5, 272, { colour: 'secondary', size: 24, font: 'Segoe UI Bold' })
      .roundRect(757, 10, 316, 306.5, { radius: 5, colour: 'rgba(0, 109, 255, 0.18)' })
      .roundRect(757 * bedwars.progress, 10.5, 316, 306.5, { radius: 5.25, colour: 'primary' });

    {
      const coins = this.client.util.formatNumber(data.overall.coins);
      const beds = this.client.util.formatNumber(data.overall.beds_broken);

      const coinsWidth = template.measure(coins, { size: 36, font: 'Segoe UI Bold' });
      const bedsWidth = template.measure(beds, { size: 36, font: 'Segoe UI Bold' });

      template
        .text(`§6${coins}`, 1150, 301, { size: 36, minecraftChatColours: true, font: 'Segoe UI Bold' })
        .image(this.client.profile.images['coin.svg'], 1155 + coinsWidth, 270, 36, 36)
        .text(`§c${beds}`, 1250 + coinsWidth, 301, { size: 36, minecraftChatColours: true, font: 'Segoe UI Bold' })
        .image(this.client.profile.images['bed.png'], 1255 + coinsWidth + bedsWidth, 270, 36, 36);
    }

    // Three bottom boxes
    template
      .line(50, 526.5, 481, 526.5, { thickness: 3, colour: 'primary' })
      .line(626, 526.5, 1057, 526.5, { thickness: 3, colour: 'primary' })
      .line(1202, 526.5, 1633, 526.5, { thickness: 3, colour: 'primary' });

    for (let i = 0; i < 3; ++i) {
      const x = 50 + 576 * i;

      template
        .text('Wins:', x, 750 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Losses:', x, 805 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('W/L:', x, 860 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('F. Kills:', x, 945 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('F. Deaths:', x, 1000 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('F. K/D:', x, 1055 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Clutch %:', x, 1140 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Winstreak:', x, 1195 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        });
    }

    const generate = async (labels: string[], keys: (keyof BedWarsData)[]) => {
      const canvas = new Canvas(1683 + 100, 936.5 + 240, 1, {
        background: '#111111',
        primary: '#006dff',
        primary_light: 'rgba(0, 109, 255, 0.18)',
        secondary: '#ffffff',
        tertiary: '#858585'
      }, {
        offsetX: 50,
        offsetY: 50
      });

      canvas.image(template.canvas, -50, -50, 1683 + 100, 936.5 + 240);

      for (const [i, key] of keys.entries()) {
        const x = 481 + 576 * i;

        canvas
          .text(this.client.util.formatNumber(data[key].wins), x, 750 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(this.client.util.formatNumber(data[key].losses), x, 805 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(
            this.client.util.formatNumber(data[key].win_loss_ratio),
            x,
            860 - 163.5,
            {
              colour: 'secondary',
              size: 36,
              parseColours: false,
              align: 'right'
            }
          )
          .text(this.client.util.formatNumber(data[key].final_kills), x, 945 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(this.client.util.formatNumber(data[key].final_deaths), x, 1000 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(
            this.client.util.formatNumber(data[key].final_kill_death_ratio),
            x,
            1055 - 163.5,
            {
              colour: 'secondary',
              size: 36,
              parseColours: false,
              align: 'right'
            }
          )
          .text(`${this.client.util.formatNumber(data[key].clutch_rate * 100)}%`, x, 1140 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(this.client.util.formatNumber(data[key].winstreak), x, 1195 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(labels[i], 265.5 + 576 * i, 660 - 163.5, {
            colour: 'secondary',
            size: 38,
            align: 'center',
            parseColours: false
          });
      }

      for (let i = keys.length; i < 3; ++i) {
        const x = 576 * i;

        canvas
          .roundRect(531, 644, x, 432.5, { radius: 50, colour: 'background' })
          .text('?', x + 576 / 2 - 22.6, 849, { colour: 'tertiary', font: 'Segoe UI Bold', align: 'center', size: 300, parseColours: false });
      }

      return canvas.toBuffer();
    };

    const images = await Promise.all([
      generate(
        ['General', 'Solo', 'Doubles'],
        ['overall', 'eight_one', 'eight_two']
      ),
      generate(
        ['Threes', 'Fours', '4v4'],
        ['four_three', 'four_four', 'two_four']
      ),
      generate(
        ['Armed', 'Ultimate', 'Rush'],
        ['armed', 'ultimate', 'rush']
      ),
      generate(
        ['Castle'],
        ['castle']
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
