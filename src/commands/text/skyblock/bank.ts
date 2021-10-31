import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { SkyblockProfile } from 'hypixel-api-v2';

import Argument from '../../../classes/Argument';
import BaseCommand from '../../../classes/BaseCommand';
import type Main from '../../../classes/Main';
import type { Message, MessageOptions } from '../../../typings';

export default class Bank extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

    this.arguments = [
      new Argument(
        'username',
        'The username of a Hypixel player',
        (a: string, { author }: Message) =>
          this.client.util.fetchSkyblockProfiles(author.id, a),
        this.client.config.messages.invalid_username_or_uuid,
        { overwrite: true, _optional: true }
      )
    ];

    this.description = 'Retrieves the SkyBlock bank statistics of a player';
  }

  public async run(
    { author, channel }: Message,
    { profiles, uuid }: { profiles: SkyblockProfile[]; uuid: string }
  ): Promise<MessageOptions | string | null> {
    const player = await this.client.hypixel.player(uuid);
    const profile = await this.client.util.selectSkyblockProfile(
      author,
      channel,
      profiles,
      player
    );

    if (profile === null) return null;

    const chart = new ChartJSNodeCanvas({ width: 900, height: 600 });

    // @ts-ignore
    chart._chartJs.defaults.color = 'white';

    let balance = profile.banking?.balance ?? 0,
      highest = -1,
      highestBalance = -1,
      highestBalanceTime = -1,
      largestWithdrawal = -1,
      largestWithdrawalTime = -1,
      largestDeposit = -1,
      largestDepositTime = -1;

    const transactions = profile.banking?.transactions?.length ?? 0;
    const data = Object.entries(
      (transactions > 0 ? profile.banking.transactions : []).reduce(
        (a, b) => {
          a[b.action].data.push({
            x: b.timestamp,
            y:
              b.action === 'WITHDRAW'
                ? (balance -= b.amount)
                : (balance += b.amount),
            r: b.amount
          });

          if (b.action === 'WITHDRAW') {
            if (b.amount > largestWithdrawal) {
              largestWithdrawal = b.amount;
              largestWithdrawalTime = b.timestamp;
            }
          } else {
            if (b.amount > largestDeposit) {
              largestDeposit = b.amount;
              largestDepositTime = b.timestamp;
            }
          }

          if (balance > highestBalance) {
            highestBalance = balance;
            highestBalanceTime = b.timestamp;
          }

          if (highest < b.amount) highest = b.amount;

          return a;
        },
        {
          WITHDRAW: {
            data: [] as { x: number; y: number; r: number }[],
            colour: '245, 37, 37'
          },
          DEPOSIT: {
            data: [] as { x: number; y: number; r: number }[],
            colour: '67, 217, 37'
          }
        }
      )
    );

    const buffer = await chart.renderToBuffer({
      type: 'bubble',
      data: {
        datasets: data.map(([label, data]) => ({
          backgroundColor: `rgba(${data.colour}, 0.5)`,
          borderColor: `rgb(${data.colour})`,
          data: data.data.map(d => ({
            x: d.x,
            y: d.y,
            r: 30 * (d.r / highest)
          })),
          label
        }))
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 20
              }
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Total Balance',
              font: {
                family: 'Courier New',
                weight: 'bold',
                size: 25
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Action Date',
              font: {
                family: 'Courier New',
                weight: 'bold',
                size: 25
              }
            },
            ticks: {
              display: false,
              // @ts-ignore
              maxTicksLimit: 7,
              font: {
                size: 20
              }
            },
            type: 'timeseries',
            time: {
              displayFormats: {
                millisecond: 'MMM D YYYY',
                second: 'MMM D YYYY',
                minute: 'MMM D YYYY',
                hour: 'MMM D YYYY',
                day: 'MMM D YYYY',
                week: 'MMM D YYYY',
                month: 'MMM D YYYY',
                quarter: 'MMM D YYYY',
                year: 'MMM D YYYY'
              }
            }
          }
        }
      }
    });

    const first =
      transactions >= 2
        ? `<t:${Math.floor(
            profile.banking.transactions[
              profile.banking.transactions.length - 1
            ].timestamp / 1000
          )}:f>`
        : '';
    const last =
      transactions >= 2
        ? `<t:${Math.floor(
            profile.banking.transactions[0].timestamp / 1000
          )}:f>`
        : '';

    return {
      embed: {
        author: {
          name: `${this.client.hutil.computeDisplayName(player)} ➢ SkyBlock ➢ ${
            profile.cute_name
          } ➢ Bank`,
          icon_url: `https://crafatar.com/avatars/${player.uuid}?overlay`
        },
        description: `There have been **${transactions}** banking transactions${
          transactions > 2 ? ` between ${first} and ${last}` : ''
        }.`,
        image: {
          url: 'attachment://bank.png'
        },
        fields: [
          {
            name: 'Highest Balance',
            value:
              highestBalance === -1
                ? 'No banking information'
                : `**$${this.client.util.formatNumber(
                    highestBalance
                  )}** (<t:${Math.floor(highestBalanceTime / 1000)}:R>)`,
            inline: true
          },
          {
            name: 'Largest Deposit',
            value:
              largestDeposit === -1
                ? 'No banking information'
                : `**$${this.client.util.formatNumber(
                    largestDeposit
                  )}** (<t:${Math.floor(largestDepositTime / 1000)}:R>)`,
            inline: true
          },
          {
            name: 'Largest Withdrawal',
            value:
              largestWithdrawal === -1
                ? 'No banking information'
                : `**$${this.client.util.formatNumber(
                    largestDeposit
                  )}** (<t:${Math.floor(largestWithdrawalTime / 1000)}:R>)`,
            inline: true
          }
        ]
      },
      files: [
        {
          attachment: buffer,
          name: 'bank.png'
        }
      ]
    };
  }
}
