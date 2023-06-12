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
      responseArray.push(
        {
        "origin":jsonData.record.key.origin,
        "formFactor":jsonData.record.key.formFactor,
        "largest_contentful_paint":jsonData.record.metrics["largest_contentful_paint"].percentiles.p75,
        "first_input_delay":jsonData.record.metrics["first_input_delay"].percentiles.p75,
        "cumulative_layout_shift":jsonData.record.metrics["cumulative_layout_shift"].percentiles.p75,
        "first_contentful_paint":jsonData.record.metrics["first_contentful_paint"].percentiles.p75,
        "interaction_to_next_paint":jsonData.record.metrics["interaction_to_next_paint"].percentiles.p75,
        "experimental_time_to_first_byte":jsonData.record.metrics["experimental_time_to_first_byte"].percentiles.p75
        }
        );
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