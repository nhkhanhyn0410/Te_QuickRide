import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const cleanDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nFound ${collections.length} collections`);

    // Drop each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Dropping collection: ${collectionName}...`);
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`✓ Dropped ${collectionName}`);
    }

    console.log('\n✓ All collections dropped successfully!');
    console.log('Database is now clean.\n');

  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run the script
cleanDatabase();
