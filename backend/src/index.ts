import run from './server';

run().catch((err) => {
  // surface error in startup
  console.error('Failed to start server:', err);
  process.exit(1);
});
