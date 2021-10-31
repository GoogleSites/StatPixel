import { loadImage } from 'canvas';
import type { Player } from 'hypixel-api-v2';

import Argument from '../../classes/Argument';
import BaseCommand from '../../classes/BaseCommand';
import Canvas from '../../classes/Canvas';
import type Main from '../../classes/Main';
import type { BridgeData, Message, MessageOptions } from '../../typings';

export default class Bridge extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

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
    const data = this.client.hutil.formatBridge(player);
    const username = this.client.hutil.computeDisplayName(player, true);
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

    const template = new Canvas(1683 + 100, 936.5 + 100, 1, {
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
      .roundImage(this.client.profile.images['background.png'], -50, -50, 1783, 1036.5, 100);

    template.ctx.shadowColor = '#000000';
    template.ctx.shadowOffsetX = -1;
    template.ctx.shadowOffsetY = 1;
    template.ctx.shadowBlur = 8;

    // All boxes
    template
      .roundRect(1683, 369, 0, 0, { radius: 50, colour: 'background' })
      .roundRect(531, 504, 0, 432.5, { radius: 50, colour: 'background' })
      .roundRect(531, 504, 576, 432.5, { radius: 50, colour: 'background' })
      .roundRect(531, 504, 1152, 432.5, { radius: 50, colour: 'background' });

    template.ctx.shadowColor = 'transparent';

    // Header box
    template
      .line(305, 220, 1600, 220, { thickness: 2, colour: 'primary' })
      .text('THE BRIDGE // OVERALL', 305, 100, {
        colour: 'tertiary',
        size: 30,
        parseColours: false
      })
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

    // Guild tag
    if (guild !== null && guild.tag) {
      const labelWidth = template.measure('BRIDGE // OVERALL', { size: 30 });
      const guildTagWidth = template.measure(guild.tag, { size: 30, font: 'Segoe UI Bold' });

      template
        .roundRect(guildTagWidth + 20, 60, labelWidth + 305 + 20, 60, { radius: 35, colour: 'primary' })
        .text(guild.tag, labelWidth + 305 + 30 + guildTagWidth / 2, 100, { colour: 'secondary', minecraftChatColours: true, size: 30, align: 'center', font: 'Segoe UI Bold' });
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
        .text('Kills:', x, 945 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('Deaths:', x, 1000 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        })
        .text('K/D:', x, 1055 - 163.5, {
          colour: 'tertiary',
          size: 36,
          parseColours: false
        });
    }

    const generate = async (labels: string[], keys: (keyof BridgeData)[]) => {
      const canvas = new Canvas(1683 + 100, 936.5 + 100, 1, {
        background: '#111111',
        primary: '#006dff',
        primary_light: 'rgba(0, 109, 255, 0.18)',
        secondary: '#ffffff',
        tertiary: '#858585'
      }, {
        offsetX: 50,
        offsetY: 50
      });

      canvas.image(template.canvas, -50, -50, 1683 + 100, 936.5 + 100);

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
          .text(this.client.util.formatNumber(data[key].kills), x, 945 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(this.client.util.formatNumber(data[key].deaths), x, 1000 - 163.5, {
            colour: 'secondary',
            size: 36,
            parseColours: false,
            align: 'right'
          })
          .text(
            this.client.util.formatNumber(data[key].kill_death_ratio),
            x,
            1055 - 163.5,
            {
              colour: 'secondary',
              size: 36,
              parseColours: false,
              align: 'right'
            }
          )
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
          .roundRect(531, 504, x, 432.5, { radius: 50, colour: 'background' })
          .text('?', x + 576 / 2 - 22.6, 809, { colour: 'tertiary', font: 'Segoe UI Bold', align: 'center', size: 300, parseColours: false });
      }

      return canvas.toBuffer();
    };

    const images = await Promise.all([
      generate(
        ['General', 'Solo', 'Doubles'],
        ['overall', 'solo', 'doubles']
      ),
      generate(
        ['2v2v2v2', '3v3v3v3', 'Fours'],
        ['four_two', 'four_three', 'fours']
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
