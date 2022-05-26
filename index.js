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
                  textToSpeech: "From how many days are you suffering?",
                },
              },
            ],
            suggestions: [
              {
                title: "1",
              },
              {
                title: "2",
              },
              {
                title: "3",
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
