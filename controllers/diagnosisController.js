const dotenv = require("dotenv");
dotenv.config();
const diagnosisServiceHandlers = require("../services/diagnosisService");
// function MessageBuilder(result, isError, message) {
//   let payload = {
//     result: result,
//     error: isError,
//     message: message,
//   };
//   return payload;
// }

function SimpleTextResponse(text) {
  return {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: text,
              },
            },
          ],
        },
      },
    },
  };
}

function SimpleTextResponseWithSuggestions(text, suggestions) {
  return {
    payload: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: text,
              },
            },
          ],
          suggestions: suggestions,
        },
      },
    },
  };
}
var sessionData = [];
var threshold = 0.40;
exports.getDiagnosis = async (req, res) => {
  //IF YesIntent
  //Append and call Evidence API again
  //IF NoIntent
  //Append and call Evidence API again
  //IF Dont know intent
  // Append and call Evidence API again

  if (req.body.queryResult.intent.displayName === "DiagnosisIntent") {
    console.log("DiagnosisIntent");
    console.log("Current Session Data: ", sessionData);
    console.log("Request: ", JSON.stringify(req.body));
    let params = req.body.queryResult.parameters;
    let parserPayload = {
      age: {
        value: params.age,
      },
      gender: params.gender,
      text: params.symptom,
    };

    // Call this API and get standard evidence from NLP
    const parserResponse = await diagnosisServiceHandlers.getParsedSymptoms(
      parserPayload
    );
    console.log("Parser Response: ", parserResponse);

    let evidence = [];
    parserResponse.mentions.forEach((mention) => {
      evidence.push({
        id: mention.id,
        choice_id: mention.choice_id,
      });
    });

    let evidencePayload = {
      sex: params.gender,
      age: {
        value: params.age,
      },
      evidence: evidence,
    };

    const evidenceResponse =
      await diagnosisServiceHandlers.getDiagnoisWithEvidence(evidencePayload);
    console.log("Evidence Response : ", JSON.stringify(evidenceResponse));
    let followUpQuestion =
      evidenceResponse.question.text +
      " " +
      "Would you say " +
      evidenceResponse.question.items[0].name +
      "?";

    // Save data to session
    sessionData.push({
      session: "1234",
      evidence: evidencePayload,
      lastQuestionSymptom: evidenceResponse.question.items[0].id,
    });

    res.status(200).json(
      SimpleTextResponseWithSuggestions(followUpQuestion, [
        {
          title: "Yes",
        },
        {
          title: "No",
        },
        {
          title: "Don't Know",
        },
      ])
    );
    // Yes Intent
  } else if (req.body.queryResult.intent.displayName === "YesIntent") {
    console.log("YesIntent");
    console.log("Current Session Data: ", sessionData);
    console.log("Request: ", JSON.stringify(req.body));
    var index;
    if (sessionData.findIndex((x) => x.session === "1234") > -1) {
      console.log("session found");
      index = sessionData.findIndex((x) => x.session === "1234");
      sessionData[index].evidence.evidence.push({
        id: sessionData[index].lastQuestionSymptom,
        choice_id: "present",
      });
    } else {
      //new session
      console.log("this is a new session");
    }

    console.log("Current Payload to be sent: ", sessionData[index].evidence);

    const evidenceResponse =
      await diagnosisServiceHandlers.getDiagnoisWithEvidence(
        sessionData[index].evidence
      );
    console.log("Evidence Response : ", JSON.stringify(evidenceResponse));
    // Check Condition
    if (evidenceResponse.conditions[0].probability > threshold) {
      const specialistResponse = await diagnosisServiceHandlers.getSpecialist(sessionData[index].evidence)
      let specialist = "I would recommend you to consider a " + specialistResponse.recommended_channel.replace("_", " ") + " to a " + specialistResponse.recommended_specialist.name;
      
        //Time to give answer
      let answer = "Based on your inputs, there is a possibility that you might have " + evidenceResponse.conditions[0].name + ". " + specialist;

      res.status(200).json(SimpleTextResponse(answer));
    } else {
      let followUpQuestion =
        evidenceResponse.question.text +
        " " +
        "Would you say " +
        evidenceResponse.question.items[0].name +
        "?";

      // Save data to session
      sessionData[index].lastQuestionSymptom =
        evidenceResponse.question.items[0].id;

      res.status(200).json(
        SimpleTextResponseWithSuggestions(followUpQuestion, [
          {
            title: "Yes",
          },
          {
            title: "No",
          },
          {
            title: "Don't Know",
          },
        ])
      );
    }
  }
  // No Intent
  else if (req.body.queryResult.intent.displayName === "NoIntent") {
    console.log("NoIntent");
    console.log("Current Session Data: ", sessionData);
    console.log("Request: ", JSON.stringify(req.body));
    var index;
    if (sessionData.findIndex((x) => x.session === "1234") > -1) {
      console.log("session found");
      index = sessionData.findIndex((x) => x.session === "1234");
      sessionData[index].evidence.evidence.push({
        id: sessionData[index].lastQuestionSymptom,
        choice_id: "absent",
      });
    } else {
      //new session
      console.log("this is a new session");
    }

    console.log("Current Payload to be sent: ", sessionData[index].evidence);

    const evidenceResponse =
      await diagnosisServiceHandlers.getDiagnoisWithEvidence(
        sessionData[index].evidence
      );
    console.log("Evidence Response : ", JSON.stringify(evidenceResponse));
    if (evidenceResponse.conditions[0].probability > threshold) {
        const specialistResponse = await diagnosisServiceHandlers.getSpecialist(sessionData[index].evidence)
        let specialist = "I would recommend you to consider a " + specialistResponse.recommended_channel.replace("_", " ") + " to a " + specialistResponse.recommended_specialist.name;
        
          //Time to give answer
        let answer = "Based on your inputs, there is a possibility that you might have " + evidenceResponse.conditions[0].name + ". " + specialist;
      res.status(200).json(SimpleTextResponse(answer));
    } else {
      let followUpQuestion =
        evidenceResponse.question.text +
        " " +
        "Would you say " +
        evidenceResponse.question.items[0].name +
        "?";

      // Save data to session
      sessionData[index].lastQuestionSymptom =
        evidenceResponse.question.items[0].id;

      res.status(200).json(
        SimpleTextResponseWithSuggestions(followUpQuestion, [
          {
            title: "Yes",
          },
          {
            title: "No",
          },
          {
            title: "Don't Know",
          },
        ])
      );
    }
  }

  // Dont Know Intent
  else if (req.body.queryResult.intent.displayName === "DontKnowIntent") {
    console.log("DontKnowIntent");
    console.log("Current Session Data: ", sessionData);
    console.log("Request: ", JSON.stringify(req.body));
    var index;
    if (sessionData.findIndex((x) => x.session === "1234") > -1) {
      console.log("session found");
      index = sessionData.findIndex((x) => x.session === "1234");
      sessionData[index].evidence.evidence.push({
        id: sessionData[index].lastQuestionSymptom,
        choice_id: "unknown",
      });
    } else {
      //new session
      console.log("this is a new session");
    }

    console.log("Current Payload to be sent: ", sessionData[index].evidence);

    const evidenceResponse =
      await diagnosisServiceHandlers.getDiagnoisWithEvidence(
        sessionData[index].evidence
      );
    console.log("Evidence Response : ", JSON.stringify(evidenceResponse));
    if (evidenceResponse.conditions[0].probability > threshold) {
        const specialistResponse = await diagnosisServiceHandlers.getSpecialist(sessionData[index].evidence)
        let specialist = "I would recommend you to consider a " + specialistResponse.recommended_channel.replace("_", " ") + " to a " + specialistResponse.recommended_specialist.name;
        
          //Time to give answer
        let answer = "Based on your inputs, there is a possibility that you might have " + evidenceResponse.conditions[0].name + ". " + specialist;
      res.status(200).json(SimpleTextResponse(answer));
    } else {
      let followUpQuestion =
        evidenceResponse.question.text +
        " " +
        "Would you say " +
        evidenceResponse.question.items[0].name +
        "?";

      // Save data to session
      sessionData[index].lastQuestionSymptom =
        evidenceResponse.question.items[0].id;

      res.status(200).json(
        SimpleTextResponseWithSuggestions(followUpQuestion, [
          {
            title: "Yes",
          },
          {
            title: "No",
          },
          {
            title: "Don't Know",
          },
        ])
      );
    }
  }
};
