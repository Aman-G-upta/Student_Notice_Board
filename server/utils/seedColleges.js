/*
 * Adds (or updates) the colleges that users can pick during registration.
 * Edit the list below, then run:  npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const College = require('../models/College');

const colleges = [
  { name: 'Thakur College of Engineering and Technology', code: 'TCET', address: 'Mumbai, Maharashtra' },
  { name: 'Dwarkadas J. Sanghvi College of Engineering', code: 'DJSCE', address: 'Pune, Maharashtra' },
  { name: 'Pravin Patil College of Diploma & Engineering ', code: 'PPC', address: 'Nagpur, Maharashtra' },
];

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing in server/.env');
    await mongoose.connect(process.env.MONGO_URI);
    for (const c of colleges) {
      await College.findOneAndUpdate({ code: c.code }, c, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log(`Saved: ${c.name} (${c.code})`);
    }
    console.log('Done.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
