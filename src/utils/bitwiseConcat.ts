// These functions are useful for storing multiple numbers within a single a number, which can be handy for representing a sequence of values
// as a single number. This can be much faster for Set / Mapping operations as can avoid having to build strings out of numbers. 

/**
 * Perform a bitwise concatenation by shifting values before adding the next. The amount to shift by is determined by the 
 * size of the value to add each time, so numbers are always safely stored at the cost of having to make this calculation.
 * @param values 
 * @returns 
 */
export const bitwiseConcat = (...values: number[]) => values.reduce((a, b) => (a << Math.ceil(Math.log2(b)) + 1) + b, 0);

/**
 * Perform a bitwise concatenation, but shifting by a given length. If the given length is too short for values, then bits
 * will be overridden.
 * @param shiftValue How much to shift each value by
 * @param values The values to concatenate into the result
 * @returns 
 */
export const bitwiseConcatBy = (shiftValue: number, ...values: number[]) => values.reduce((a, b) => (a << shiftValue) + b, 0);