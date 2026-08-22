require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');

// The Coordinator API uses 5000 and the Sales Manager API uses 5001, so the
// Sales Head API runs on 5002. An explicit PORT other than 5000/5001 still wins.
const reserved = ['5000', '5001'];
const PORT = (process.env.PORT && !reserved.includes(String(process.env.PORT))) ? process.env.PORT : 5002;

// Ensure the Sales Head portal account exists (created once; never overwrites a changed password)
const ensureHeadUser = async () => {
  try {
    const email = 'salestescostructures@gmail.com';
    const existing = await User.findOne({ email, role: 'Sales Head' });
    if (!existing) {
      await User.create({ name: 'Saleem Khan', email, employeeId: 'EMP-HEAD', role: 'Sales Head', password: 'head123' });
      console.log('Seeded Sales Head account');
    }
  } catch (e) { console.error('ensureHeadUser error:', e.message); }
};

connectDB().then(async () => {
  await ensureHeadUser();
  app.listen(PORT, () => {
    console.log(`Nexus CRM API running on http://localhost:${PORT}`);
  });
});
