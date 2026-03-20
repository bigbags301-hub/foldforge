import { z } from "zod";

export interface Trade {
  id: number;
  type: "buy" | "sell";
  openPrice: number;
  closePrice: number;
  profit: number;
  openTime: Date;
  closeTime: Date;
}

export interface AdvancedMetrics {
  netProfit: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  recoveryFactor: number;
  payoffRatio: number;
  valueAtRisk95: number;
  valueAtRisk99: number;
  skewness: number;
  kurtosis: number;
  totalTrades: number;
  wins: number;
  losses: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
}

export function generateRealisticTrades(numTrades: number, initialBalance: number): Trade[] {
  const trades: Trade[] = [];
  let currentBalance = initialBalance;
  const winRate = 0.55;
  const avgWin = 200;
  const avgLoss = 150;

  for (let i = 0; i < numTrades; i++) {
    const isWin = Math.random() < winRate;
    const profit = isWin 
      ? avgWin * (0.8 + Math.random() * 0.4) 
      : -avgLoss * (0.8 + Math.random() * 0.4);
    
    const openTime = new Date(Date.now() - (numTrades - i) * 3600000);
    const closeTime = new Date(openTime.getTime() + 1800000);

    trades.push({
      id: i + 1,
      type: Math.random() > 0.5 ? "buy" : "sell",
      openPrice: 1.1000,
      closePrice: 1.1000 + (profit / 1000),
      profit: Math.round(profit * 100) / 100,
      openTime,
      closeTime
    });
  }
  return trades;
}

export function calculateMetrics(trades: Trade[], initialBalance: number): AdvancedMetrics {
  const profits = trades.map(t => t.profit);
  const netProfit = profits.reduce((a, b) => a + b, 0);
  const wins = trades.filter(t => t.profit > 0);
  const losses = trades.filter(t => t.profit <= 0);
  
  const winRate = (wins.length / trades.length) * 100;
  const grossProfit = wins.reduce((a, b) => a + b.profit, 0);
  const grossLoss = Math.abs(losses.reduce((a, b) => a + b.profit, 0));
  const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
  
  let equity = initialBalance;
  let peak = initialBalance;
  let maxDD = 0;
  let maxDDPercent = 0;
  const equityCurve: number[] = [initialBalance];

  for (const trade of trades) {
    equity += trade.profit;
    equityCurve.push(equity);
    if (equity > peak) peak = equity;
    const dd = peak - equity;
    const ddP = (dd / peak) * 100;
    if (dd > maxDD) maxDD = dd;
    if (ddP > maxDDPercent) maxDDPercent = ddP;
  }

  const returns = profits.map(p => p / initialBalance);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.map(r => Math.pow(r - avgReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
  const sharpeRatio = stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized

  const downsideReturns = returns.filter(r => r < 0);
  const downsideStdDev = Math.sqrt(downsideReturns.map(r => Math.pow(r, 2)).reduce((a, b) => a + b, 0) / returns.length);
  const sortinoRatio = downsideStdDev === 0 ? 0 : (avgReturn / downsideStdDev) * Math.sqrt(252);

  const calmarRatio = maxDDPercent === 0 ? 0 : (netProfit / initialBalance * 100) / maxDDPercent;

  // Simple VaR calculation
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const var95 = sortedReturns[Math.floor(returns.length * 0.05)] * 100;
  const var99 = sortedReturns[Math.floor(returns.length * 0.01)] * 100;

  return {
    netProfit: Math.round(netProfit * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    maxDrawdown: Math.round(maxDD * 100) / 100,
    maxDrawdownPercent: Math.round(maxDDPercent * 100) / 100,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    sortinoRatio: Math.round(sortinoRatio * 100) / 100,
    calmarRatio: Math.round(calmarRatio * 100) / 100,
    recoveryFactor: Math.round((netProfit / maxDD) * 100) / 100,
    payoffRatio: Math.round((grossProfit / wins.length) / (grossLoss / losses.length) * 100) / 100,
    valueAtRisk95: Math.round(var95 * 100) / 100,
    valueAtRisk99: Math.round(var99 * 100) / 100,
    skewness: 0, // Placeholder
    kurtosis: 0, // Placeholder
    totalTrades: trades.length,
    wins: wins.length,
    losses: losses.length,
    consecutiveWins: 0, // Placeholder
    consecutiveLosses: 0, // Placeholder
    avgWin: Math.round((grossProfit / wins.length) * 100) / 100,
    avgLoss: Math.round((grossLoss / losses.length) * 100) / 100,
    expectancy: Math.round((netProfit / trades.length) * 100) / 100,
  };
}

export function monteCarloSimulation(trades: Trade[], numSimulations: number = 1000) {
  const results = [];
  for (let i = 0; i < numSimulations; i++) {
    const resampledTrades = [];
    for (let j = 0; j < trades.length; j++) {
      resampledTrades.push(trades[Math.floor(Math.random() * trades.length)]);
    }
    results.push(calculateMetrics(resampledTrades, 10000).netProfit);
  }
  return results.sort((a, b) => a - b);
}
