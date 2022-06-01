const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.APP_ID);
console.log(process.env.APP_KEY);
module.exports = {
  getParsedSymptoms: async (data) => {
    var config = {
      method: "post",
      url: "https://api.infermedica.com/v3/parse",
      headers: {
        "App-Id": process.env.APP_ID,
        "App-Key": process.env.APP_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
    try {
      const { data } = await axios(config);
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  },

  getDiagnoisWithEvidence: async (data) => {
    var config = {
      method: "post",
      url: "https://api.infermedica.com/v3/diagnosis",
      headers: {
        "App-Id": process.env.APP_ID,
        "App-Key": process.env.APP_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
    try {
      const { data } = await axios(config);
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  },

  getSpecialist: async (data) => {
    var config = {
      method: "post",
      url: "https://api.infermedica.com/v3/recommend_specialist",
      headers: {
        "App-Id": process.env.APP_ID,
        "App-Key": process.env.APP_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
    try {
      const { data } = await axios(config);
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
  }
};
