import { equal } from "./../assert.mjs";
import fs from "fs";

const plays = JSON.parse(fs.readFileSync("./plays.json", "utf8"));
const invoices = JSON.parse(fs.readFileSync("./invoices.json", "utf8"));

equal(
  statement(invoices[0], plays),
  `Statment for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Hamlet: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`
);

function statement(invoice, plays) {
  let totalAount = 0;
  let volumeCredits = 0;
  let result = `Statment for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    // ボリューム特典のポイントを加算
    volumeCredits += Math.max(perf.audience - 30.0);

    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
    result += `  ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAount += thisAmount;
  }

  result += `Amount owed is ${format(totalAount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}
