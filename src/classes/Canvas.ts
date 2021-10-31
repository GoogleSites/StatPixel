import path from 'path';

import type {
  CanvasRenderingContext2D,
  Canvas as HTMLCanvas,
  Image
} from 'canvas';
import { createCanvas, registerFont } from 'canvas';

import { CHAR_TO_HEX } from '../utils/HypixelUtil';

registerFont(path.join(__dirname, '..', 'fonts', 'Segoe UI.ttf'), {
  family: 'Segoe UI'
});
registerFont(path.join(__dirname, '..', 'fonts', 'Segoe UI Bold.ttf'), {
  family: 'Segoe UI Bold'
});
registerFont(path.join(__dirname, '..', 'fonts', 'Minecraft.ttf'), {
  family: 'Minecraft'
});

export default class Canvas {
  public quality: number;
  public canvas: HTMLCanvas;
  public ctx: CanvasRenderingContext2D;
  public palette: { [key: string]: string };
  public offsetX: number;
  public offsetY: number;

  constructor(
    width: number,
    height: number,
    quality: number = 1,
    palette: { [key: string]: string } = {},
    settings?: {
      offsetX?: number;
      offsetY?: number;
    }
  ) {
    this.quality = quality;
    this.canvas = createCanvas(width * this.quality, height * this.quality);
    this.ctx = this.canvas.getContext('2d');
    this.palette = palette;
    this.offsetX = (settings?.offsetX ?? 0) * this.quality;
    this.offsetY = (settings?.offsetY ?? 0) * this.quality;

    const fill = this.ctx.fillText.bind(this.ctx);

    this.ctx.fillText = (text: string, x: number, y: number, maxWidth?: number) => {
      if (text)
        fill(text, x, y, maxWidth);
    }
  }

  private getColour(colour: string): string;
  private getColour<T>(colour?: T): T;
  private getColour(colour?: string) {
    if (typeof colour !== 'string') return colour;

    return this.palette[colour] ?? colour;
  }

  public rect(
    width: number,
    height: number,
    x: number,
    y: number,
    {
      colour = '#ffffff'
    }: {
      radius?: number | { tl: number; tr: number; br: number; bl: number };
      colour?: string;
    }
  ) {
    colour = this.getColour(colour);

    x *= this.quality;
    y *= this.quality;
    width *= this.quality;
    height *= this.quality;

    const oldFill = this.ctx.fillStyle;

    this.ctx.fillStyle = colour;
    this.ctx.fillRect(x + this.offsetX, y + this.offsetY, width, height);
    this.ctx.fillStyle = oldFill;

    return this;
  }

  public line(
    originX: number,
    originY: number,
    targetX: number,
    targetY: number,
    {
      thickness = 1,
      colour = 'primary'
    }: {
      thickness: number;
      colour: string;
    }
  ) {
    const oldStroke = this.ctx.strokeStyle;
    const oldThickness = this.ctx.lineWidth;

    this.ctx.strokeStyle = this.getColour(colour);
    this.ctx.lineWidth = thickness * this.quality;

    this.ctx.beginPath();
    this.ctx.moveTo(originX + this.offsetX, originY + this.offsetY);
    this.ctx.lineTo(targetX + this.offsetX, targetY + this.offsetY);
    this.ctx.stroke();

    this.ctx.strokeStyle = oldStroke;
    this.ctx.lineWidth = oldThickness;

    return this;
  }

  public roundRect(
    width: number,
    height: number,
    x: number,
    y: number,
    {
      radius = 5,
      colour = '#ffffff'
    }: {
      radius?: number | { tl: number; tr: number; br: number; bl: number };
      colour?: string;
    }
  ) {
    colour = this.getColour(colour);

    x *= this.quality;
    y *= this.quality;
    width *= this.quality;
    height *= this.quality;

    if (typeof radius === 'number') {
      radius *= this.quality;
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius.tl *= this.quality;
      radius.tr *= this.quality;
      radius.br *= this.quality;
      radius.bl *= this.quality;
    }

    const oldFill = this.ctx.fillStyle;

    this.ctx.beginPath();
    this.ctx.moveTo(x + this.offsetX + radius.tl, y + this.offsetY);
    this.ctx.lineTo(x + this.offsetX + width - radius.tr, y + this.offsetY);
    this.ctx.quadraticCurveTo(x + width + this.offsetX, y + this.offsetY, x + width + this.offsetX, y + radius.tr + this.offsetY);
    this.ctx.lineTo(x + width + this.offsetX, y + height - radius.br + this.offsetY);
    this.ctx.quadraticCurveTo(
      x + width + this.offsetX,
      y + height + this.offsetY,
      x + width - radius.br + this.offsetX,
      y + height + this.offsetY
    );
    this.ctx.lineTo(x + radius.bl + this.offsetX, y + height + this.offsetY);
    this.ctx.quadraticCurveTo(x + this.offsetX, y + height + this.offsetY, x + this.offsetX, y + height - radius.bl + this.offsetY);
    this.ctx.lineTo(x + this.offsetX, y + radius.tl + this.offsetY);
    this.ctx.quadraticCurveTo(x + this.offsetX, y + this.offsetY, x + radius.tl + this.offsetX, y + this.offsetY);
    this.ctx.closePath();

    this.ctx.fillStyle = colour;
    this.ctx.fill();
    this.ctx.fillStyle = oldFill;

    return this;
  }

