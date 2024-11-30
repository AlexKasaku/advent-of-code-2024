/**
 * Uses a Sieve of Eratosthenes to build an array of primes up to. Requires building an array of max size.
 * @param max The maximum number of prime to reach.
 */
const buildPrimeArray = (max: number): number[] => {
  const numbers: boolean[] = [...new Array(max)].fill(true);

  // 1 is not prime!
  numbers[0] = false;

  for (let factor = 2; factor <= max / 2; factor++) {
    for (let index = factor * 2; index <= max; index += factor)
      numbers[index - 1] = false;
  }

  return numbers
    .map((isPrime, i) => (isPrime ? i + 1 : null))
    .filter((n) => n !== null) as number[];
};

export default buildPrimeArray;
