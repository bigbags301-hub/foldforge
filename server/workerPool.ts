/**
 * Advanced Worker Pool System
 * Handles background processing of Monte Carlo, Walk-Forward, and Stress Tests
 * Non-blocking, high-performance processing with real-time status updates
 */

import { EventEmitter } from 'events';

interface WorkerTask {
  id: string;
  type: 'backtest' | 'monteCarlo' | 'walkForward' | 'stressTest';
  userId: number;
  runId: number;
  config: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

class WorkerPool extends EventEmitter {
  private tasks: Map<string, WorkerTask> = new Map();
  private activeWorkers: number = 0;
  private maxWorkers: number = 4; // CPU-bound, limit to 4 concurrent
  private queue: WorkerTask[] = [];

  constructor(maxWorkers: number = 4) {
    super();
    this.maxWorkers = maxWorkers;
  }

  /**
   * Submit a task to the worker pool
   */
  submitTask(task: Omit<WorkerTask, 'status' | 'progress' | 'createdAt'>): string {
    const id = `${task.type}_${task.runId}_${Date.now()}`;
    const fullTask: WorkerTask = {
      ...task,
      id,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };

    this.tasks.set(id, fullTask);
    this.queue.push(fullTask);
    this.processQueue();
    return id;
  }

  /**
   * Process the task queue
   */
  private async processQueue(): Promise<void> {
    while (this.activeWorkers < this.maxWorkers && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.activeWorkers++;
        this.executeTask(task).finally(() => {
          this.activeWorkers--;
          this.processQueue();
        });
      }
    }
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: WorkerTask): Promise<void> {
    try {
      task.status = 'running';
      task.startedAt = new Date();
      this.emit('taskStarted', task);

      // Simulate work with progress updates
      const result = await this.runTaskWithProgress(task);

      task.result = result;
      task.status = 'completed';
      task.completedAt = new Date();
      this.emit('taskCompleted', task);
    } catch (error) {
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.status = 'failed';
      task.completedAt = new Date();
      this.emit('taskFailed', task);
    }

    this.tasks.set(task.id, task);
  }

  /**
   * Run task with progress updates
   */
  private async runTaskWithProgress(task: WorkerTask): Promise<any> {
    switch (task.type) {
      case 'monteCarlo':
        return this.runMonteCarloWithProgress(task);
      case 'walkForward':
        return this.runWalkForwardWithProgress(task);
      case 'stressTest':
        return this.runStressTestWithProgress(task);
      default:
        return { success: true };
    }
  }

  /**
   * Monte Carlo with progress tracking
   */
  private async runMonteCarloWithProgress(task: WorkerTask): Promise<any> {
    const { numSimulations = 1000 } = task.config;
    const results = [];

    for (let i = 0; i < numSimulations; i++) {
      // Simulate Monte Carlo calculation
      const simulation = {
        id: i,
        finalEquity: 100000 + Math.random() * 50000 - 25000,
        maxDrawdown: Math.random() * 0.3,
        sharpeRatio: Math.random() * 2,
      };
      results.push(simulation);

      // Update progress every 100 simulations
      if (i % 100 === 0) {
        task.progress = (i / numSimulations) * 100;
        this.emit('taskProgress', task);
      }

      // Yield to event loop
      if (i % 50 === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }

    task.progress = 100;
    this.emit('taskProgress', task);

    return {
      simulations: results,
      stats: {
        avgEquity: results.reduce((sum, r) => sum + r.finalEquity, 0) / results.length,
        worstCase: Math.min(...results.map(r => r.finalEquity)),
        bestCase: Math.max(...results.map(r => r.finalEquity)),
        avgMaxDrawdown: results.reduce((sum, r) => sum + r.maxDrawdown, 0) / results.length,
      },
    };
  }

  /**
   * Walk-Forward with progress tracking
   */
  private async runWalkForwardWithProgress(task: WorkerTask): Promise<any> {
    const { numWindows = 6 } = task.config;
    const results = [];

    for (let i = 0; i < numWindows; i++) {
      // Simulate Walk-Forward window
      const window = {
        windowId: i,
        inSampleReturn: Math.random() * 0.3,
        outOfSampleReturn: Math.random() * 0.25,
        consistency: Math.random() * 0.9,
      };
      results.push(window);

      task.progress = ((i + 1) / numWindows) * 100;
      this.emit('taskProgress', task);

      // Yield to event loop
      await new Promise(resolve => setImmediate(resolve));
    }

    return {
      windows: results,
      stats: {
        avgInSampleReturn: results.reduce((sum, r) => sum + r.inSampleReturn, 0) / results.length,
        avgOutOfSampleReturn: results.reduce((sum, r) => sum + r.outOfSampleReturn, 0) / results.length,
        consistency: results.reduce((sum, r) => sum + r.consistency, 0) / results.length,
      },
    };
  }

  /**
   * Stress Test with progress tracking
   */
  private async runStressTestWithProgress(task: WorkerTask): Promise<any> {
    const stressFactors = [0.5, 0.75, 1.0, 1.25, 1.5];
    const results = [];

    for (let i = 0; i < stressFactors.length; i++) {
      const factor = stressFactors[i];
      // Simulate stress test
      const stressResult = {
        factor,
        finalEquity: 100000 * (1 - factor * 0.1),
        maxDrawdown: 0.2 * factor,
        profitFactor: 1.5 / factor,
      };
      results.push(stressResult);

      task.progress = ((i + 1) / stressFactors.length) * 100;
      this.emit('taskProgress', task);

      await new Promise(resolve => setImmediate(resolve));
    }

    return {
      stressTests: results,
      stats: {
        breakingPoint: 1.5,
        avgDrawdown: results.reduce((sum, r) => sum + r.maxDrawdown, 0) / results.length,
      },
    };
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): WorkerTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks for a user
   */
  getUserTasks(userId: number): WorkerTask[] {
    return Array.from(this.tasks.values()).filter(t => t.userId === userId);
  }

  /**
   * Get pool statistics
   */
  getStats() {
    const allTasks = Array.from(this.tasks.values());
    return {
      totalTasks: allTasks.length,
      activeTasks: this.activeWorkers,
      queuedTasks: this.queue.length,
      completedTasks: allTasks.filter(t => t.status === 'completed').length,
      failedTasks: allTasks.filter(t => t.status === 'failed').length,
      avgCompletionTime: this.calculateAvgCompletionTime(allTasks),
    };
  }

  private calculateAvgCompletionTime(tasks: WorkerTask[]): number {
    const completed = tasks.filter(t => t.completedAt && t.startedAt);
    if (completed.length === 0) return 0;
    const totalTime = completed.reduce((sum, t) => {
      return sum + (t.completedAt!.getTime() - t.startedAt!.getTime());
    }, 0);
    return totalTime / completed.length;
  }
}

// Export singleton instance
export const workerPool = new WorkerPool(4);
export type { WorkerTask };
