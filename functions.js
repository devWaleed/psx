import fs from "fs";
import { parse } from "csv-parse";
import SarmaayaData from "./Sarmaaya.js";

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

        const stockData = SarmaayaData.find((x) => x.stock_symbol === symbol);

        KMIArray.push({
          symbol,
          debtToAssetRatio: parseFloat(debtToAssetRatio) || 0,
          nonCompliantInvestment: parseFloat(nonCompliantInvestment) || 0,
          nonCompliantIncome: parseFloat(nonCompliantIncome) || 0,
          status,
          currentPrice: stockData?.stock_current_price,
          dividendYield: parseFloat(stockData?.dividend_yield_perc) || 0,
          netProfitMargin: parseFloat(stockData?.net_profit_margin_perc) || 0,
          earningPerShare: parseFloat(stockData?.earning_per_share),
          sector: stockData?.stock_sector_name,
        });
      });
    });

    setTimeout(() => resolve(KMIArray), 100);
  });
};

export const calculateScore = (data) => {
  const weights = {
    debtToAssetRatio: 0.05,
    nonCompliantInvestment: 0.25,
    nonCompliantIncome: 0.25,
    dividendYield: 0.45,
  };

  const allowedColumns = Object.keys(weights);

  const normalizationRanges = {};

  // Find min and max of each criteria
  for (const obj of data) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop) && allowedColumns.includes(prop)) {
        if (!normalizationRanges[prop]) {
          normalizationRanges[prop] = { min: Infinity, max: -Infinity };
        }

        const value = obj[prop];

        if (value < normalizationRanges[prop].min) {
          normalizationRanges[prop].min = value;
        }

        if (value > normalizationRanges[prop].max) {
          normalizationRanges[prop].max = value;
        }
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const obj = data[i];

    // Normalize the criterion values
    const normalizedValues = {};

    for (const prop in obj) {
      if (obj.hasOwnProperty(prop) && allowedColumns.includes(prop)) {
        const value = obj[prop];
        const range = normalizationRanges[prop];

        // Invert negative columns (non-beneficial criteria)
        const normalizedValue = (value - range.min) / (range.max - range.min);

        normalizedValues[prop] = normalizedValue;
      }
    }

    // Add all alternative criteria values to make total score

    let score = 0;

    for (const prop in obj) {
      if (
        obj.hasOwnProperty(prop) &&
        weights.hasOwnProperty(prop) &&
        allowedColumns.includes(prop)
      ) {
        score += Math.pow(normalizedValues[prop], weights[prop]);
      }
    }

    obj.score = score;
  }

  return data;
};
