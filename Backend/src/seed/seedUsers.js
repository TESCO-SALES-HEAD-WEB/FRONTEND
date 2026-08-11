// Seed users. Run: npm run seed
// Registers ONLY tescosalescrm@gmail.com (removes any other users first).
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// One Sales Coordinator + four Sales Managers (each with their own login).
// The manager `name` must match the "Assign To" name so assignment notifications route correctly.
const users = [
  { name: 'Indhumathi T', email: 'tescosalescrm@gmail.com', employeeId: 'EMP-COORD', role: 'Sales Coordinator', password: 'coordinator123' },

  { name: 'Azar Abdullah A', email: 'azar.abdul246@gmail.com', employeeId: 'EMP-MGR-AZAR', role: 'Sales Manager', password: 'azarsale123' },
  { name: 'Praveenraja P', email: 'praveenraja@tescostructures.in', employeeId: 'EMP-MGR-PRAVEEN', role: 'Sales Manager', password: 'praveensales123' },
  { name: 'Suresh P', email: 'sureshpcmuthu@gmail.com', employeeId: 'EMP-MGR-SURESH', role: 'Sales Manager', password: 'sureshsales123' },
  { name: 'Agsal A', email: 'agsal@tescostructures.in', employeeId: 'EMP-MGR-AGSAL', role: 'Sales Manager', password: 'agsalsales123' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Wipe all users first so we start clean (passwords are re-hashed on create).
    const removed = await User.deleteMany({});
    if (removed.deletedCount) console.log(`Removed ${removed.deletedCount} existing user(s)`);

    // Allow one email to hold multiple roles: drop the old unique email index, then
    // build the {email, role} unique index defined on the schema (collection is now empty).
    try {
      await User.collection.dropIndex('email_1');
      console.log('Dropped old unique email index');
    } catch (e) {
      // index may not exist — safe to ignore
    }
    await User.syncIndexes();

    for (const u of users) {
      await User.create(u); // password hashed by pre-save hook
      console.log(`Created: ${u.name} <${u.email}> (${u.role})`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
