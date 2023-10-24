import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import webPartCreator from "../Changer/Web_Part_Creator.js";
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

//Getting data from Form (User_Interface.html) after submission and processing to create every part of the website
app.post("/submit-form", async (formData) => {
  formData = formData.body;
  const webParts = [
    "Title",
    "Header",
    "Section1",
    "Section2",
    "Section3",
    // "Section4",
    "Section5",
    "Footer",
  ];
  for (let webPart of webParts) {
    try {
      const statusPart = await webPartCreator(formData, webPart);
      console.log(
        chalk.bold.magenta("Status for " + webPart + ": ") +
          chalk.green(statusPart)
      );
    } catch (error) {
      console.error(
        chalk.bold.magenta("Error occurred for " + webPart + " part: ") +
          chalk.red(error)
      );
    }
  }
});

// Calling API of AI(ChatGPT)
app.post("/Call_Chat-GPT", async (req, res) => {
  const data = req.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Generate code for websites. (Put code in this format: $HTML {code} !HTML , $CSS {code} !CSS , $JavaScript {code} !JavaScript on separate files)[Use only English]",
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

// Calling API of AI(Dall-E)
app.post("/Call_Dall-E", async (req, res) => {
  const instructions = req.body;
  const response = await openai.createImage({
    prompt: `${instructions.string}`,
    n: 1,
    // size: "256x256",
    // size: "512x512",
    // size: "1024x1024",
    size: `${instructions.size}`,
    response_format: "b64_json",
  });
  res.json({
    response: response.data,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
