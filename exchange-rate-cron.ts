/**
 * Viking Peptides — Exchange Rate Cache
 * Fetches TON/USD and USDT/USD every 5 minutes from CoinGecko
 * Stores in vp_exchange_rates table for frontend price conversion
 *
 * Integrated into the engine cron system (index.ts):
 *   import { fetchExchangeRates } from '../viking-peptides/exchange-rate-cron';
 *   cron.schedule('*/5 * * * *', fetchExchangeRates);
 */

import { Pool } from 'pg';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';
const PAIRS = [
  { id: 'the-open-network', pair: 'TON_USD' },
  { id: 'tether', pair: 'USDT_USD' },
];

let pool: Pool | null = null;

export function initExchangeRateCron(dbPool: Pool) {
  pool = dbPool;
}

export async function fetchExchangeRates(): Promise<void> {
  if (!pool) {
    console.error('[VP-rates] Pool not initialized');
    return;
  }

  try {
    const ids = PAIRS.map(p => p.id).join(',');
    const url = `${COINGECKO_URL}?ids=${ids}&vs_currencies=usd`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'VikingPeptides/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`[VP-rates] CoinGecko returned ${response.status}`);
      return;
    }

    const data = await response.json() as Record<string, { usd: number }>;

    for (const { id, pair } of PAIRS) {
      const rate = data[id]?.usd;
      if (rate && rate > 0) {
        await pool.query(
          `INSERT INTO vp_exchange_rates (pair, rate, source, fetched_at) VALUES ($1, $2, 'coingecko', NOW())`,
          [pair, rate]
        );
      }
    }

    // Cleanup: keep only last 24h of rates (288 rows per pair at 5min intervals)
    await pool.query(
      `DELETE FROM vp_exchange_rates WHERE fetched_at < NOW() - INTERVAL '24 hours'`
    );

    console.log('[VP-rates] Exchange rates updated');
  } catch (err: any) {
    console.error('[VP-rates] Fetch error:', err.message);
  }
}
