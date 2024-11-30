/**
 * Basic implementation of determining if a number is prime. However, use buildPrimeArray
 * to generate a large map and then refer to that if you're needing a few primes!
 * @param number The number to check
 * @returns True if prime, false if not
 */
const isPrime = (number: number) => {
  if (number == 1) return false;
  if (number == 2) return true;
  for (let j = 2; j <= number / 2; j++) {
    if (number % j === 0) return false;
  }
  return true;
};

export default isPrime;
