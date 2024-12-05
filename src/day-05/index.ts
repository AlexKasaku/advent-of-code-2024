import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import difference from 'utils/difference';
import toSum from 'utils/toSum';

const EOL = '\n';
const input = await readInput('day-05')

type Data = { rules: Rule[], pagesSets: Pages[]};
type Rule = { before: number, after: number }
type RulesMap = Map<number, number[]>;
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

// Flip to create rules of what numbers must come *before*
const buildBeforeRulesMap = (rules: Rule[]) : RulesMap => {
  const beforeRulesMap: RulesMap = new Map<number, number[]>();
  rules.forEach(rule => {
    beforeRulesMap.set(rule.after, [...beforeRulesMap.get(rule.after) ?? [], rule.before]);
  });
  beforeRulesMap.forEach(befores => befores.sort() )
  return beforeRulesMap;
}

const findSets = (data: Data, valid: boolean): Pages[] => {

  const beforeRulesMap = buildBeforeRulesMap(data.rules);

  // Go through each set and only return valid/invalid ones as required
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
          return !valid;        
      }
      
    }

    return valid;
  });
}

const findNextValidPageIndex = (rulesMap: RulesMap, allPages: number[], candidates: number[], precedingPages: number[] ) =>
{
  // Go through candidates and find the index of the next page that can follow all of the preceding pages
  for (let index = 0; index < candidates.length; index++) {
    const candidate = candidates[index];
    const pagesThatMustBeBefore = rulesMap.get(candidate) ?? [];
        
    // If for all pages that must come before this candidate, if there are any that are in the set of pages 
    // and haven't yet been added, this candidate cannot be valid.
    if (pagesThatMustBeBefore.filter(x => allPages.includes(x) && !precedingPages.includes(x)).length == 0)
      return index;
  }

  return -1;
}

const reorderSets = (data: Data): Pages[] => {

  const beforeRulesMap = buildBeforeRulesMap(data.rules);

  // Go over each set and reorder it
  return data.pagesSets.map(set => {

    const oldOrder = [...set]
    const newOrder: number[] = [];

    // Repeat until emptied oldOrder
    while (oldOrder.length > 0) {

      // Find next number that can be added to the list
      const x = findNextValidPageIndex(beforeRulesMap, set, oldOrder, newOrder);

      if (x == -1)
      {
        debug(oldOrder);
        debug(newOrder);
        throw 'Cannot find a valid candidate'
      }

      // Add it to the list
      newOrder.push(oldOrder[x]);

      // Remove from oldOrder
      oldOrder.splice(x, 1);
    }

    return newOrder;
  });
}

export const part1 = () => {
  const data = parseInput();

  const validSets = findSets(data, true);

  return validSets.map(set => set[Math.floor(set.length / 2)]).reduce(toSum);
}

export const part2 = () => {
  const data = parseInput()

  const invalidSets = findSets(data, false);
  const reorderedSets = reorderSets({ rules: data.rules, pagesSets: invalidSets});
  
  return reorderedSets.map(set => set[Math.floor(set.length / 2)]).reduce(toSum);
}
