export const clearCanvas = (context: CanvasRenderingContext2D) => {
  context.clearRect(
    0,
    0,
    context.canvas.width,
    context.canvas.height
  );
};
