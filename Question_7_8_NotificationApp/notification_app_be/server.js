// const express = require('express'); // 1. Import express
// const axios = require('axios');
// const cors = require('cors');
// const Log = require('../logging_middleware/index');

// const app = express(); // 2. Initialize the app
// app.use(cors());       // 3. Use middleware
// app.use(express.json());

// // ... then your token and routes
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MjIwMkBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4NDEyMywiaWF0IjoxNzc4NDgzMjIzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNjUxNDdiMjQtYjEwMy00NTlkLTg2MDYtY2YwMjM0YWY2MzQxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3Jpc2h0aSBndXB0YSIsInN1YiI6IjVjY2VjMDYzLWVhYTItNDFkNi1iNjA0LTMzNDU4ZTdlZjcxYyJ9LCJlbWFpbCI6ImUyM2NzZXUyMjAyQGJlbm5ldHQuZWR1LmluIiwibmFtZSI6InNyaXNodGkgZ3VwdGEiLCJyb2xsTm8iOiJlMjNjc2V1MjIwMiIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6IjVjY2VjMDYzLWVhYTItNDFkNi1iNjA0LTMzNDU4ZTdlZjcxYyIsImNsaWVudFNlY3JldCI6InNmQVlqalZZa21SV2R0WHEifQ.7bcSiUts6du8m6M2c2upb4itM6vOfV47fKntzRZYwPA";

// app.get('/notifications', async (req, res) => {
//     // This will work now because 'app' exists!
//     try {
//         const response = await axios.get('https://4.224.186.213/evaluation-service/notifications', {
//             headers: { 'Authorization': `Bearer ${TOKEN}` },
//             httpsAgent: httpsAgent
//         });
//         await Log("backend", "info", "controller", "Fetched data", TOKEN);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).send("Error");
//     }
// });

// app.listen(5000, () => console.log('Server running on 5000'));
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());

// This agent is CRITICAL - it tells Node to ignore the SSL certificate error on the IP
const agent = new https.Agent({  
  rejectUnauthorized: false 
});

// Use the long token you just got from Postman
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MjIwMkBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4ODg2OCwiaWF0IjoxNzc4NDg3OTY4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiY2NjYWFmYTAtNGEwNy00NTQwLTljZTctNGI4Yjc3NWRkOWUwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3Jpc2h0aSBndXB0YSIsInN1YiI6IjVjY2VjMDYzLWVhYTItNDFkNi1iNjA0LTMzNDU4ZTdlZjcxYyJ9LCJlbWFpbCI6ImUyM2NzZXUyMjAyQGJlbm5ldHQuZWR1LmluIiwibmFtZSI6InNyaXNodGkgZ3VwdGEiLCJyb2xsTm8iOiJlMjNjc2V1MjIwMiIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6IjVjY2VjMDYzLWVhYTItNDFkNi1iNjA0LTMzNDU4ZTdlZjcxYyIsImNsaWVudFNlY3JldCI6InNmQVlqalZZa21SV2R0WHEifQ.IVmkO8-691z19iGAtlqD514KWFYVgzxJvltS3FWx4Wc";

app.get('/notifications', async (req, res) => {
  try {
    // Attempt 1: The IP from your Token
    const response = await axios.get('http://20.244.56.144/evaluation-service/notifications', {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    res.json(response.data);
  } catch (error) {
    console.log("Attempt 1 failed, trying backup IP...");
    try {
      // Attempt 2: The original IP with the HTTPS Agent
      const backupResponse = await axios.get('https://4.224.186.213/evaluation-service/notifications', {
        headers: { 'Authorization': `Bearer ${TOKEN}` },
        httpsAgent: agent
      });
      res.json(backupResponse.data);
    } catch (err) {
      console.error("Backend Error Detail:", err.response ? err.response.data : err.message);
      res.status(500).json({ error: "External Server Error" });
    }
  }
});

app.listen(5000, () => console.log('Proxy running on port 5000'));