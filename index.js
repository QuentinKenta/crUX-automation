const axios = require('axios');
const config = require('./config.json');
const cruxKey = process.env.CRUX_KEY;

const responseArray = [];

async function callCruXAPI(body,type,testUrl,cruxKey) {
    try {
      const apiUrl = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${cruxKey}`;
      const response = await axios.post(apiUrl,body);
      const originOrUrl = type;
      const result = new  Array;
      result.push(
        {
          "originOrUrl":originOrUrl,
          "testUrl":testUrl,
          "responseData":response.data
        }
      );
      return result;

    } 
    catch (error) 
    {
      console.error('Error calling CruX API:', error.message);
      throw error;
    }
  }


function pushResponse(originOrUrl,testUrl,responseData) {
  
  process.stdout.write(`originOrUrl="${originOrUrl}"\n`)

  responseArray.push(
    {
    "originOrUrl" : originOrUrl,
    "testUrl" : testUrl,
    "formFactor":responseData.record.key.formFactor,
    "largest_contentful_paint":responseData.record.metrics["largest_contentful_paint"].percentiles.p75,
    "first_input_delay":responseData.record.metrics["first_input_delay"].percentiles.p75,
    "cumulative_layout_shift":responseData.record.metrics["cumulative_layout_shift"].percentiles.p75,
    "first_contentful_paint":responseData.record.metrics["first_contentful_paint"].percentiles.p75,
    "interaction_to_next_paint":responseData.record.metrics["interaction_to_next_paint"].percentiles.p75,
    "experimental_time_to_first_byte":responseData.record.metrics["experimental_time_to_first_byte"].percentiles.p75
    }
    );
    return responseArray;

}


async function run() {
  try {
    for (const payload of config) 
    {
      const result = await callCruXAPI(payload.body,payload.type,payload.testUrl,cruxKey)
      pushResponse(result[0].originOrUrl,result[0].testUrl,result[0].responseData);
    }
  }
  catch (error)
    {process.exitCode =1;
      console.log(error.message)}
  /*finally 
  {
    console.log('responseArray',JSON.stringify(responseArray));
    //process.stdout.write(`::set-output name=response::${response}`);
    process.stdout.write(`echo "{response}=${responseArray}" >> $GITHUB_OUTPUT`);
  }*/
}

run();