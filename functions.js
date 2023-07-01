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

export const calculateScore = (kmiArray) => {
  return kmiArray.map((x) => {
    let {
      debtToAssetRatio,
      nonCompliantInvestment,
      nonCompliantIncome,
      dividendYield,
      currentPrice,
      netProfitMargin,
      earningPerShare,
    } = x;

    if (debtToAssetRatio === 0) {
      debtToAssetRatio = 0.01;
    }

    if (nonCompliantInvestment === 0) {
      nonCompliantInvestment = 0.01;
    }

    if (nonCompliantIncome === 0) {
      nonCompliantIncome = 0.01;
    }

    const score =
      (1 / debtToAssetRatio) *
      // (1 / nonCompliantInvestment) *
      (1 / nonCompliantIncome) *
      (1 / currentPrice) *
      netProfitMargin *
      earningPerShare *
      dividendYield;

    return {
      ...x,
      score: (score || 0).toFixed(0),
    };
  });
};
