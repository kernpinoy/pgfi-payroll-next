type CompensationBracket = {
  min: number;
  max: number;
  ee: number;
};

const compensationBrackets: CompensationBracket[] = [
  { min: 0, max: 5249.99, ee: 250 },
  { min: 5250, max: 5749.99, ee: 275 },
  { min: 5750, max: 6249.99, ee: 300 },
  { min: 6250, max: 6749.99, ee: 325 },
  { min: 6750, max: 7249.99, ee: 350 },
  { min: 7250, max: 7749.99, ee: 375 },
  { min: 7750, max: 8249.99, ee: 400 },
  { min: 8250, max: 8749.99, ee: 425 },
  { min: 8750, max: 9249.99, ee: 450 },
  { min: 9250, max: 9749.99, ee: 475 },
  { min: 9750, max: 10249.99, ee: 500 },
  { min: 10250, max: 10749.99, ee: 525 },
  { min: 10750, max: 11249.99, ee: 550 },
  { min: 11250, max: 11749.99, ee: 575 },
  { min: 11750, max: 12249.99, ee: 600 },
  { min: 12250, max: 12749.99, ee: 625 },
  { min: 12750, max: 13249.99, ee: 650 },
  { min: 13250, max: 13749.99, ee: 675 },
  { min: 13750, max: 14249.99, ee: 700 },
  { min: 14250, max: 14749.99, ee: 725 },
  { min: 14750, max: 15249.99, ee: 750 },
  { min: 15250, max: 15749.99, ee: 775 },
  { min: 15750, max: 16249.99, ee: 800 },
  { min: 16250, max: 16749.99, ee: 825 },
  { min: 16750, max: 17249.99, ee: 850 },
  { min: 17250, max: 17749.99, ee: 875 },
  { min: 17750, max: 18249.99, ee: 900 },
  { min: 18250, max: 18749.99, ee: 925 },
  { min: 18750, max: 19249.99, ee: 950 },
  { min: 19250, max: 19749.99, ee: 975 },
  { min: 19750, max: 20249.99, ee: 1000 },
  { min: 20250, max: 20749.99, ee: 1000 },
  { min: 20750, max: 21249.99, ee: 1000 },
  { min: 21250, max: 21749.99, ee: 1000 },
  { min: 21750, max: 22249.99, ee: 1000 },
  { min: 22250, max: 22749.99, ee: 1000 },
  { min: 22750, max: 23249.99, ee: 1000 },
  { min: 23250, max: 23749.99, ee: 1000 },
  { min: 23750, max: 24249.99, ee: 1000 },
  { min: 24250, max: 24749.99, ee: 1000 },
  { min: 24750, max: 25249.99, ee: 1000 },
  { min: 25250, max: 25749.99, ee: 1000 },
  { min: 25750, max: 26249.99, ee: 1000 },
  { min: 26250, max: 26749.99, ee: 1000 },
  { min: 26750, max: 27249.99, ee: 1000 },
  { min: 27250, max: 27749.99, ee: 1000 },
  { min: 27750, max: 28249.99, ee: 1000 },
  { min: 28250, max: 28749.99, ee: 1000 },
  { min: 28750, max: 29249.99, ee: 1000 },
  { min: 29250, max: 29749.99, ee: 1000 },
  { min: 29750, max: 30249.99, ee: 1000 },
  { min: 30250, max: 30749.99, ee: 1000 },
  { min: 30750, max: 31249.99, ee: 1000 },
  { min: 31250, max: 31749.99, ee: 1000 },
  { min: 31750, max: 32249.99, ee: 1000 },
  { min: 32250, max: 32749.99, ee: 1000 },
  { min: 32750, max: 33249.99, ee: 1000 },
  { min: 33250, max: 33749.99, ee: 1000 },
  { min: 33750, max: 34249.99, ee: 1000 },
  { min: 34250, max: 34749.99, ee: 1000 },
  { min: 34750, max: Infinity, ee: 1000 },
];

export function getEEFromGross(grossAmount: number): number | null {
  const bracket = compensationBrackets.find(
    (b) => grossAmount >= b.min && grossAmount <= b.max
  );
  return bracket ? bracket.ee : null;
}
