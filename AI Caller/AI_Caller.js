import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import webPartCreator from "../Changer/Web_Part_Creator.js";
import { config } from "dotenv";
config({ path: "../.env" });
import chalk from "chalk";
import http from "http";
import WebSocket from "ws";

const configuration = new Configuration({
  organization: process.env.ORGANIZATION, //get ID form OpenAI
  apiKey: process.env.API_KEY, //get the key form OpenAI
});

const openai = new OpenAIApi(configuration);

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

//Getting data from Form (User_Interface.html) after submission and processing to create every part of the website
app.post("/submit-form", async (formData, res) => {
  formData = formData.body;
  if (formData.ReStatus == "Generate Again") {
    var webParts = [formData.section];
    formData.formData.ReStatus = formData.ReStatus;
    formData = formData.formData;
  } else if (formData.ReStatus == "Fix the code") {
    var webParts = [formData.section];
    formData.formData.ReStatus = formData.ReStatus;
    formData.formData.code = formData.code;
    formData.formData.instructions = formData.instructions;
    formData = formData.formData;
  } else if (formData.ReStatus == "User preferences") {
    var webParts = [formData.section];
    formData.formData.ReStatus = formData.ReStatus;
    formData.formData.instructions = formData.instructions;
    formData = formData.formData;
  } else {
    // Saving form data to database
    formData.id = 1;
    await fetch(`http://localhost:8000/FormData/${formData.id}`).then(
      async (res) => {
        if (res.ok) {
          await fetch(`http://localhost:8000/FormData/${formData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }).then(() => {
            console.log(
              chalk.hex(`#137952`)(
                "Success, Submitted Form Data Updated to Database"
              )
            );
          });
        } else {
          await fetch(`http://localhost:8000/FormData`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }).then(() => {
            console.log(
              chalk.hex(`#29D479`)("Success, Form Data Added to Database")
            );
          });
        }
      }
    );
    formData.ReStatus = "Img";
    var webParts = [
      "Title",
      "Header",
      "Section1",
      "Section2",
      "Section3",
      // "Section4",
      "Section5",
      "Footer",
    ];
  }
  for (let webPart of webParts) {
    try {
      formData.reTry = 0;
      const statusPart = await webPartCreator(formData, webPart);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send("reload");
        }
      });
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
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("reload");
    }
  });
  console.log(chalk.hex("#932CAA").bold("Process Done"));
  res.status(200).json("OK");
});

// Calling API of AI(ChatGPT)
let requestQueue = [];
let lastRequestTime = 0;
app.post("/Call_Chat-GPT", async (req, res) => {
  try {
    const currentTime = Date.now();
    const elapsedSinceLastRequest = currentTime - lastRequestTime;
    if (elapsedSinceLastRequest < 10000 && requestQueue.length >= 3) {
      throw new Error(
        `Rate limit exceeded. Please wait before making another request.`
      );
    }
    requestQueue.push(currentTime);
    requestQueue = requestQueue.filter(
      (timestamp) => currentTime - timestamp <= 10000
    );
    lastRequestTime = currentTime;

    const data = req.body;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate code for websites, put the code in this format: $HTML {code} !HTML , $CSS {code}[never include <style> tag here] !CSS , $JavaScript {code} !JavaScript, like they are on separate files and Use only English",
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calling API of AI(Dall-E)
app.post("/Call_Dall-E", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