  public progressCircle(
    x: number,
    y: number,
    progress: number,
    {
      radius = 5,
      outline = '#ffffff',
      colour,
      empty = '#ff0000',
      thickness = 1
    }: {
      radius?: number;
      outline?: string;
      empty?: string;
      thickness?: number;
      colour?: string;
    }
  ) {
    colour = this.getColour(colour);
    empty = this.getColour(empty);
    outline = this.getColour(outline);
    thickness *= this.quality;

    const oldStroke = this.ctx.strokeStyle;
    const oldThickness = this.ctx.lineWidth;

    this.ctx.lineWidth = thickness;
    this.ctx.strokeStyle = outline;

    if (progress === 0) {
      this.circle(x, y, { radius, colour, thickness, outline: empty });
    } else if (progress === 1) {
      this.circle(x, y, { radius, colour, thickness, outline });
    } else {
      this.ctx.beginPath();
      this.ctx.arc(
        x * this.quality + this.offsetX,
        y * this.quality + this.offsetY,
        radius * this.quality,
        -Math.PI / 2,
        Math.PI * 2 * progress - Math.PI / 2,
        false
      );
      this.ctx.stroke();
      this.ctx.strokeStyle = empty;

      this.ctx.beginPath();
      this.ctx.arc(
        x * this.quality + this.offsetX,
        y * this.quality + this.offsetY,
        radius * this.quality,
        -Math.PI / 2,
        Math.PI * 2 * progress - Math.PI / 2,
        true
      );
      this.ctx.stroke();

      if (colour) {
        this.circle(x, y, { radius, colour });
      }
    }

    this.ctx.strokeStyle = oldStroke;
    this.ctx.lineWidth = oldThickness;
    this.ctx.lineWidth = oldThickness;

    return this;
  }

  public circle(
    x: number,
    y: number,
    {
      radius = 5,
      colour = '#ffffff',
      outline = null,
      thickness = 1
    }: {
      radius?: number;
      colour?: string | null;
      outline?: string | null;
      thickness?: number;
    }
  ) {
    colour = this.getColour(colour);
    outline = this.getColour(outline);

    const oldFill = this.ctx.fillStyle;
    const oldStroke = this.ctx.strokeStyle;
    const oldThickness = this.ctx.lineWidth;

    this.ctx.beginPath();
    this.ctx.arc(
      x * this.quality + this.offsetX,
      y * this.quality + this.offsetY,
      radius * this.quality,
      0,
      2 * Math.PI
    );

    if (colour) {
      this.ctx.fillStyle = colour;
      this.ctx.fill();
      this.ctx.fillStyle = oldFill;
    }

    if (outline) {
      this.ctx.strokeStyle = outline;
      this.ctx.lineWidth = thickness * this.quality;
      this.ctx.stroke();
      this.ctx.strokeStyle = oldStroke;
      this.ctx.lineWidth = oldThickness;
    }

    return this;
  }

