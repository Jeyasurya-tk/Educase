const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('--- STARTING API TESTS ---');

  // Test Case 1: Healthy root
  try {
    const res = await fetch(`${BASE_URL}/`);
    const data = await res.json();
    console.log('Test 1 (GET /): Status:', res.status, 'Response:', data);
  } catch (err) {
    console.error('Test 1 failed:', err.message);
  }

  // Test Case 2: Validation failure on POST /addSchool (missing name)
  try {
    const res = await fetch(`${BASE_URL}/addSchool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: 'No Name School Address',
        latitude: 10,
        longitude: 20
      }),
    });
    const data = await res.json();
    console.log('Test 2 (POST /addSchool Validation Error - missing name): Status:', res.status, 'Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test 2 failed:', err.message);
  }

  // Test Case 3: Validation failure on POST /addSchool (latitude out of range)
  try {
    const res = await fetch(`${BASE_URL}/addSchool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bad Lat School',
        address: 'Somewhere',
        latitude: 150, // invalid, must be [-90, 90]
        longitude: 80
      }),
    });
    const data = await res.json();
    console.log('Test 3 (POST /addSchool Validation Error - latitude out of bounds): Status:', res.status, 'Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test 3 failed:', err.message);
  }

  // Test Case 4: Validation failure on GET /listSchools (missing query params)
  try {
    const res = await fetch(`${BASE_URL}/listSchools`);
    const data = await res.json();
    console.log('Test 4 (GET /listSchools Validation Error - missing query params): Status:', res.status, 'Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test 4 failed:', err.message);
  }

  // Test Case 5: Success GET /listSchools
  try {
    const res = await fetch(`${BASE_URL}/listSchools?latitude=13.0827&longitude=80.2707`);
    const data = await res.json();
    console.log('Test 5 (GET /listSchools Success): Status:', res.status, 'Response school count:', data.count);
  } catch (err) {
    console.error('Test 5 failed:', err.message);
  }

  console.log('--- TESTS COMPLETED ---');
}

runTests();
