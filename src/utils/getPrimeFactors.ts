import isPrime from './isPrime';

/**
 * Returns the prime factors of a number
 * @param number The number to return prime factors for
 * @param number An array of prime numbers (see buildPrimeArray) to speed up execution
 * @returns An array of prime factors
 */
const getPrimeFactors = (number: number, primes?: number[]) => {
  const primeArray = [];

  // Find divisors starting with 2
  for (let divisor = 2; divisor <= number; divisor++) {
    if (number % divisor !== 0) continue;

    const divisorIsPrime = primes
      ? primes.indexOf(divisor) > -1
      : isPrime(divisor);
    if (!divisorIsPrime) continue;

    // If the divisor is prime, divide integer with the number and store
    let power = 0;

    while (number % divisor == 0) {
      number /= divisor;
      power++;
    }
    primeArray.push({ factor: divisor, power });
  }

  return primeArray;
};

export default getPrimeFactors;
