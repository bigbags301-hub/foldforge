# The Ultimate EA Risk Validation Checklist

*The 5-step validation framework that separates traders who blow accounts from traders who stay funded.*

## Step 1: The Baseline Test
Before running complex simulations, your Expert Advisor (EA) must prove it has a statistical edge in a standard environment.

- [ ] **Win Rate > 55%** (or Risk:Reward ratio > 1:1.5 with a >40% win rate)
- [ ] **Profit Factor > 1.2** (Gross Profit / Gross Loss)
- [ ] **Max Drawdown < 5%** on a standard 1-year backtest
- [ ] **Sufficient Trade Sample** (Minimum 100 trades per year to prove statistical significance)

## Step 2: Walk-Forward Analysis
A strategy that only works on historical data is curve-fitted. Walk-forward analysis proves it can adapt to unseen market conditions.

- [ ] **In-Sample Optimization** (Optimize parameters on 70% of historical data)
- [ ] **Out-of-Sample Testing** (Test the optimized parameters on the remaining 30% unseen data)
- [ ] **Performance Consistency** (Out-of-sample performance should not degrade by more than 20% compared to in-sample)
- [ ] **Parameter Stability** (Small changes in parameters should not cause massive changes in results)

## Step 3: The Stress Test (Broker Data Sync)
Standard MT4/MT5 backtests use "perfect" data. Real markets have slippage, spread widening, and execution delays.

- [ ] **Variable Spread Testing** (Test with spreads 2x and 3x the average)
- [ ] **Slippage Simulation** (Add 1-3 pips of slippage to every trade)
- [ ] **Execution Delay** (Simulate 100ms - 500ms execution delays)
- [ ] **Real Broker Data Sync** (Use FoldForge to pull actual tick data from your specific broker, not generic MetaQuotes data)

## Step 4: Monte Carlo Simulation
Historical sequence of trades will never repeat exactly. Monte Carlo testing randomizes trade order to find your true maximum drawdown risk.

- [ ] **Trade Sequence Randomization** (Run 1,000+ simulations shuffling the order of historical trades)
- [ ] **95% Confidence Drawdown** (Ensure the 95th percentile worst-case drawdown is still below your prop firm's limit)
- [ ] **Risk of Ruin < 1%** (The mathematical probability of hitting your max drawdown limit must be near zero)
- [ ] **Consecutive Losses** (Calculate the maximum expected consecutive losses and ensure your position sizing can survive it)

## Step 5: Live Proof (The Guardian Phase)
Never deploy a strategy to a $100k+ funded account without live forward-testing and automated protection.

- [ ] **Demo Forward Testing** (Run live on a demo account for minimum 4 weeks)
- [ ] **Live Micro-Account Testing** (Run on a real-money micro account to verify execution quality)
- [ ] **Drawdown Protection Enabled** (Use FoldForge's Funded Account Guardian to automatically halt trading if daily drawdown approaches 4%)
- [ ] **News Filter Active** (Ensure the EA avoids high-impact news events that cause unpredictable slippage)

---
*Brought to you by FoldForge - The Institutional-Grade EA Testing Platform for MetaTrader.*
*Visit [foldforge.app](https://foldforge.app) to start your 7-day free trial.*
