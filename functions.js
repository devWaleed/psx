import fs from "fs";
import { parse } from "csv-parse";

export const makeCSVToArrayOnce = () => {
  return new Promise((resolve, reject) => {
    const KMIArray = [];

    const file = fs.readFileSync("./KMI.csv", function (err, fileData) {});

    parse(file, { delimiter: "," }, function (err, rows) {
      Array.from(rows).forEach((value) => {
        const [
          symbol,
          debtToAssetRatio,
          nonCompliantInvestment,
          nonCompliantIncome,
          illiquid_assets,
          net_liquid,
          status,
        ] = value;

        KMIArray.push({
          symbol,
          debtToAssetRatio: parseFloat(debtToAssetRatio),
          nonCompliantInvestment: parseFloat(nonCompliantInvestment),
          nonCompliantIncome: parseFloat(nonCompliantIncome),
          status,
        });
      });
    });

    setTimeout(() => resolve(KMIArray), 100);
  });
};
