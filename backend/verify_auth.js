const BASE_URL = 'http://localhost:3000';
async function testAuth() {
  console.log('Testing Auth Middleware...');

  // 1. Test No Token
  try {
    const res = await fetch(`${BASE_URL}/api/users/profile`); // Adjust endpoint if needed
    console.log(`No Token: ${res.status} (Expected 401)`);
  } catch (e) {
    console.log('No Token: Error connecting', e.message);
  }

  // 2. Test Invalid Token
  try {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      headers: { Authorization: 'Bearer invalidtoken' }
    });
    console.log(`Invalid Token: ${res.status} (Expected 403)`);
    const data = await res.json();
    console.log('Response Body:', JSON.stringify(data));
    if (data.error === 'Invalid token.') {
      console.log('SUCCESS: New error message detected.');
    } else if (data.error === 'Invalid or expired token.') {
      console.log('WARNING: Old error message detected. Server might not have restarted.');
    } else {
      console.log('UNKNOWN: Unexpected error message.');
    }
  } catch (e) {
    console.log('Invalid Token: Error connecting', e.message);
  }
}

testAuth();
