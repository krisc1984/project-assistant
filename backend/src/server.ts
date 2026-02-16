import app from './app';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const run = async () => {
  const application = app();
  application.listen(PORT, () => {
    console.log(`Phase 2 app listening on http://localhost:${PORT}`);
  });
};

export default run;
