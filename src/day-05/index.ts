import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import toSum from 'utils/toSum';

const EOL = '\n';
const input = await readInput('day-05')

type Data = { rules: Rule[], pagesSets: Pages[]};
type Rule = { before: number, after: number }
type Pages = number[]

const parseInput = (): Data => {
  const groups = input.split(EOL+EOL );

  return {
    rules: groups[0].split(EOL).map(line => {
      const x = line.split('|');
      return { before: parseInt(x[0]), after: parseInt(x[1])};
    }),
    pagesSets: groups[1].split(EOL).map(line => line.split(',').map(x => parseInt(x)))
  };
}

const findValidSets = (data: Data): Pages[] => {

  // const rulesMap: Map<number, number[]> = new Map<number, number[]>();
  // data.rules.forEach(rule => {
  //   rulesMap.set(rule.before, [...rulesMap.get(rule.before) ?? [], rule.after]);
  // });
  // rulesMap.forEach(afters => afters.sort() )

  // Flip to create rules of what numbers must come *before*
  const beforeRulesMap: Map<number, number[]> = new Map<number, number[]>();
  data.rules.forEach(rule => {
    beforeRulesMap.set(rule.after, [...beforeRulesMap.get(rule.after) ?? [], rule.before]);
  });
  beforeRulesMap.forEach(befores => befores.sort() )

  // Go through each set and only return valid ones
  return data.pagesSets.filter(set => {

    // Loop through each number, for each entry see if there is a number ahead of it that must come before it:
    for (let i = 0; i < set.length; i++) {
      const current = set[i];

      // Check if any rules for this page
      if (!beforeRulesMap.has(current))
        continue;

      const remainder = set.slice(i + 1);

      for (let j = 0; j < remainder.length; j++) {
        const toTest = remainder[j];

        // If one of the further page numbers is found in a rule that states it must be before
        // the curret number, this is an invalid set
        if(beforeRulesMap.get(current)!.indexOf(toTest) > -1)
          return false;        
      }
      
    }

    return true;

  });

}

export const part1 = () => {
  const data = parseInput();

  const validSets = findValidSets(data);

  return validSets.map(set => set[Math.floor(set.length / 2)]).reduce(toSum);
}

export const part2 = () => {
  const lines = parseInput()
  // your code goes here
  return 0
}
