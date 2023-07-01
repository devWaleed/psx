import { makeCSVToArrayOnce } from "./functions.js";

let KMIArray = await makeCSVToArrayOnce();
KMIArray = KMIArray.filter((x) => x.status === "Compliant");

KMIArray = KMIArray.map((x) => {
  let { debtToAssetRatio, nonCompliantInvestment, nonCompliantIncome } = x;

  if (debtToAssetRatio === 0) {
    debtToAssetRatio = 0.01;
  }

  if (nonCompliantInvestment === 0) {
    nonCompliantInvestment = 0.01;
  }

  if (nonCompliantIncome === 0) {
    nonCompliantIncome = 0.01;
  }

  return {
    ...x,
    score:
      (1 / debtToAssetRatio) *
        (1 / nonCompliantInvestment) *
        (1 / nonCompliantIncome) || 0,
  };
});

KMIArray.sort((a, b) => {
  return a.score - b.score;
});

KMIArray.forEach((x) => {
  console.log(
    "x",
    x.symbol,
    x.score,
    x.debtToAssetRatio,
    x.nonCompliantInvestment,
    x.nonCompliantIncome
  );
});
