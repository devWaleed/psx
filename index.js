import { calculateScore, makeCSVToArrayOnce } from "./functions.js";

let KMIArray = await makeCSVToArrayOnce();

// Calculate score
KMIArray = calculateScore(KMIArray);

KMIArray = KMIArray.filter(
  (x) =>
    x.status === "Compliant" &&
    !x.sector?.includes?.("BANKS") &&
    x.currentPrice < 500 &&
    x.score > 0
);

// Sort based on score
KMIArray.sort((a, b) => {
  return b.score - a.score;
});

console.log("symbol \t score \t price \t yield");

KMIArray.slice(0, 100).forEach((x, index) => {
  console.log(
    index + 1,
    x.symbol,
    x.score,
    // x.debtToAssetRatio,
    // x.nonCompliantInvestment,
    // x.nonCompliantIncome,
    x.currentPrice,
    x.dividendYield
  );
});
