const axios = require('axios');

async function callCruXAPI() {
  try {
    const response = await axios.get('https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=AIzaSyAf0EHL9xP4tQwHNAIYTBWeDZBB_Ij2gys');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling CruX API:', error.message);
    throw error;
  }
}

callCruXAPI()
  .then((response) => {
    console.log('API response:', response);
    process.stdout.write(`::set-output name=response::${response}`);
  })
  .catch((error) => {
    process.exitCode = 1;
  });