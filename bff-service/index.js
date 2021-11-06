
import axios from "axios";
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

console.log(process.env);

app.use(express.json());

app.all("/*", (req, res) => {
  const recipient = req.originalUrl.split("/")[1];
  console.log(req.originalUrl);

  const recipientUrl = process.env[recipient];
  console.log(recipientUrl);

  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };

    axios(axiosConfig)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: "Cannot process request" });
  }
});

app.listen(port, () => console.log(`Service port ${port}`));