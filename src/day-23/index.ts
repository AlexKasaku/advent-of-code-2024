import { parseLines, readInput } from 'io'
import { log, debug } from 'log'
import { asc } from 'utils'

const input = await readInput('day-23')

type Connection = { a: string, b: string }
type Network = {
  vertices: Set<string>,
  neighbours: Map<string, Set<string>>
}

const parseInput = (): Connection[] => {
  return parseLines(input).map(line => {
    const [a, b] = line.split('-');
    return { a, b }
  })
}

const buildNetwork = (connections: Connection[]): Network => {
  const vertices = new Set<string>();
  const neighbours = new Map<string, Set<string>>();

  for (const { a, b } of connections) {
    vertices.add(a);
    vertices.add(b);

    neighbours.set(a, new Set([...neighbours.get(a) ?? [], b]));
    neighbours.set(b, new Set([...neighbours.get(b) ?? [], a]));
  }

  return { vertices, neighbours }
}

const getCliques = ({ vertices, neighbours }: Network, maximalOnly: boolean): Set<string>[] => {

  const cliques: Set<string>[] = [];

  // https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
  // Basic implementation with pivoting

  // algorithm BronKerbosch1(R, P, X) is
  // if P and X are both empty then
  //     report R as a maximal clique
  // for each vertex v in P do
  //     BronKerbosch1(R ⋃ {v}, P ⋂ N(v), X ⋂ N(v))
  //     P := P \ {v}
  //     X := X ⋃ {v}

  const bronKerbosch = (r: Set<string>, p: Set<string>, x: Set<string>) => {
    if ((!maximalOnly || (p.size === 0 && x.size === 0)) && r.size > 2) {
      // Ignoring cliques of fewer than 2 vertices. If we want maximal only,
      // then we just push to array if p and x are empty.
      cliques.push(r);
    }

    // We can prune the set of p to check by choosing a pivot and ignoring the neighbours 
    // of that vertex. We can only do this if searching for maximal sets as this means skipping
    // some non-maximal sets.
    const pivotVertex = p.size > 0 ? [...p.values()][0] : null;
    const prunedP = maximalOnly && pivotVertex ? p.union(x).difference(neighbours.get(pivotVertex)!) : p;

    for (const vertex of prunedP) {
      const nx = neighbours.get(vertex)!;
      bronKerbosch(
        r.union(new Set<string>([vertex])), // R ⋃ {v}
        p.intersection(nx), // P ⋂ N(v)
        x.intersection(nx), // X ⋂ N(v))
      )
      p.delete(vertex);
      x.add(vertex);
    }
  }
  bronKerbosch(new Set<string>(), vertices, new Set<string>());

  return cliques;

}

export const part1 = () => {
  const connections = parseInput()
  const network = buildNetwork(connections)

  const cliques = getCliques(network, false);

  return cliques.filter(clique => clique.size === 3 && [...clique].some(v => v.startsWith("t"))).length;
}

export const part2 = () => {
  const connections = parseInput()
  const network = buildNetwork(connections)

  const cliques = getCliques(network, true);

  const biggestClique = cliques.sort((a, b) => b.size - a.size)[0];
  const computers = [...biggestClique];
  computers.sort(asc);

  return computers;
}
