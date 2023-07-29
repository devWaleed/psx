import fs from "fs";
import { readFile } from "fs/promises";
import { parse } from "csv-parse";
import { log } from "console";

const response = JSON.parse(
  await readFile(new URL("./EFERT.json", import.meta.url))
);

const data = response.data;

let mappedData = data.map((item) => ({
  date: new Date(item[0] * 1000),
  price: item[1],
}));

mappedData = mappedData.filter(
  (item) => new Date(item.date).getUTCFullYear() > 0
);

mappedData.sort((a, b) => a.date - b.date);

let days = 0;
let shares = 0;
let cost = 0;
let lastPrice = 0;
let toBuy = 10;

for (const point of mappedData) {
  days++;

  if (days === 10) {
    days = 0;

    shares += toBuy;
    cost += point.price * toBuy;

    log(point.date, point.price);
  }

  lastPrice = point.price;
}

const perSharePrice = parseFloat(cost / shares).toFixed(2);
cost = parseFloat(cost).toFixed(2);
const currentPortfolio = parseFloat(shares * lastPrice).toFixed(2);

const final = parseFloat((currentPortfolio / cost) * 100 - 100).toFixed(2);

console.log(
  "cost",
  cost,
  shares,
  perSharePrice,
  lastPrice,
  currentPortfolio,
  final
);
