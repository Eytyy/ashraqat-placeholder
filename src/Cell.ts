// @ts-ignore
import { lerp } from 'canvas-sketch-util/math';
// @ts-ignore
import random from 'canvas-sketch-util/random';

export class Cell {
  position: [number, number];
  size: number;
  cellSize: number;
  color: string;
  startAngle: number;
  angle: number;
  hovered: boolean;
  active: boolean;

  constructor(
    position: [number, number],
    cellSize: number,
    color: string
  ) {
    this.position = position;
    this.cellSize = cellSize;
    this.size = 0.1;
    this.color = color;
    this.angle = this.startAngle = random.range(1, 4);
    this.hovered = false;
    this.active = true;
  }

  update(
    ctx: CanvasRenderingContext2D,
    state: {
      mouse: [number, number] | null;
    },
    config: {
      width: number;
      height: number;
      margin: number;
      gap: number;
    }
  ) {
    const { mouse } = state;
    this.checkHover(mouse);
    this.paint(ctx, config);
    if (this.size < this.cellSize) {
      this.size += 0.5;
    }
  }

  paint(
    ctx: CanvasRenderingContext2D,
    config: {
      width: number;
      height: number;
      margin: number;
      gap: number;
    }
  ) {
    if (!this.active) {
      return;
    }

    const { gap } = config;
    const [x, y] = this.position;
    const resize = this.hovered ? 1.45 : 1;
    ctx.save();

    ctx.beginPath();

    ctx.translate(x, y);
    this.rotate(ctx);

    ctx.rect(
      this.size * gap * resize * -0.5,
      this.size * gap * resize * -0.5,
      this.size * gap * resize,
      this.size * gap * resize
    );
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.restore();
  }

  checkHover(mouse: [number, number] | null) {
    const r = 100;
    const [x, y] = this.position;
    if (!mouse) {
      this.hovered = false;
    } else {
      this.hovered = Math.hypot(mouse[0] - x, mouse[1] - y) <= r;
    }
  }

  rotate(ctx: CanvasRenderingContext2D) {
    if (!this.active) {
      ctx.rotate(this.angle);
      return;
    }
    this.angle = this.angle + 0.005;
    ctx.rotate(this.angle);
  }
}
