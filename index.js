const axios = require('axios');

async function callCruXAPI() {
    try {
      const payload = {
        origin: 'https://us.louisvuitton.com/'
      };
  
      const response = await axios.post('https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord?key='+process.env.CRUXKEY, payload);
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