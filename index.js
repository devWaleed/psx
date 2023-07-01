import { calculateScore, makeCSVToArrayOnce } from "./functions.js";

let KMIArray = await makeCSVToArrayOnce();

// Calculate score
KMIArray = calculateScore(KMIArray);

KMIArray = KMIArray.filter(
  (x) => x.status === "Compliant" && !x.sector?.includes?.("BANKS")
);

// Sort based on score
KMIArray.sort((a, b) => {
  return b.score - a.score;
});

console.log("symbol \t score \t price \t yield");

KMIArray.slice(0, 10).forEach((x) => {
  console.log(
    x.symbol,
    x.score,
    // x.debtToAssetRatio,
    // x.nonCompliantInvestment,
    // x.nonCompliantIncome,
    x.currentPrice,
    x.dividendYield
  );
});
