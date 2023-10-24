import cheerio from "cheerio";
import fs from "fs";
import chalk from "chalk";
import extractCode from "./Extract_Code_Respond.js";
import modifyFile from "./Modifying_Web.js";

//Calling AI_Caller.js's API to get a response from Chat-GPT
async function AI_Caller(instructions) {
  try {
    var response = await fetch("http://localhost:3000/Call_Chat-GPT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(instructions),
    });
    return (response = await response.json());
  } catch (error) {
    console.log(chalk.red("Fetch error: ") + error);
  }
}

//Calling AI_Caller.js's API to get a response from Dall-E
async function DallE_Caller(instructions, webPart) {
  let image = await fetch("http://localhost:3000/Call_Dall-E", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(instructions),
  });
  image = await image.json();
  const b64 = image.response.data[0]["b64_json"];
  const buffer = Buffer.from(b64, "base64");
  fs.writeFileSync(
    `../Gen_Website/img_${webPart}_${instructions.index}.png`,
    buffer
  );
}

//This function will create web parts
export default async function webPartCreator(formData, webPart) {
  let statusPart = "none";
  var partCreator = {
    Title: function (formData) {
      // Load the HTML file
      const html = fs.readFileSync("../Gen_Website/Gen_Web.html", "utf8");

      // Load the HTML into Cheerio
      const $ = cheerio.load(html);

      // Modify the HTML using Cheerio
      $("title").text(formData["web_name"]);

      // Save the modified HTML back to disk
      fs.writeFileSync("../Gen_Website/Gen_Web.html", $.html());

      return (statusPart = "Successful");
    },
    Header: async function (formData, webPart) {
      /* TODO:Calling Dall-E API for Logo (Not Done)
      await fetchAsync();
      async function fetchAsync() {
        let response = await fetch("http://localhost:3000/Call_Dall-E", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(img_req),
        });
          let data = await response.json();
          const b64 = data.response.data[0]["b64_json"];
          const buffer = Buffer.from(b64, "base64");
          index++;
          fs.writeFileSync(`../Gen_Website/Cart_Img${index}.png`, buffer);
          console.log("Done Image");
      }*/

      //Making instructions for the AI to make the code base on it
      var instructions = {};
      instructions.string =
        "Make a navigation bar within <header> with this info (do not include <header> tag): color_1: " +
        JSON.stringify(formData.web_color1) +
        ", color_2: " +
        JSON.stringify(formData.web_color2) +
        ", color_3: " +
        JSON.stringify(formData.web_color3) +
        "link this buttons with #link2 for About, #link3 for Services, and #link5 for Contact and #linkF for Footer";

      //Getting response from the instructions given
      var responseHeader = await AI_Caller(instructions, webPart);

      //Invoking extractCode function to extract the code that is needed from the AI's response
      var extractHtmlCss = await extractCode(responseHeader, formData, webPart);
      //Invoking modifyFile function to modify the website code by adding the extract code
      if (extractHtmlCss.stats == "OK") {
        modifyFile(webPart, extractHtmlCss);
        return (statusPart = "Successful");
      }
    },
    Section1: async function (formData, webPart) {
      // Calling for an Image to the Dall-E API
      var instructions = {};
      instructions.string =
        "Background image for website type: " +
        formData.web_type.toString() +
        ", with theme colors: " +
        formData.web_color1.toString() +
        " ," +
        formData.web_color2.toString() +
        " ," +
        formData.web_color3.toString();
      instructions.size = "1024x1024";
      instructions.index = 1;

      await DallE_Caller(instructions, webPart);

      // Making the instructions ready to be sent
      instructions = {};
      instructions.string =
        "Make the first section of the website within <section> with this info (do not include <section> tag and keep html and css separated): Website type: " +
        formData.web_type.toString() +
        ", with theme colors: " +
        formData.web_color1.toString() +
        " ," +
        formData.web_color2.toString() +
        " ," +
        formData.web_color3.toString() +
        " , the first section should include a big text with 2 to 3 words and a small paragraph with what is good about the company, give no background-color because it would be an image with similar color as the text, make text to be readable by change colors a bit if is needed or adding shadows";

      //Getting response from the instructions given
      var responseSection1 = await AI_Caller(instructions, webPart);

      //Invoking extractCode function to extract the code that is needed from the AI's response
      var extractHtmlCss = await extractCode(
        responseSection1,
        formData,
        webPart
      );
      //Invoking modifyFile function to modify the website code by adding the extract code
      if (extractHtmlCss.stats == "OK") {
        modifyFile(webPart, extractHtmlCss);
        return (statusPart = "Successful");
      }
    },
    Section2: async function (formData, webPart) {
      //Calling for The ChatGPT API to make the About section
      var instructions = {};
      instructions.string =
        "Make About Us section of the website within <section> with this info (do not include <section> tag and keep html and css separated): Website name: " +
        formData.web_name.toString() +
        " ,Website type: " +
        formData.web_type.toString() +
        ", with theme colors: " +
        formData.web_color1.toString() +
        " ," +
        formData.web_color2.toString() +
        " ," +
        formData.web_color3.toString() +
        ", make text to be readable by change colors a bit if is needed or by adding text shadows and in it make a paragraph that gives an introduction to this website and the our dedication, minimum 2 paragraphs";

      //Getting response from the instructions given
      var responseSection2 = await AI_Caller(instructions, webPart);

      //Invoking extractCode function to extract the code that is needed from the AI's response
      var extractHtmlCss = await extractCode(
        responseSection2,
        formData,
        webPart
      );

      //Invoking modifyFile function to modify the website code by adding the extract code
      if (extractHtmlCss.stats == "OK") {
        modifyFile(webPart, extractHtmlCss);
        return (statusPart = "Successful");
      }
    },
    Section3: async function (formData, webPart) {
      //Making instructions ready to for 3 different images base on the offers on the website
      let images = [
        formData.web_offer1,
        formData.web_offer2,
        formData.web_offer3,
      ];
      let img_index = 1;
      for await (const service of images) {
        var instructions = {};
        instructions.string =
          "Image for the service card, website type: " +
          formData.web_type.toString() +
          ", with theme colors: " +
          formData.web_color1.toString() +
          " ," +
          formData.web_color2.toString() +
          " ," +
          formData.web_color3.toString() +
          " , website service: " +
          service;
        instructions.size = "256x256";
        instructions.index = img_index++;
        // Calling for an Image to the Dall-E API
        await DallE_Caller(instructions, webPart);
      }

      // Making instructions to make a section with 3 cards with image and services offered
      var instructions = {};
      instructions.string =
        "Make 'Services' section of the website within <section> with this info (do not include <section> tag and keep html and css separated): Website name: " +
        formData.web_name.toString() +
        " ,Website type: " +
        formData.web_type.toString() +
        ", with theme colors: " +
        formData.web_color1.toString() +
        " ," +
        formData.web_color2.toString() +
        " ," +
        formData.web_color3.toString() +
        " , services that the company offers: " +
        formData.web_offer1.toString() +
        " ," +
        formData.web_offer2.toString() +
        " ," +
        formData.web_offer3.toString() +
        " , put each service in a card and make text readable by change colors a bit or by adding text shadows with blur, add on every card an img tag with 'id = img_card1' where the number changes 1 to 3, keep the image in the center of the card and do not include src and alt in, and make it possible to have this card responsive to changes of screen size and in center";

      //Getting response from the instructions given
      var responseSection3 = await AI_Caller(instructions, webPart);

      //Invoking extractCode function to extract the code that is needed from the AI's response
      var extractHtmlCss = await extractCode(
        responseSection3,
        formData,
        webPart
      );
      //Invoking modifyFile function to modify the website code by adding the extract code
      if (extractHtmlCss.stats == "OK") {
        modifyFile(webPart, extractHtmlCss);
        return (statusPart = "Successful");
      }
    },
    // section4: function (data) {
    //   console.log("section4");
    // },
    Section5: async function (formData, webPart) {
      //Making instructions ready for a section with 2 sides for contacts
      var instructions = {};
      instructions.string =
        "Make a section (do not include <section> tag and keep html and css split): where it is split in two, on the left is a Welcoming to contact and an paragraph to why us and how to contact with the email:" +
        formData.contact_email.toString() +
        " and the phone number:" +
        formData.tel_contact.toString() +
        " and on the right is a from with asks for name , email and the message and are submitted to this email:" +
        formData.contact_email.toString() +
        " and to style this form use this colors theme: color_1: " +
        formData.web_color1.toString() +
        " color_2:" +
        formData.web_color2.toString() +
        " color_3:" +
        formData.web_color3.toString();

      //Getting response from the instructions given
      var responseSection5 = await AI_Caller(instructions, webPart);

      //Invoking extractCode function to extract the code that is needed from the AI's response
      var extractHtmlCss = await extractCode(
        responseSection5,
        formData,
        webPart
      );
      //Invoking modifyFile function to modify the website code by adding the extract code
      if (extractHtmlCss.stats == "OK") {
        modifyFile(webPart, extractHtmlCss);
        return (statusPart = "Successful");
      }
    },
    Footer: async function (formData, webPart) {
      //Making the footer of the website
      let instructions = {};
      instructions.string =
        "Make a footer section (do not include <footer> tag) with the name of the website: " +
        formData.web_name.toString() +
        "and the copy right signature and add 'Website made with GeneRaitionis' and add a button in the right with some of the colors: " +
        formData.web_color1.toString() +
        " color_2:" +
        formData.web_color2.toString() +
        " color_3:" +
        formData.web_color3.toString() +
        " that is linked to #linkH that goes to the top of the page";

      //Getting response from the instructions given
      var responseSection3 = await AI_Caller(instructions, webPart);

      //Invoking extractCode function to extract the code that is needed from the AI's response
      var extractHtmlCss = await extractCode(
        responseSection3,
        formData,
        webPart
      );
      //Invoking modifyFile function to modify the website code by adding the extract code
      if (extractHtmlCss.stats == "OK") {
        modifyFile(webPart, extractHtmlCss);
        return (statusPart = "Successful");
      }
    },
  };
  if (partCreator[webPart]) {
    await partCreator[webPart](formData, webPart);
  } else {
    console.log("Invalid Web Part");
  }
  return statusPart;
}
