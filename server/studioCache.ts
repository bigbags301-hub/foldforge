/**
 * Studio Cache System
 * High-performance caching for backtest results, metrics, and visualizations
 * Reduces database queries and improves response times
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class StudioCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start cleanup interval
    this.startCleanup();
  }

  /**
   * Set a cache entry
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get a cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      entries: this.cache.size,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Estimate memory usage (rough estimate)
   */
  private estimateMemoryUsage(): number {
    let bytes = 0;
    for (const entry of this.cache.values()) {
      bytes += JSON.stringify(entry.data).length;
    }
    return bytes;
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
      }
    }, 60 * 1000); // Run every minute
  }

  /**
   * Stop cleanup interval
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Cache key generators for common queries
   */
  static keys = {
    runMetrics: (runId: number) => `run:metrics:${runId}`,
    runDetails: (runId: number) => `run:details:${runId}`,
    userRuns: (userId: number) => `user:runs:${userId}`,
    monteCarloResult: (runId: number) => `mc:result:${runId}`,
    walkForwardResult: (runId: number) => `wf:result:${runId}`,
    stressTestResult: (runId: number) => `st:result:${runId}`,
    platformStats: () => `platform:stats`,
  };
}

// Export singleton instance
export const studioCache = new StudioCache();
export type { CacheEntry };
