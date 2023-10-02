import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import changer from "../Changer/Change_Basic_File.js";
import { config } from "dotenv";
config({ path: "../.env" });
import chalk from "chalk";

const configuration = new Configuration({
  organization: process.env.ORGANIZATION, //get ID form OpenAI
  apiKey: process.env.API_KEY, //get the key form OpenAI
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

//Getting Form Data
app.post("/submit-form", async (req, res) => {
  const data = req.body;
  const tags = [
    "Title",
    "header",
    "section1",
    "section2",
    "section3",
    "section5",
    "footer",
  ];
  //'title', 'header', 'section1', 'section2', 'section3', 'section4', 'section5','footer', 'script'];
  for (const tag of tags) {
    try {
      const result = await changer(data, tag);
      console.log(
        chalk.bold.magenta("Status for " + tag + ": ") + chalk.green(result)
      );
    } catch (error) {
      console.error(
        chalk.bold.magenta("Error occurred for the tag " + tag + ": ") +
          chalk.red(error)
      );
    }
  }
  res.json("DONE!");
});

app.post("/Call", async (req, res) => {
  // Calling API of AI(ChatGPT)
  const data = req.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Generate code for websites. (Put code in this format: $HTML {code} !HTML , $CSS {code} !CSS , $JavaScript {code} !JavaScript)",
      },
      {
        role: "user",
        content: `${data.string}`,
      },
    ],
  });
  res.json({
    completion: completion.data.choices[0].message,
  });
});

app.post("/Call_Dall-E", async (req, res) => {
  // Calling API of AI(Dall-E)
  const data = req.body;
  console.log(data);

  const response = await openai.createImage({
    prompt: `${data.msg}`,
    n: 1,
    // size: "256x256",
    // size: "512x512",
    // size: "1024x1024",
    size: `${data.size}`,
    response_format: "b64_json",
  });
  res.json({
    response: response.data,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
