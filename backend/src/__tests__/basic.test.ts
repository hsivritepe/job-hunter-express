import { connectTestDB, clearTestDB, closeTestDB } from './setup';

// Basic test to verify our setup works
async function runBasicTests() {
    console.log('🧪 Starting basic tests...');

    try {
        // Test database connection
        await connectTestDB();
        console.log('✅ Database connection successful');

        // Test database clearing
        await clearTestDB();
        console.log('✅ Database clearing successful');

        // Test database closing
        await closeTestDB();
        console.log('✅ Database closing successful');

        console.log('🎉 All basic tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runBasicTests();
}

export { runBasicTests };
