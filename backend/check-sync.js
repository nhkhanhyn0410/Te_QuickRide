import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const EXPECTED_COLLECTIONS = [
  'users',
  'busoperators',
  'routes',
  'buses',
  'trips',
  'bookings',
  'payments',
  'tickets',
  'staffs',  // Note: collection is 'staffs' not 'staff'
  'reviews',
  'vouchers',
  'notifications',
  'systemlogs',
  'settings'
];

async function checkSync() {
  console.log('🔍 TE_QUICKRIDE SYNC CHECKER\n');
  console.log('=' .repeat(60));

  try {
    // 1. Database Connection
    console.log('\n📊 PHASE 1: DATABASE CONNECTION');
    console.log('-'.repeat(60));

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/te_quickride');
    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);

    // 2. Check Collections
    console.log('\n📦 PHASE 2: COLLECTIONS CHECK');
    console.log('-'.repeat(60));

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log(`Found ${collectionNames.length} collections:`);

    let missingCollections = [];
    for (const expected of EXPECTED_COLLECTIONS) {
      const exists = collectionNames.includes(expected);
      console.log(`  ${exists ? '✅' : '❌'} ${expected}`);
      if (!exists) missingCollections.push(expected);
    }

    if (missingCollections.length > 0) {
      console.log(`\n⚠️  Missing collections: ${missingCollections.join(', ')}`);
      console.log('   Run: npm run seed');
    }

    // 3. Document Counts
    console.log('\n📈 PHASE 3: DOCUMENT COUNTS');
    console.log('-'.repeat(60));

    const counts = {};
    for (const collName of collectionNames) {
      const count = await mongoose.connection.db.collection(collName).countDocuments();
      counts[collName] = count;

      const status = count > 0 ? '✅' : '⚠️ ';
      console.log(`  ${status} ${collName.padEnd(20)} ${count} documents`);
    }

    // 4. Check Field Names in Trip
    console.log('\n🔍 PHASE 4: TRIP FIELD NAMES CHECK');
    console.log('-'.repeat(60));

    const tripSample = await mongoose.connection.db.collection('trips').findOne();
    if (tripSample) {
      const hasDriverId = tripSample.driverId !== undefined;
      const hasManagerId = tripSample.managerId !== undefined;
      const hasDriver = tripSample.driver !== undefined;
      const hasTripManager = tripSample.tripManager !== undefined;

      console.log('  Field name verification:');
      console.log(`    ${hasDriverId ? '✅' : '❌'} driverId field ${hasDriverId ? 'exists' : 'MISSING'}`);
      console.log(`    ${hasManagerId ? '✅' : '❌'} managerId field ${hasManagerId ? 'exists' : 'MISSING'}`);
      console.log(`    ${!hasDriver ? '✅' : '❌'} driver field ${!hasDriver ? 'NOT present (good)' : 'EXISTS (WRONG!)'}`);
      console.log(`    ${!hasTripManager ? '✅' : '❌'} tripManager field ${!hasTripManager ? 'NOT present (good)' : 'EXISTS (WRONG!)'}`);

      if (hasDriver || hasTripManager) {
        console.log('\n  ⚠️  WARNING: Found incorrect field names!');
        console.log('     Action needed: Update seed data and re-seed database');
      }

      // Show sample trip structure
      console.log('\n  Sample trip structure:');
      console.log(`    Trip ID: ${tripSample._id}`);
      console.log(`    driverId: ${tripSample.driverId || 'null'}`);
      console.log(`    managerId: ${tripSample.managerId || 'null'}`);
      if (hasDriver) console.log(`    ⚠️  driver: ${tripSample.driver} (SHOULD NOT EXIST)`);
      if (hasTripManager) console.log(`    ⚠️  tripManager: ${tripSample.tripManager} (SHOULD NOT EXIST)`);
    } else {
      console.log('  ⚠️  No trips found in database');
    }

    // 5. Check Active Status
    console.log('\n✨ PHASE 5: ACTIVE STATUS CHECK');
    console.log('-'.repeat(60));

    const activeRoutes = await mongoose.connection.db.collection('routes').countDocuments({ isActive: true });
    const activeBuses = await mongoose.connection.db.collection('buses').countDocuments({ isActive: true });
    const approvedOperators = await mongoose.connection.db.collection('busoperators').countDocuments({ verificationStatus: 'approved' });

    console.log(`  Active routes: ${activeRoutes} ${activeRoutes >= 2 ? '✅' : '⚠️  (need at least 2)'}`);
    console.log(`  Active buses: ${activeBuses} ${activeBuses >= 2 ? '✅' : '⚠️  (need at least 2)'}`);
    console.log(`  Approved operators: ${approvedOperators} ${approvedOperators >= 1 ? '✅' : '⚠️  (need at least 1)'}`);

    // 6. Check Data Integrity
    console.log('\n🔗 PHASE 6: DATA INTEGRITY CHECK');
    console.log('-'.repeat(60));

    // Check for orphaned bookings
    const allBookings = await mongoose.connection.db.collection('bookings').find().toArray();
    let orphanedBookings = 0;
    for (const booking of allBookings) {
      const tripExists = await mongoose.connection.db.collection('trips').findOne({ _id: booking.tripId });
      if (!tripExists) orphanedBookings++;
    }
    console.log(`  Orphaned bookings: ${orphanedBookings} ${orphanedBookings === 0 ? '✅' : '⚠️  (fix needed)'}`);

    // Check for orphaned trips
    const allTrips = await mongoose.connection.db.collection('trips').find().toArray();
    let orphanedTrips = 0;
    for (const trip of allTrips) {
      const routeExists = await mongoose.connection.db.collection('routes').findOne({ _id: trip.routeId });
      const busExists = await mongoose.connection.db.collection('buses').findOne({ _id: trip.busId });
      if (!routeExists || !busExists) orphanedTrips++;
    }
    console.log(`  Orphaned trips: ${orphanedTrips} ${orphanedTrips === 0 ? '✅' : '⚠️  (fix needed)'}`);

    // 7. Summary
    console.log('\n📋 SUMMARY');
    console.log('='.repeat(60));

    const issues = [];

    if (missingCollections.length > 0) {
      issues.push(`Missing ${missingCollections.length} collections`);
    }

    if (counts.routes === 0 || counts.trips === 0) {
      issues.push('No trips or routes data');
    }

    if (tripSample && (tripSample.driver !== undefined || tripSample.tripManager !== undefined)) {
      issues.push('Incorrect field names in Trip model');
    }

    if (activeRoutes < 2) {
      issues.push('Not enough active routes');
    }

    if (orphanedBookings > 0 || orphanedTrips > 0) {
      issues.push('Data integrity issues');
    }

    if (issues.length === 0) {
      console.log('✅ All checks passed! Database is in sync.');
      console.log('\n🚀 System ready to use!');
    } else {
      console.log('⚠️  Issues found:');
      issues.forEach((issue, i) => {
        console.log(`  ${i + 1}. ${issue}`);
      });
      console.log('\n🔧 Recommended actions:');
      console.log('  1. Run: cd backend && npm run seed');
      console.log('  2. Check backend/src/seeders/seedData.js for correct field names');
      console.log('  3. Restart backend: npm run dev');
    }

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the check
checkSync();
