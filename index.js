import { calculateScore, makeCSVToArrayOnce } from "./functions.js";

const excludedStocks = ["BANKS", "MODARABAS", "COMMERCIAL BANKS"];

let KMIArray = await makeCSVToArrayOnce();

KMIArray = KMIArray.filter(
  (x) =>
    x.status === "Compliant" &&
    !excludedStocks.includes(x.sector) &&
    x.dividendYield > 0
);

// Calculate score
KMIArray = calculateScore(KMIArray);

// Sort based on score
KMIArray.sort((a, b) => {
  return b.score - a.score;
});

console.log(
  "index | symbol | score | debt ratio | nc invest | nc income | div yield | sector"
);

KMIArray.slice(0, 15).forEach((x, index) => {
  console.log(
    index + 1,
    x.symbol,
    parseFloat(x.score).toFixed(2),
    parseFloat(x.currentPrice).toFixed(2),
    x.debtToAssetRatio,
    x.nonCompliantInvestment,
    x.nonCompliantIncome,
    x.dividendYield,
    x.sector
  );
});
