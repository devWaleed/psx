const json = require("./data.json");

const data = json.data;

const KMIShares = data.filter((x) => x.listed_in.includes("KMIALLSHR"));

const finalArray = KMIShares.map((obj) => {
  console.log("obj", obj);

  return obj;
});

// const onlyDividendShares = KMIShares.filter((x) => x.dividend_per_share > 0);

// const sortByDividend = onlyDividendShares.sort(
//   (a, b) => b.dividend_yield_perc - a.dividend_yield_perc
// );

// sortByDividend.slice(0, 30).forEach((stock) => {
//   console.log(
//     stock.stock_symbol,
//     stock.dividend_yield_perc,
//     stock.dividend_per_share,
//     stock.stock_current_price,
//     stock.earning_per_share,
//     stock.price_earning_ratio,
//     stock.net_profit_margin_perc,
//     stock.price_to_sale_ratio,
//     stock.stock_sector_name
//   );
// });
