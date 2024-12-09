/**
 * Creates a heap-based priority queue for efficient maintence of an ordered queue
 * @param comparator Optional comparitor function. If not provided, a default implementation of a<b will be used.
 * @returns The queue
 */
const priorityQueue = <T>(comparator?: (a: T, b: T) => boolean) => {
  const heap: T[] = [];

  const left = (index: number) => 2 * index + 1;
  const right = (index: number) => 2 * index + 2;
  const hasLeft = (index: number) => left(index) < heap.length;
  const hasRight = (index: number) => right(index) < heap.length;

  const compare: (a: T, b: T) => boolean =
    comparator ?? (<T>(a: T, b: T) => a < b);

  const swapNodes = (aIndex: number, bIndex: number) =>
    ([heap[bIndex], heap[aIndex]] = [heap[aIndex], heap[bIndex]]);

  const parent = (index: number) => Math.floor((index - 1) / 2);

  return {
    isEmpty: () => heap.length == 0,
    peek: () => (heap.length == 0 ? null : heap[0]),
    size: () => heap.length,
    insert: (...items: T[]) => {
      items.forEach((item) => {
        heap.push(item);

        let i = heap.length - 1;
        while (i > 0) {
          const p = parent(i);
          if (compare(heap[p], heap[i])) break;
          swapNodes(i, p);
          i = p;
        }
      });
    },
    dequeue: (): T | null => {
      if (heap.length == 0) return null;

      swapNodes(0, heap.length - 1);
      const item = heap.pop();

      let current = 0;
      while (hasLeft(current)) {
        let smallerChild = left(current);
        if (
          hasRight(current) &&
          compare(heap[right(current)], heap[left(current)])
        )
          smallerChild = right(current);

        if (compare(heap[current], heap[smallerChild])) break;

        swapNodes(current, smallerChild);
        current = smallerChild;
      }

      return item ?? null;
    },
  };
};

export default priorityQueue;
