import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

async function testRoutesAPI() {
  console.log('🧪 Testing Routes API...\n');

  try {
    // Test 1: Get public routes
    console.log('1️⃣ Testing GET /routes/public');
    const response = await fetch(`${API_URL}/routes/public`);
    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('Number of routes:', data.data?.length || 0);
    console.log('\n---\n');

    // Test 2: Get popular routes
    console.log('2️⃣ Testing GET /routes/popular');
    const response2 = await fetch(`${API_URL}/routes/popular?limit=5`);
    const data2 = await response2.json();

    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(data2, null, 2));
    console.log('Number of popular routes:', data2.data?.routes?.length || 0);
    console.log('\n---\n');

    // Test 3: Check if server is running
    console.log('3️⃣ Testing server health');
    const response3 = await fetch('http://localhost:5000/health');
    const data3 = await response3.json();
    console.log('Health check:', data3);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️ Make sure backend server is running on port 5000');
    console.log('Run: cd backend && npm run dev');
  }
}

testRoutesAPI();
