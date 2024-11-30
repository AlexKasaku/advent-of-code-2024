const chunk = <T>(items: T[], size: number): T[][] =>
  items.reduce((groups, current, index) => {
    if (index % size === 0) groups.push([]);

    groups[groups.length - 1].push(current);

    return groups;
  }, [] as T[][]);

export default chunk;
