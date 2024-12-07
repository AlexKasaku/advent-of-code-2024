/**
 * Finds greatest common divisor (GCM) between two numbers. Uses iterative method
 */
const greatestCommonDivsor = (a: number, b: number) => {
  a = Math.abs(a);
  b = Math.abs(b);
  let [x, y] = b > a ? [b, a] : [a, b];

   
  while (true) {
    if (y == 0) return x;
    x %= y;
    if (x == 0) return y;
    y %= x;
  }
};

export default greatestCommonDivsor;
