const axios = require('axios');
const config = require('./config.json');
const cruxKey = process.env.CRUX_KEY;

const responseArray = [];

async function callCruXAPI(payload,cruxKey) {
    try {

      const apiUrl = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${cruxKey}`;
      const response = await axios.post(apiUrl, payload);
      //console.log(response.data);
      return response.data;

    } 
    catch (error) 
    {
      console.error('Error calling CruX API:', error.message);
      throw error;
    }
  }


async function run() {
  try {
    for (const payload of config) 
    {
      await callCruXAPI(payload,cruxKey)
      .then((response) => {
        //console.log('API response:', response);
        responseArray.push(response);
      })
    }
  }
  catch (error)
    {process.exitCode =1;}
  finally 
  {
    console.log('responseArray',JSON.stringify(responseArray));
    //process.stdout.write(`::set-output name=response::${response}`);
    process.stdout.write(`echo "{response}=${responseArray}" >> $GITHUB_OUTPUT`);
  }
}

run();