const express = require("express");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.post("/predict", async (req, res, next) => {
  try {
    console.log("REQ BODY", req.body);
    res.status(200).json({
      fulfillmentMessages: [
        {
          text: {
            text: ["Success"],
          },
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      fulfillmentMessages: [
        {
          text: {
            text: ["failed"],
          },
        },
      ],
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
