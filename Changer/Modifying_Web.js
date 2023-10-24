import cheerio from "cheerio";
import { readFileSync, writeFileSync } from "fs";
import sass from "node-sass";
import chalk from "chalk";

export default function modifyFile(webPart, extractHtmlCss) {
  //Changing HTML file with extracted code to the class with the name based on the web part

  const html = readFileSync("../Gen_Website/Gen_Web.html", "utf8");
  let $ = cheerio.load(html);
  $("." + webPart + "_AXZCAASD").html(extractHtmlCss.html);
  writeFileSync("../Gen_Website/Gen_Web.html", $.html());

  //Changing CSS file with extracted code to the class with the name based on the web part

  //1# Emptying the SCSS file so new data can be inserted into it
  const scssFile = "../Gen_Website/Gen_Web.scss";
  let updatedData = "";
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
  sass.render(
    {
      file: "../Gen_Website/Gen_Web.scss",
      outFile: "../Gen_Website/Gen_Web.css",
    },
    function (error, result) {
      if (error) {
        console.error(chalk.red(error));
      } else {
        writeFileSync("../Gen_Website/Gen_Web.css", result.css);
      }
    }
  );
}
