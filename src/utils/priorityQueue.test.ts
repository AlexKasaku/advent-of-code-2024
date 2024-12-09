import priorityQueue from './priorityQueue';

describe('priorityQueue', () => {
  describe('dequeue', () => {
    it.each([
      [[4, 5, 2, 3, 1], 1],
      [[4, 5, 2], 2],
      [[4, 1, 5, 1, 2, 3, 1], 1],
    ])(
      'with queue items %p, dequeues the smallest number of %p',
      (items, expected) => {
        const queue = priorityQueue();
        items.forEach((i) => queue.insert(i));

        expect(queue.dequeue()).toEqual(expected);
      },
    );

    it.each([
      [[4, 5, 2, 3, 1], 5],
      [[4, 5, 2], 5],
      [[4, 1, 5, 1, 2, 3, 1], 5],
    ])(
      'with queue items %p and custom comparitor, dequeues the largest number of %p',
      (items, expected) => {
        const queue = priorityQueue<number>((a, b) => a > b);
        items.forEach((i) => queue.insert(i));

        expect(queue.dequeue()).toEqual(expected);
      },
    );
  });
  describe('size', () => {
    it.each([
      [[4, 5, 2, 3, 1], 5],
      [[4, 5, 2], 3],
      [[4, 1, 5, 1, 2, 3, 1], 7],
    ])('with queue items %p, size returns %p', (items, expected) => {
      const queue = priorityQueue<number>((a, b) => a > b);
      items.forEach((i) => queue.insert(i));

      expect(queue.size()).toEqual(expected);
    });
  });
  describe('peek', () => {
    it.each([
      [[4, 5, 2, 3, 1], 1, 5],
      [[4, 5, 2], 2, 3],
      [[4, 1, 5, 1, 2, 3, 1], 1, 7],
    ])(
      'with queue items %p, peek reports smallest of %p without changing size of %p',
      (items, expectedSmallest, expectedSize) => {
        const queue = priorityQueue<number>();
        items.forEach((i) => queue.insert(i));

        expect(queue.peek()).toEqual(expectedSmallest);
        expect(queue.size()).toEqual(expectedSize);
      },
    );
  });
  describe('isEmpty', () => {
    it('returns false when queue has items', () => {
      const queue = priorityQueue<number>();
      queue.insert(4);

      expect(queue.isEmpty()).toEqual(false);
    });
    it('returns true before adding any items', () => {
      const queue = priorityQueue<number>();

      expect(queue.isEmpty()).toEqual(true);
    });
    it('returns true after dequeing all items', () => {
      const queue = priorityQueue<number>();
      queue.insert(4);
      queue.dequeue();

      expect(queue.isEmpty()).toEqual(true);
    });
  });
});
