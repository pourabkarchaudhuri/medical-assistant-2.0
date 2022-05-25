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
                  textToSpeech: "Go to the doctor!",
                },
              },
              {
                card: {
                  title: "card title",
                  subtitle: "card text",
                  imageUri: "https://example.com/images/example.png",
                  buttons: [
                    {
                      text: "button text",
                      postback:
                        "https://example.com/path/for/end-user/to/follow",
                    },
                  ],
                },
              },
            ],
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
