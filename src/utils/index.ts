import { GlobalState } from "../modules/global";

export const drawHeart = (
  x: number,
  y: number,
  size: number,
  color?: string
) => {
  fill(color || "red");
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
};

export const drawHearts = (
  num: number = 3,
  size: number = GlobalState.settings.heart.size,
  vOffset: number = 4,
  color?: string
) => {
  Array.from({ length: num }, (_, i) => i).forEach((i) => {
    drawHeart(
      35 + i * (size + GlobalState.settings.heart.offset),
      10 + vOffset,
      size,
      color
    );
  });
};
