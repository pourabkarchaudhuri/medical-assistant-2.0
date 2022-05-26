const express = require("express");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.post("/predict", async (req, res, next) => {
  try {
    console.log("REQ BODY", req.body);
    res.status(200).json({
      payload: {
        google: {
          expectUserResponse: true,
          richResponse: {
            items: [
              {
                simpleResponse: {
                  textToSpeech: "These are suggestion chips.",
                },
              },
              {
                simpleResponse: {
                  textToSpeech:
                    "Which type of response would you like to see next?",
                },
              },
            ],
            suggestions: [
              {
                title: "Suggestion 1",
              },
              {
                title: "Suggestion 2",
              },
              {
                title: "Suggestion 3",
              },
            ],
            linkOutSuggestion: {
              destinationName: "Suggestion Link",
              url: "https://assistant.google.com/",
            },
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      payload: {
        google: {
          expectUserResponse: true,
          richResponse: {
            items: [
              {
                simpleResponse: {
                  textToSpeech: "Go to the doctor!",
                },
              },
            ],
          },
        },
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
