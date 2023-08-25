import React, { useMemo } from 'react';
// @ts-ignore
import random from 'canvas-sketch-util/random';
// @ts-ignore
import { lerp } from 'canvas-sketch-util/math';

import useMeasure from 'react-use-measure';

import { clearCanvas } from '@/lib/canvas';
import { Cell } from '../Cell';

const default_colors = [
  '#FFA24D',
  '#435563',
  '#FCA6A6',
  '#1ED6FF',
  '#435563',
];

export default function Pattern({
  colors = default_colors,
}: {
  colors?: string[];
}) {
  const [context, setContext] =
    React.useState<CanvasRenderingContext2D | null>(null);

  const [ref, bounds] = useMeasure();

  const { width, height, left, top } = bounds;
  const margin = 15;
  const gap = 0.5;
  const cellSize = 40;
  const cols = useMemo(() => Math.ceil(width / cellSize), [width]);
  const rows = useMemo(() => Math.ceil(height / cellSize), [height]);

  const points = React.useMemo(() => {
    const points = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const u = cols < 1 ? 0.5 : x / (cols - 1);
        const v = rows < 1 ? 0.5 : y / (rows - 1);
        const cellX = lerp(margin, width - margin, u);
        const cellY = lerp(margin, height - margin, v);

        const color = random.pick(colors);

        points.push(new Cell([cellX, cellY], cellSize, color));
      }
    }
    return points;
  }, [cols, rows, colors, width, height]);

  /** mouse handling */
  const mouse = React.useRef<[number, number] | null>(null);
  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const { clientX, clientY } = e;
      mouse.current = [clientX - left, clientY - top];
    },
    [left, top]
  );
  /** mouse handling end */

  const sketch = React.useCallback(
    (context: CanvasRenderingContext2D) => {
      const init = () => {
        clearCanvas(context);
        points.forEach((point) =>
          point.paint(context, { width, height, margin, gap })
        );
      };

      const animate = () => {
        clearCanvas(context);

        points.forEach((point) =>
          point.update(
            context,
            {
              mouse: mouse.current,
            },
            { width, height, margin, gap }
          )
        );
        raF.current = requestAnimationFrame(animate);
      };
      init();

      raF.current = requestAnimationFrame(animate);
    },
    [points, width, height, mouse]
  );

  /** initialize and animate */
  const raF = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (context) {
      sketch(context);
    }

    return () => {
      if (raF.current) {
        cancelAnimationFrame(raF.current);
      }
    };
  }, [context, sketch, cols, rows]);
  /** initialize and animate end **/

  return (
    <div ref={ref} className="relative h-full w-full">
      <canvas
        onMouseMove={handleMouseMove}
        onMouseLeave={() => (mouse.current = null)}
        width={width}
        height={height}
        ref={(n) => n && setContext(n.getContext('2d'))}
      />
    </div>
  );
}
