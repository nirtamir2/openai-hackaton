export interface WorkerLoopOptions {
  name: string;
  intervalMs: number;
  task: () => Promise<void>;
  setup?: () => Promise<void>;
}

export function createWorkerLoop(options: WorkerLoopOptions) {
  const { name, intervalMs, task, setup } = options;

  async function loop() {
    try {
      await task();
    } catch (error) {
      console.error(`[${name}] Error during iteration:`, error);
    } finally {
      setTimeout(loop, intervalMs);
    }
  }

  async function start() {
    console.log(`Starting worker: ${name}`);
    if (setup) {
      try {
        await setup();
      } catch (error) {
        console.error(`[${name}] Setup failed:`, error);
        process.exit(1);
      }
    }
    loop();
  }

  return { start };
}
