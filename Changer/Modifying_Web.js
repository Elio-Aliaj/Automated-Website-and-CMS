import cheerio from "cheerio";
import { readFileSync, writeFileSync } from "fs";
import sass from "node-sass";
import chalk from "chalk";
import webPartCreator from "./Web_Part_Creator.js";

export default async function modifyFile(
  aiResponse,
  webPart,
  extractHtmlCss,
  formData
) {
  //Changing CSS file with extracted code to the class with the name based on the web part

  //1# Emptying the SCSS file so new data can be inserted into it
  extractHtmlCss.stats = "NOT OK";
  const scssFile = "../Gen_Website/Gen_Web.scss";
  let cssString = readFileSync(scssFile, "utf8");
  let startDelimiter = "//$" + webPart + "***";
  let endDelimiter = "//!" + webPart + "***";
  let replacement = "\n." + webPart + "_AXZCAASD{\n}\n";
  //Find limits
  let startIndex = cssString.indexOf(startDelimiter) + startDelimiter.length;
  let endIndex = cssString.indexOf(endDelimiter);
  //Replace string
  if (startIndex - startDelimiter.length !== -1 && endIndex !== -1) {
    let textBetweenDelimiters = cssString.substring(startIndex, endIndex);
    let cleanCssString = cssString.replace(textBetweenDelimiters, replacement);

    //2# Replacing the empty part of the SCSS file with the CSS extracted
    let regexPattern = new RegExp(`(\\.${webPart}_AXZCAASD\\s*{)([^}]*)(})`);
    let finalCssString = cleanCssString.replace(
      regexPattern,
      `$1\n  ${extractHtmlCss.css}\n$3`
    );
    writeFileSync("../Gen_Website/Gen_Web.scss", finalCssString);
  } else {
    console.log(chalk.red("Something is wrong with Gen_Web.scss file"));
  }
  //3# Compiling SCSS to CSS
  function renderSaa() {
    return new Promise((resolve, reject) => {
      sass.render(
        {
          file: "../Gen_Website/Gen_Web.scss",
          outFile: "../Gen_Website/Gen_Web.css",
        },
        async function (error, result) {
          if (!error) {
            writeFileSync("../Gen_Website/Gen_Web.css", result.css);
            resolve("Successful");
          } else {
            console.error(chalk.red(error), chalk.yellow(" Trying again..."));
            if (formData.reTry < 4) {
              formData.reTry++;
              resolve(await webPartCreator(formData, webPart));
            } else if (formData.reTry == 4) {
              console.log(chalk.red("Rendering code fail!"));
              reject("Failed");
            }
          }
        }
      );
    });
  }
  return renderSaa()
    .then(async (status) => {
      if (status == "Successful") {
        //Changing HTML file with extracted code to the class with the name based on the web part
        const html = readFileSync("../Gen_Website/Gen_Web.html", "utf8");
        let $ = cheerio.load(html);
        $("." + webPart + "_AXZCAASD").html(extractHtmlCss.html);
        writeFileSync("../Gen_Website/Gen_Web.html", $.html());

        await saveData(status, aiResponse, webPart);
      }
      return status;
    })
    .catch((error) => {
      return error;
    });
}

async function saveData(status, aiResponse, webPart) {
  if (status == "Successful") {
    var dataSave = { response: aiResponse.completion.content, id: webPart };
    await fetch(`http://localhost:8000/response/${webPart}`).then(
      async (res) => {
        if (res.ok) {
          await fetch(`http://localhost:8000/response/${webPart}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataSave),
          }).then(() => {
            console.log(
              chalk.hex(`#29D479`)(
                `Success, ${webPart} responds updated to Database`
              )
            );
          });
        } else {
          await fetch(`http://localhost:8000/response`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataSave),
          }).then(() => {
            console.log(
              chalk.hex(`#29D479`)(
                `Success, ${webPart} responds added to Database`
              )
            );
          });
        }
      }
    );
  }
}
