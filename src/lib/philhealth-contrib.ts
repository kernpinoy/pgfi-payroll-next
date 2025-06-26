const SSS_CONTRIBUTION_RATE = 0.05;

export function getPhilHealthContribution(workRate: number) {
  const part1 = (313 / 12) * workRate;
  const part2 = (part1 * SSS_CONTRIBUTION_RATE) / 2;

  return part2;
}