  public strokeText(
    text: string,
    x: number,
    y: number,
    {
      colour = '#ffffff',
      font = 'Segoe UI',
      size = 14,
      align = 'left',
      minecraftChatColours = false,
      parseColours = true,
      width = 1
    }: {
      colour?: string;
      font?: string;
      size?: number;
      align?: CanvasTextAlign;
      minecraftChatColours?: boolean;
      parseColours?: boolean;
      width?: number;
    }
  ) {
    colour = this.getColour(colour);

    const oldFont = this.ctx.font;
    const oldStroke = this.ctx.strokeStyle;
    const oldAlign = this.ctx.textAlign;
    const oldWidth = this.ctx.lineWidth;

    size *= this.quality;
    x *= this.quality;
    y *= this.quality;

    this.ctx.textAlign = align;
    this.ctx.font = `${size}px ${font}`;
    this.ctx.lineWidth = width;

    if (minecraftChatColours) {
      const matches = text.matchAll(/(?:§(\w))?([^§]*)/g);

      let length = x;

      if (align === 'center' || align === 'right') {
        this.ctx.textAlign = 'left';

        const matches = text.matchAll(/(?:§(\w))?([^§]*)/g);
        let totalWidth = 0;

        for (const [,, text] of matches) {  
          totalWidth += this.ctx.measureText(text).width;
        }

        length -= align === 'right' ? totalWidth : totalWidth / 2;
      }

      for (const [, innerColour, text] of matches) {
        this.ctx.fillStyle = innerColour ? CHAR_TO_HEX[innerColour] : colour;
        this.ctx.strokeText(text, length + this.offsetX, y + this.offsetY);

        length += this.ctx.measureText(text).width;
      }
    } else if (parseColours) {
      const matches = text.matchAll(
        /\$\[([^:]+)(?::(\d+))?:([\s\S]+?)(?<!\\)\$\]/g
      );

      let nextIndex = 0,
        length = x;

      if (align === 'center') {
        this.ctx.textAlign = 'left';

        const matches = text.matchAll(
          /\$\[([^:]+)(?::(\d+))?:([\s\S]+?)(?<!\\)\$\]/g
        );

        let totalWidth = 0,
          nextIndex = 0;

        for (const { 1: fontColour, 2: fontSize, 3: text } of matches) {
          this.ctx.strokeStyle = colour;
          this.ctx.font = `${size}px ${font}`;

          if (fontSize)
            this.ctx.font = `${parseInt(fontSize) * this.quality}px ${font}`;

          this.ctx.strokeStyle = this.getColour(fontColour);
          nextIndex += text.length;
          totalWidth += this.ctx.measureText(text).width;
        }

        if (nextIndex !== text.length) {
          this.ctx.strokeStyle = colour;
          this.ctx.font = `${size}px ${font}`;

          // totalWidth += this.ctx.measureText(text.slice(nextIndex)).width;
        }

        length -= totalWidth / 2;
      }

      for (const { 1: fontColour, 2: fontSize, 3: text } of matches) {
        this.ctx.strokeStyle = colour;
        this.ctx.font = `${size}px ${font}`;

        if (fontSize)
          this.ctx.font = `${parseInt(fontSize) * this.quality}px ${font}`;

        this.ctx.strokeStyle = this.getColour(fontColour);
        this.ctx.strokeText(text, length + this.offsetX, y + this.offsetY);

        nextIndex += text.length;
        length += this.ctx.measureText(text).width;
      }

      if (nextIndex !== text.length) {
        this.ctx.strokeStyle = colour;
        this.ctx.font = `${size}px ${font}`;

        // this.ctx.strokeText(text.slice(nextIndex), length, y);
      }
    } else {
      this.ctx.strokeStyle = colour;
      this.ctx.strokeText(text, x + this.offsetX, y + this.offsetY);
    }

    this.ctx.font = oldFont;
    this.ctx.strokeStyle = oldStroke;
    this.ctx.textAlign = oldAlign;
    this.ctx.lineWidth = oldWidth;

    return this;
  }

  public text(
    text: string,
    x: number,
    y: number,
    {
      colour = '#ffffff',
      font = 'Segoe UI',
      size = 14,
      align = 'left',
      minecraftChatColours = false,
      parseColours = true
    }: {
      colour?: string;
      font?: string;
      size?: number;
      align?: CanvasTextAlign;
      minecraftChatColours?: boolean;
      parseColours?: boolean;
    }
  ) {
    colour = this.getColour(colour);

    const oldFont = this.ctx.font;
    const oldStyle = this.ctx.fillStyle;
    const oldAlign = this.ctx.textAlign;

    size *= this.quality;
    x *= this.quality;
    y *= this.quality;

    this.ctx.textAlign = align;
    this.ctx.font = `${size}px ${font}`;

    if (minecraftChatColours) {
      const matches = text.matchAll(/(?:§(\w))?([^§]*)/g);

      let length = x;

      if (align === 'center' || align === 'right') {
        this.ctx.textAlign = 'left';

        const matches = text.matchAll(/(?:§(\w))?([^§]*)/g);
        let totalWidth = 0;

        for (const [,, text] of matches) {  
          totalWidth += this.ctx.measureText(text).width;
        }

        length -= align === 'right' ? totalWidth : totalWidth / 2;
      }

      for (const [, innerColour, text] of matches) {
        this.ctx.fillStyle = innerColour ? CHAR_TO_HEX[innerColour] : colour;
        this.ctx.fillText(text, length + this.offsetX, y + this.offsetY);

        length += this.ctx.measureText(text).width;
      }
    } else if (parseColours) {
      const matches = text.matchAll(
        /\$\[([^:]+)(?::(\d+))?:([\s\S]+?)(?<!\\)\$\]/g
      );

      let length = x;

      if (align === 'center') {
        this.ctx.textAlign = 'left';

        const matches = text.matchAll(
          /\$\[([^:]+)(?::(\d+))?:([\s\S]+?)(?<!\\)\$\]/g
        );

        let totalWidth = 0;

        for (const { 1: fontColour, 2: fontSize, 3: text } of matches) {
          this.ctx.fillStyle = colour;
          this.ctx.font = `${size}px ${font}`;

          if (fontSize)
            this.ctx.font = `${parseInt(fontSize) * this.quality}px ${font}`;

          this.ctx.fillStyle = this.getColour(fontColour);
          totalWidth += this.ctx.measureText(text).width;
        }

        length -= totalWidth / 2;
      }

      for (const { 1: fontColour, 2: fontSize, 3: text } of matches) {
        this.ctx.fillStyle = colour;
        this.ctx.font = `${size}px ${font}`;

        if (fontSize)
          this.ctx.font = `${parseInt(fontSize) * this.quality}px ${font}`;

        this.ctx.fillStyle = this.getColour(fontColour);
        this.ctx.fillText(text, length + this.offsetX, y + this.offsetY);

        length += this.ctx.measureText(text).width;
      }
    } else {      
      this.ctx.fillStyle = colour;
      this.ctx.fillText(text, x + this.offsetX, y + this.offsetY);
    }

    this.ctx.font = oldFont;
    this.ctx.fillStyle = oldStyle;
    this.ctx.textAlign = oldAlign;

    return this;
  }

