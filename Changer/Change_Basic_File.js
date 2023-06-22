import express, { response } from "express";
import bodyParser from "body-parser";
import cheerio from "cheerio";
import fs from "fs";
import { readFileSync, writeFileSync } from "fs";
import sass from "node-sass";

// import Call from "../AI Caller/AI_Caller.js"

export default function changer(data, tag) {
  var tagsObject = {
    title: function (data, tag) {
      // Load the HTML file
      const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");

      // Load the HTML into Cheerio
      const $ = cheerio.load(html);

      // Modify the HTML using Cheerio
      $("title").text(data["web_name"]);

      // Save the modified HTML back to disk
      fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());
      console.log("Title Changed");
    },
    header: async function (data) {
      //Calling Dall-e API for Logo
          // await fetchAsync();
          // async function fetchAsync() {
          //   let response = await fetch("http://localhost:3000/Call_Dall-E", {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify(img_req),
          //   });
          //     let data = await response.json();
          //     const b64 = data.response.data[0]["b64_json"];
          //     const buffer = Buffer.from(b64, "base64");
          //     index++;
          //     fs.writeFileSync(`../Gen_Websit/Cart_Img${index}.png`, buffer);
          //     console.log("Done Image");
          // }
            
      let msg = {};
      msg.string =
        "Make a navigation bar within <header> with this info (do not include <header> tag): color_1:" +
        data.web_color1.toString() +
        " color_2:" +
        data.web_color2.toString() +
        " color_3:" +
        data.web_color3.toString();
      fetch("http://localhost:3000/Call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("respond back data: ", data);
          // Changing files*************************
          //Extract HTML Code from String****************
          const string = data.completion.content;

          const startTag = "$HTML";
          const endTag = "!HTML";
          let extractedHTML = "";

          const startIndex = string.indexOf(startTag);
          if (startIndex !== -1) {
            const endIndex = string.indexOf(
              endTag,
              startIndex + startTag.length
            );
            if (endIndex !== -1) {
              extractedHTML = string.substring(
                startIndex + startTag.length,
                endIndex
              );
            } else {
              console.log("End tag not found.");
            }
          } else {
            console.log("Start tag not found.");
          }
          //Changing HTML*********************************
          const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");
          // Load the HTML into Cheerio
          let $ = cheerio.load(html);
          // Modify the HTML using Cheerio
          $(".header_AXZCAASD").html(extractedHTML);
          // Save the modified HTML back to disk
          fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());

          //Extract CSS Code from String********************************
          const startTag2 = "$CSS";
          const endTag2 = "!CSS";
          let extractedCSS = "";

          const startIndex2 = string.indexOf(startTag2);
          if (startIndex2 !== -1) {
            const endIndex = string.indexOf(
              endTag2,
              startIndex2 + startTag2.length
            );
            if (endIndex !== -1) {
              extractedCSS = string.substring(
                startIndex2 + startTag2.length,
                endIndex
              );
            } else {
              console.log("End tag not found.");
            }
          } else {
            console.log("Start tag not found.");
          }
          // Changing the CSS file*****************
          const scssFile = "../Gen_Websit/Gen_Web.scss";
          let updatedData = "";
          // Restart Header Section**************
          let cssString = readFileSync("../Gen_Websit/Gen_Web.scss", "utf8");
          let str = cssString;
          let startDelimiter = "//$Header***";
          let endDelimiter = "//!Header***";
          let replacement = "\n.header_AXZCAASD{\n}\n";
          //Find limits
          let startIndex3 = str.indexOf(startDelimiter) + startDelimiter.length;
          let endIndex = str.indexOf(endDelimiter);
          //Replace string
          if (startIndex3 !== -1 && endIndex !== -1) {
            let textBetweenDelimiters = str.substring(startIndex3, endIndex);
            let newText = str.replace(textBetweenDelimiters, replacement);
            // Write the modified CSS string back to the file
            writeFileSync("../Gen_Websit/Gen_Web.scss", newText);
          }

          fs.readFile(scssFile, "utf8", (err, data) => {
            if (err) throw err;
            // code to execute after 5 second
            updatedData = data.replace(
              /(\.header_AXZCAASD\s*{)([^}]*)(})/,
              `$1\n  ${extractedCSS}\n$3`
            );
            fs.writeFile(scssFile, updatedData, "utf8", (err) => {
              if (err) throw err;
            });
          });
          //Compailing SCSS to CSS*******************
          setTimeout(function () {
            sass.render(
              {
                file: "../Gen_Websit/Gen_Web.scss",
                outFile: "../Gen_Websit/Gen_Web.css",
              },
              function (error, result) {
                if (error) {
                  console.error(error);
                } else {
                  fs.writeFile(
                    "../Gen_Websit/Gen_Web.css",
                    result.css,
                    function (err) {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              }
            );
          }, 5000);
        })
        .catch((error) => console.error(error));
    },
    section1: async function (data) {
      console.log(data);
      // Calling for an Image to the Dall-E API***************************************************************************************************************************************************************************
      let img_req = {};
      img_req.msg =
        "Background image for website type: " +
        data.web_type.toString() +
        ", with theme colors: " +
        data.web_color1.toString() +
        " ," +
        data.web_color2.toString() +
        " ," +
        data.web_color3.toString();
      img_req.size = ("1024x1024");
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
        fs.writeFileSync(`../Gen_Websit/Section1_BG.png`, buffer);
        console.log("Done Image");
      }

      //Calling for The ChatGPT API to make the first section***************************************************************************************************************************************************************************
      let msg = {};
      msg.string =
        "Make the first section of the website within <section> with this info (do not include <section> tag and keep html and css separated): Website type: " +
        data.web_type.toString() +
        ", with theme colors: " +
        data.web_color1.toString() +
        " ," +
        data.web_color2.toString() +
        " ," +
        data.web_color3.toString() +
        " , the first section should include a big text with 2 to 3 words and a small paragraph with what is good about the company, give no background-color because it would be an image with similar color as the text, make text to be readable by change colors a bit if is needed or adding shadows";
      console.log("request:" + msg.string);
      fetch("http://localhost:3000/Call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("respond back data: ", data);
          // Changing files*************************
          //Extract HTML Code from String****************
          const string = data.completion.content;

          const startTag = "$HTML";
          const endTag = "!HTML";
          let extractedHTML = "";

          const startIndex = string.indexOf(startTag);
          if (startIndex !== -1) {
            const endIndex = string.indexOf(
              endTag,
              startIndex + startTag.length
            );
            if (endIndex !== -1) {
              extractedHTML = string.substring(
                startIndex + startTag.length,
                endIndex
              );
            } else {
              console.log("End HTML tag not found.");
            }
          } else {
            console.log("Start HTML tag not found.");
          }
          //Changing HTML*********************************
          const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");
          // Load the HTML into Cheerio
          let $ = cheerio.load(html);
          // Modify the HTML using Cheerio
          $("#section1").html(extractedHTML);
          // Save the modified HTML back to disk
          fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());

          //Extract CSS Code from String********************************
          const startTag2 = "$CSS";
          const endTag2 = "!CSS";
          let extractedCSS = "";

          const startIndex2 = string.indexOf(startTag2);
          if (startIndex2 !== -1) {
            const endIndex = string.indexOf(
              endTag2,
              startIndex2 + startTag2.length
            );
            if (endIndex !== -1) {
              extractedCSS = string.substring(
                startIndex2 + startTag2.length,
                endIndex
              );
            } else {
              console.log("End CSS tag not found .");
            }
          } else {
            console.log("Start CSS tag not found.");
          }
          // Changing the CSS file*****************
          const scssFile = "../Gen_Websit/Gen_Web.scss";
          let updatedData = "";
          // Restart Section1**************************
          let cssString = readFileSync("../Gen_Websit/Gen_Web.scss", "utf8");
          let str = cssString;
          let startDelimiter = "//$Section1***";
          let endDelimiter = "//!Section1***";
          let replacement = "\n#section1{\n}\n";
          //Find limits
          let startIndex3 = str.indexOf(startDelimiter) + startDelimiter.length;
          let endIndex = str.indexOf(endDelimiter);
          //Replace string
          if (startIndex3 !== -1 && endIndex !== -1) {
            let textBetweenDelimiters = str.substring(startIndex3, endIndex);
            let newText = str.replace(textBetweenDelimiters, replacement);
            // Write the modified CSS string back to the file
            writeFileSync("../Gen_Websit/Gen_Web.scss", newText);
          }

          fs.readFile(scssFile, "utf8", (err, data) => {
            if (err) throw err;
            updatedData = data.replace(
              /(\#section1\s*{)([^}]*)(})/,
              `$1\n  ${extractedCSS}\n$3`
            );
            fs.writeFile(scssFile, updatedData, "utf8", (err) => {
              if (err) throw err;
            });
          });
          //Compailing SCSS to CSS*******************
          setTimeout(function () {
            sass.render(
              {
                file: "../Gen_Websit/Gen_Web.scss",
                outFile: "../Gen_Websit/Gen_Web.css",
              },
              function (error, result) {
                if (error) {
                  console.error(error);
                } else {
                  fs.writeFile(
                    "../Gen_Websit/Gen_Web.css",
                    result.css,
                    function (err) {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              }
            );
          }, 5000);
          console.log("Done!");
        })
        .catch((error) => console.error(error));
    },
    section2: function (data) {
      //Calling for The ChatGPT API to make the About section***************************************************************************************************************************************************************************
      let msg = {};
      msg.string =
        "Make About Us section of the website within <section> with this info (do not include <section> tag and keep html and css separated): Website name: " +
        data.web_name.toString() +
        " ,Website type: " +
        data.web_type.toString() +
        ", with theme colors: " +
        data.web_color1.toString() +
        " ," +
        data.web_color2.toString() +
        " ," +
        data.web_color3.toString() +
        ", make text to be readable by change colors a bit if is needed or by adding text shadows";
      console.log("request:" + msg.string);
      fetch("http://localhost:3000/Call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("respond back data: ", data);
          // Changing files*************************
          //Extract HTML Code from String****************
          const string = data.completion.content;

          const startTag = "$HTML";
          const endTag = "!HTML";
          let extractedHTML = "";

          const startIndex = string.indexOf(startTag);
          if (startIndex !== -1) {
            const endIndex = string.indexOf(
              endTag,
              startIndex + startTag.length
            );
            if (endIndex !== -1) {
              extractedHTML = string.substring(
                startIndex + startTag.length,
                endIndex
              );
            } else {
              console.log("End HTML tag not found.");
            }
          } else {
            console.log("Start HTML tag not found.");
          }
          //Changing HTML*********************************
          const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");
          // Load the HTML into Cheerio
          let $ = cheerio.load(html);
          // Modify the HTML using Cheerio
          $("#section2").html(extractedHTML);
          // Save the modified HTML back to disk
          fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());

          //Extract CSS Code from String********************************
          const startTag2 = "$CSS";
          const endTag2 = "!CSS";
          let extractedCSS = "";

          const startIndex2 = string.indexOf(startTag2);
          if (startIndex2 !== -1) {
            const endIndex = string.indexOf(
              endTag2,
              startIndex2 + startTag2.length
            );
            if (endIndex !== -1) {
              extractedCSS = string.substring(
                startIndex2 + startTag2.length,
                endIndex
              );
            } else {
              console.log("End CSS tag not found .");
            }
          } else {
            console.log("Start CSS tag not found.");
          }
          // Changing the CSS file*****************
          const scssFile = "../Gen_Websit/Gen_Web.scss";
          let updatedData = "";
          // Restart Section1**************************
          let cssString = readFileSync("../Gen_Websit/Gen_Web.scss", "utf8");
          let str = cssString;
          let startDelimiter = "//$Section2***";
          let endDelimiter = "//!Section2***";
          let replacement = "\n#section2{\n}\n";
          //Find limits
          let startIndex3 = str.indexOf(startDelimiter) + startDelimiter.length;
          let endIndex = str.indexOf(endDelimiter);
          //Replace string
          if (startIndex3 !== -1 && endIndex !== -1) {
            let textBetweenDelimiters = str.substring(startIndex3, endIndex);
            let newText = str.replace(textBetweenDelimiters, replacement);
            // Write the modified CSS string back to the file
            writeFileSync("../Gen_Websit/Gen_Web.scss", newText);
          }

          fs.readFile(scssFile, "utf8", (err, data) => {
            if (err) throw err;
            updatedData = data.replace(
              /(\#section2\s*{)([^}]*)(})/,
              `$1\n  ${extractedCSS}\n$3`
            );
            fs.writeFile(scssFile, updatedData, "utf8", (err) => {
              if (err) throw err;
            });
          });
          //Compailing SCSS to CSS*******************
          setTimeout(function () {
            sass.render(
              {
                file: "../Gen_Websit/Gen_Web.scss",
                outFile: "../Gen_Websit/Gen_Web.css",
              },
              function (error, result) {
                if (error) {
                  console.error(error);
                } else {
                  fs.writeFile(
                    "../Gen_Websit/Gen_Web.css",
                    result.css,
                    function (err) {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              }
            );
          }, 5000);

          console.log("Done!");
        })
        .catch((error) => console.error(error));
    },
    section3: async function (data) {
      //Making data ready to sand with request
      let arr = [data.web_offer1,data.web_offer2,data.web_offer3];
      let index = 0;
        for await (const result of arr){
              let img_req = {};
              img_req.msg =
              "Image for the service card, website type: " +
              data.web_type.toString() +
              ", with theme colors: " +
              data.web_color1.toString() +
              " ," +
              data.web_color2.toString() +
              " ," +
              data.web_color3.toString() +
              " , website service: " +
              result;
              img_req.size = "256x256";
              console.log(img_req.msg);
          // Calling for an Image to the Dall-E API***************************************************************************************************************************************************************************
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
              fs.writeFileSync(`../Gen_Websit/Cart_Img${index}.png`, buffer);
              console.log("Done Image");
          }
        }
      // Calling ChatGPT API to make a section 'Serves offered'
      let msg = {};
      msg.string =
        "Make 'Services' section of the website within <section> with this info (do not include <section> tag and keep html and css separated): Website name: " +
        data.web_name.toString() +
        " ,Website type: " +
        data.web_type.toString() +
        ", with theme colors: " +
        data.web_color1.toString() +
        " ," +
        data.web_color2.toString() +
        " ," +
        data.web_color3.toString() +
        " , services that the company offers: " +
        data.web_offer1.toString() +
        " ," +
        data.web_offer2.toString() +
        " ," +
        data.web_offer3.toString() +
        " , put each service in a card and make text readable by change colors a bit or by adding text shadows with blur, add on every card an img tag with 'id = img_card1' where the number changes 1 to 3, keep the image in the center of the card and do not include src and alt in the";
      fetch("http://localhost:3000/Call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("respond back data: ", data);
          // Changing files*************************
          //Extract HTML Code from String****************
          const string = data.completion.content;

          const startTag = "$HTML";
          const endTag = "!HTML";
          let extractedHTML = "";

          const startIndex = string.indexOf(startTag);
          if (startIndex !== -1) {
            const endIndex = string.indexOf(
              endTag,
              startIndex + startTag.length
            );
            if (endIndex !== -1) {
              extractedHTML = string.substring(
                startIndex + startTag.length,
                endIndex
              );
            } else {
              console.log("End HTML tag not found.");
            }
          } else {
            console.log("Start HTML tag not found.");
          }
          //Changing HTML*********************************
          const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");
          // Load the HTML into Cheerio
          let $ = cheerio.load(html);
          // Modify the HTML using Cheerio
          $("#section3").html(extractedHTML);
          // Save the modified HTML back to disk
          fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());

          //Extract CSS Code from String********************************
          const startTag2 = "$CSS";
          const endTag2 = "!CSS";
          let extractedCSS = "";

          const startIndex2 = string.indexOf(startTag2);
          if (startIndex2 !== -1) {
            const endIndex = string.indexOf(
              endTag2,
              startIndex2 + startTag2.length
            );
            if (endIndex !== -1) {
              extractedCSS = string.substring(
                startIndex2 + startTag2.length,
                endIndex
              );
            } else {
              console.log("End CSS tag not found .");
            }
          } else {
            console.log("Start CSS tag not found.");
          }
          // Changing the CSS file*****************
          const scssFile = "../Gen_Websit/Gen_Web.scss";
          let updatedData = "";
          // Restart Section1**************************
          let cssString = readFileSync("../Gen_Websit/Gen_Web.scss", "utf8");
          let str = cssString;
          let startDelimiter = "//$Section3***";
          let endDelimiter = "//!Section3***";
          let replacement = "\n#section3{\n}\n";
          //Find limits
          let startIndex3 = str.indexOf(startDelimiter) + startDelimiter.length;
          let endIndex = str.indexOf(endDelimiter);
          //Replace string
          if (startIndex3 !== -1 && endIndex !== -1) {
            let textBetweenDelimiters = str.substring(startIndex3, endIndex);
            let newText = str.replace(textBetweenDelimiters, replacement);
            // Write the modified CSS string back to the file
            writeFileSync("../Gen_Websit/Gen_Web.scss", newText);
          }

          fs.readFile(scssFile, "utf8", (err, data) => {
            if (err) throw err;
            updatedData = data.replace(
              /(\#section3\s*{)([^}]*)(})/,
              `$1\n  ${extractedCSS}\n$3`
            );
            fs.writeFile(scssFile, updatedData, "utf8", (err) => {
              if (err) throw err;
            });
          });
          // Compailing SCSS to CSS*******************
          setTimeout(function () {
            sass.render(
              {
                file: "../Gen_Websit/Gen_Web.scss",
                outFile: "../Gen_Websit/Gen_Web.css",
              },
              function (error, result) {
                if (error) {
                  console.error(error);
                } else {
                  fs.writeFile(
                    "../Gen_Websit/Gen_Web.css",
                    result.css,
                    function (err) {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              }
            );
          }, 5000);

          console.log("Done!");
        })
        .catch((error) => console.error(error));
    },
    // section4: function (data) {
    //   console.log("section4");
    // },
    section5: function (data) {
      let msg = {};
      msg.string =
        "Make a section (do not include <section> tag and keep html and css split): where it is split in two, on the left is a Welcoming to contact and an paragraf to why us and how to contact with the email:" +
        data.contact_email.toString() +
        " and the phone number:" +
        data.tel_contact.toString() +
        " and on the right is a from with asks for name , email and the message and are submited to this emaile:" +
        data.contact_email.toString() + 
        " and to style this form use this colors theme: color_1: " +
        data.web_color1.toString() +
        " color_2:" +
        data.web_color2.toString() +
        " color_3:" +
        data.web_color3.toString();
      fetch("http://localhost:3000/Call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("respond back data: ", data);
          // Changing files*************************
          //Extract HTML Code from String****************
          const string = data.completion.content;

          const startTag = "$HTML";
          const endTag = "!HTML";
          let extractedHTML = "";

          const startIndex = string.indexOf(startTag);
          if (startIndex !== -1) {
            const endIndex = string.indexOf(
              endTag,
              startIndex + startTag.length
            );
            if (endIndex !== -1) {
              extractedHTML = string.substring(
                startIndex + startTag.length,
                endIndex
              );
            } else {
              console.log("End tag not found.");
            }
          } else {
            console.log("Start tag not found.");
          }
          //Changing HTML*********************************
          const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");
          // Load the HTML into Cheerio
          let $ = cheerio.load(html);
          // Modify the HTML using Cheerio
          $("#section5").html(extractedHTML);
          // Save the modified HTML back to disk
          fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());

          //Extract CSS Code from String********************************
          const startTag2 = "$CSS";
          const endTag2 = "!CSS";
          let extractedCSS = "";

          const startIndex2 = string.indexOf(startTag2);
          if (startIndex2 !== -1) {
            const endIndex = string.indexOf(
              endTag2,
              startIndex2 + startTag2.length
            );
            if (endIndex !== -1) {
              extractedCSS = string.substring(
                startIndex2 + startTag2.length,
                endIndex
              );
            } else {
              console.log("End tag not found.");
            }
          } else {
            console.log("Start tag not found.");
          }
          // Changing the CSS file*****************
          const scssFile = "../Gen_Websit/Gen_Web.scss";
          let updatedData = "";
          // Restart Header Section**************
          let cssString = readFileSync("../Gen_Websit/Gen_Web.scss", "utf8");
          let str = cssString;
          let startDelimiter = "//$Section5***";
          let endDelimiter = "//!Section5***";
          let replacement = "\n#section5{\n}\n";
          //Find limits
          let startIndex3 = str.indexOf(startDelimiter) + startDelimiter.length;
          let endIndex = str.indexOf(endDelimiter);
          //Replace string
          if (startIndex3 !== -1 && endIndex !== -1) {
            let textBetweenDelimiters = str.substring(startIndex3, endIndex);
            let newText = str.replace(textBetweenDelimiters, replacement);
            // Write the modified CSS string back to the file
            writeFileSync("../Gen_Websit/Gen_Web.scss", newText);
          }

          fs.readFile(scssFile, "utf8", (err, data) => {
            if (err) throw err;
            // code to execute after 5 second
            updatedData = data.replace(
              /(\#section5\s*{)([^}]*)(})/,
              `$1\n  ${extractedCSS}\n$3`
            );
            fs.writeFile(scssFile, updatedData, "utf8", (err) => {
              if (err) throw err;
            });
          });
          //Compailing SCSS to CSS*******************
          setTimeout(function () {
            sass.render(
              {
                file: "../Gen_Websit/Gen_Web.scss",
                outFile: "../Gen_Websit/Gen_Web.css",
              },
              function (error, result) {
                if (error) {
                  console.error(error);
                } else {
                  fs.writeFile(
                    "../Gen_Websit/Gen_Web.css",
                    result.css,
                    function (err) {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              }
            );
          }, 5000);
        })
        .catch((error) => console.error(error));
    },

    footer: function (data) {
      let msg = {};
      msg.string =
        "Make a footer section (do not include <footer> tag) with the name of the websitde: " +
        data.web_name.toString() +
        " and the copy right signiture and add 'Webisite made with GeneRaitionis'";
      fetch("http://localhost:3000/Call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("respond back data: ", data);
          // Changing files*************************
          //Extract HTML Code from String****************
          const string = data.completion.content;

          const startTag = "$HTML";
          const endTag = "!HTML";
          let extractedHTML = "";

          const startIndex = string.indexOf(startTag);
          if (startIndex !== -1) {
            const endIndex = string.indexOf(
              endTag,
              startIndex + startTag.length
            );
            if (endIndex !== -1) {
              extractedHTML = string.substring(
                startIndex + startTag.length,
                endIndex
              );
            } else {
              console.log("End tag not found.");
            }
          } else {
            console.log("Start tag not found.");
          }
          //Changing HTML*********************************
          const html = fs.readFileSync("../Gen_Websit/Gen_Web.html", "utf8");
          // Load the HTML into Cheerio
          let $ = cheerio.load(html);
          // Modify the HTML using Cheerio
          $(".footer_AXZCAASD").html(extractedHTML);
          // Save the modified HTML back to disk
          fs.writeFileSync("../Gen_Websit/Gen_Web.html", $.html());

          //Extract CSS Code from String********************************
          const startTag2 = "$CSS";
          const endTag2 = "!CSS";
          let extractedCSS = "";

          const startIndex2 = string.indexOf(startTag2);
          if (startIndex2 !== -1) {
            const endIndex = string.indexOf(
              endTag2,
              startIndex2 + startTag2.length
            );
            if (endIndex !== -1) {
              extractedCSS = string.substring(
                startIndex2 + startTag2.length,
                endIndex
              );
            } else {
              console.log("End tag not found.");
            }
          } else {
            console.log("Start tag not found.");
          }
          // Changing the CSS file*****************
          const scssFile = "../Gen_Websit/Gen_Web.scss";
          let updatedData = "";
          // Restart Header Section**************
          let cssString = readFileSync("../Gen_Websit/Gen_Web.scss", "utf8");
          let str = cssString;
          let startDelimiter = "//$Footer***";
          let endDelimiter = "//!Footer***";
          let replacement = "\n.footer_AXZCAASD{\n}\n";
          //Find limits
          let startIndex3 = str.indexOf(startDelimiter) + startDelimiter.length;
          let endIndex = str.indexOf(endDelimiter);
          //Replace string
          if (startIndex3 !== -1 && endIndex !== -1) {
            let textBetweenDelimiters = str.substring(startIndex3, endIndex);
            let newText = str.replace(textBetweenDelimiters, replacement);
            // Write the modified CSS string back to the file
            writeFileSync("../Gen_Websit/Gen_Web.scss", newText);
          }

          fs.readFile(scssFile, "utf8", (err, data) => {
            if (err) throw err;
            // code to execute after 5 second
            updatedData = data.replace(
              /(\.footer_AXZCAASD\s*{)([^}]*)(})/,
              `$1\n  ${extractedCSS}\n$3`
            );
            fs.writeFile(scssFile, updatedData, "utf8", (err) => {
              if (err) throw err;
            });
          });
          //Compailing SCSS to CSS*******************
          setTimeout(function () {
            sass.render(
              {
                file: "../Gen_Websit/Gen_Web.scss",
                outFile: "../Gen_Websit/Gen_Web.css",
              },
              function (error, result) {
                if (error) {
                  console.error(error);
                } else {
                  fs.writeFile(
                    "../Gen_Websit/Gen_Web.css",
                    result.css,
                    function (err) {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              }
            );
          }, 5000);
        })
        .catch((error) => console.error(error));

    },
    script: function (data) {
      console.log("script");
    },
  };
  if (tagsObject[tag]) {
    tagsObject[tag](data, tag);
  } else {
    console.log("Invalid tag");
  }
}
