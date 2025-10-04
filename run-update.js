const https = require('https');
const http = require('http');

const postData = JSON.stringify({});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/smart-image-update',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 Starting smart image update...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n📊 UPDATE RESULTS:');
      console.log('==================');
      console.log(`✅ Successful updates: ${result.summary?.successCount || 0}`);
      console.log(`❌ Failed updates: ${result.summary?.errorCount || 0}`);
      console.log(`📝 Total attempts: ${result.summary?.totalUpdates || 0}`);
      
      if (result.results && result.results.length > 0) {
        console.log('\n📋 Detailed Results:');
        result.results.forEach((item, index) => {
          if (item.success) {
            console.log(`${index + 1}. ✅ ${item.name}`);
            console.log(`   Updated to: ${item.newUrl}`);
          } else {
            console.log(`${index + 1}. ❌ ${item.name}`);
            console.log(`   Error: ${item.error}`);
          }
        });
      }
    } catch (err) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(postData);
req.end();