  public image(
    image: Image | HTMLCanvas | null,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    if (image === null)
      return this;

    try {
      this.ctx.drawImage(
        image,
        x * this.quality + this.offsetX,
        y * this.quality + this.offsetY,
        width * this.quality,
        height * this.quality
      );
    } catch {}

    return this;
  }

  public roundImage(
    image: Image | HTMLCanvas | null,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | { tl: number; tr: number; br: number; bl: number }
  ) {
    if (image === null)
      return this;

    x *= this.quality;
    y *= this.quality;
    width *= this.quality;
    height *= this.quality;

    if (typeof radius === 'number') {
      radius *= this.quality;
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius.tl *= this.quality;
      radius.tr *= this.quality;
      radius.br *= this.quality;
      radius.bl *= this.quality;
    }
    
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.offsetX + radius.tl, y + this.offsetY);
    this.ctx.lineTo(x + this.offsetX + width - radius.tr, y + this.offsetY);
    this.ctx.quadraticCurveTo(x + width + this.offsetX, y + this.offsetY, x + width + this.offsetX, y + radius.tr + this.offsetY);
    this.ctx.lineTo(x + width + this.offsetX, y + height - radius.br + this.offsetY);
    this.ctx.quadraticCurveTo(
      x + width + this.offsetX,
      y + height + this.offsetY,
      x + width - radius.br + this.offsetX,
      y + height + this.offsetY
    );
    this.ctx.lineTo(x + radius.bl + this.offsetX, y + height + this.offsetY);
    this.ctx.quadraticCurveTo(x + this.offsetX, y + height + this.offsetY, x + this.offsetX, y + height - radius.bl + this.offsetY);
    this.ctx.lineTo(x + this.offsetX, y + radius.tl + this.offsetY);
    this.ctx.quadraticCurveTo(x + this.offsetX, y + this.offsetY, x + radius.tl + this.offsetX, y + this.offsetY);
    this.ctx.closePath();
    this.ctx.clip();

    try {
      this.ctx.drawImage(
        image,
        x * this.quality + this.offsetX,
        y * this.quality + this.offsetY,
        width * this.quality,
        height * this.quality
      );
    } catch {}

    this.ctx.restore();

    return this;
  }

  public circularImage(
    image: Image | HTMLCanvas | null,
    x: number,
    y: number,
    radius: number
  ) {
    if (image === null)
      return this;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.quality + this.offsetX,
      y * this.quality + this.offsetY,
      radius * this.quality,
      0,
      2 * Math.PI,
      true
    );
    this.ctx.closePath();
    this.ctx.clip();

    this.image(image, x - radius, y - radius, radius * 2, radius * 2);

    this.ctx.restore();

    return this;
  }

  public measure(
    text: string,
    {
      font = 'Segoe UI',
      size = 14
    }: {
      font?: string;
      size?: number;
    }
  ) {
    const oldFont = this.ctx.font;

    this.ctx.font = `${size}px ${font}`;
    const { width } = this.ctx.measureText(text);
    this.ctx.font = oldFont;

    return width / this.quality;
  }

  public async toBuffer() {
    return this.canvas.toBuffer();
  }
}
