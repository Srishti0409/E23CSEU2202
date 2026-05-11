// // const axios = require('axios');

// // /**
// //  * Reusable Logging Function
// //  * Constraints: Lowercase only for stack, level, package
// //  */
// // const Log = async (stack, level, pkg, message) => {
// //     const TOKEN = "PASTE_YOUR_ACCESS_TOKEN_HERE"; 
// //     const URL = "http://4.224.186.213/evaluation-service/logs";

// //     try {
// //         await axios.post(URL, {
// //             stack: stack.toLowerCase(),
// //             level: level.toLowerCase(),
// //             package: pkg.toLowerCase(),
// //             message: message
// //         }, {
// //             headers: { 'Authorization': `Bearer ${TOKEN}` }
// //         });
// //         console.log(`[LOG SUCCESS]: ${message}`);
// //     } catch (err) {
// //         console.error(`[LOG ERROR]: ${err.response ? err.response.data.message : err.message}`);
// //     }
// // };

// // // Test log immediately (mandatory first function call)
// // Log("backend", "info", "middleware", "Logging middleware setup complete");

// // module.exports = Log;
// const axios = require('axios');

// /**
//  * Reusable Logging Function
//  */
// const Log = async (stack, level, pkg, message) => {
//     // PASTE YOUR TOKEN BELOW. Ensure there are NO spaces or line breaks inside the quotes.
//     const ACCESS_TOKEN = "eyJh...YOUR_TOKEN...".trim(); 
//     const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

//     const payload = {
//         stack: stack.toLowerCase(),
//         level: level.toLowerCase(),
//         package: pkg.toLowerCase(),
//         message: message
//     };

//     try {
//         await axios.post(LOG_API_URL, payload, {
//             headers: { 
//                 'Authorization': `Bearer ${ACCESS_TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(`[LOG SUCCESS]: ${message}`);
//     } catch (err) {
//         // Detailed error for debugging
//         const errorDetail = err.response ? JSON.stringify(err.response.data) : err.message;
//         console.error(`[LOG ERROR]: ${errorDetail}`);
//     }
// };

// module.exports = Log;
const axios = require("axios");
const https = require("https");
const BASE_URL = "https://4.224.186.213/evaluation-service";
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
async function Log(stack, level, pkg, message, token) {
  try {
    const response = await axios.post(
      `${BASE_URL}/logs`,
      {
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      },
      {
        httpsAgent,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Logging failed");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}
module.exports = Log;