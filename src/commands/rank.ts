import Argument from '../classes/Argument';
import BaseCommand from '../classes/BaseCommand';
import Canvas from '../classes/Canvas';
import type Main from '../classes/Main';
import type { Message, MessageOptions } from '../typings';
import { loadImage } from 'canvas';
import { USERNAME_REGEX } from '../utils/Util';
import { STAFF_COLOURED } from '../utils/HypixelUtil';

const MAX_WIDTH = 2000;

export default class Rank extends BaseCommand {
  constructor(id: string, client: Main) {
    super(id, client);

		this.description = 'Generate a fake Minecraft chat message with any text';

    this.arguments = [
      new Argument(
        'username',
        'A Minecraft username',
        (a: string) => USERNAME_REGEX.test(a),
        this.client.config.messages.invalid_username_or_uuid
      ),
      new Argument(
        'prefix',
        'Either a Hypixel rank or a custom prefix (colours are supported with §)',
        Argument.isPresent,
        'You did not provide a prefix.'
      ),
			new Argument(
				'text',
				'The text for the player to say',
				Argument.isPresent,
				'You did not provide text for the player to say.'
			),
			new Argument(
				'background',
				'A url to a supported image for a background',
				Argument.isPresent,
				'',
				{ optional: true }
			)
    ];
  }

  public async run(
    _: Message,
    username: string,
		prefix: string,
		text: string,
		background: string = 'https://static2.gamerantimages.com/wordpress/wp-content/uploads/2021/03/minecraft-caves-cliffs-world-generation.jpg'
  ): Promise<MessageOptions | string | null> {
		prefix = STAFF_COLOURED[prefix] ?? prefix;

		const all = `§f${prefix} ${username}§f: ${text}`;
		const image = background ? await loadImage(background).catch(() => null) : null;

    const canvas = new Canvas(1, 25, 1);
		const width = canvas.measure(all.replace(/§[0-9a-fA-Fklmnor]/g, ''), {
			font: 'Minecraft',
			size: 20
		});

		canvas.canvas.width = Math.min(width, MAX_WIDTH);

		if (image) {
			if (image.width < canvas.canvas.width) {
				const aspectRatio = image.height / image.width;

				canvas.image(image, 0, 0, canvas.canvas.width, canvas.canvas.width * aspectRatio);
			} else
				canvas.image(image, 0, 0, image.width, image.height);
		}

		canvas
			.text(all, 0, 20, {
				colour: 'white',
				font: 'Minecraft',
				size: 20,
				minecraftChatColours: true
			});

		return {
			files: [
				{
					attachment: await canvas.toBuffer(),
					name: 'forge.png'
				}
			]
		};
  }
}
