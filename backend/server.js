import dotenv from 'dotenv';
dotenv.config();
const { default: app } = await import('./app.js');
const { default: connectDB } = await import('./config/db.js');
const PORT = process.env.PORT || 5000;
try {
  await connectDB();
  app.listen(PORT, () => console.log(`CareerCoach API running on port ${PORT}`));
} catch (error) {
  console.error('Database connection failed:', error.message);
  process.exit(1);
}