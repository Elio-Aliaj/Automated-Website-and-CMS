import chalk from "chalk";
import webPartCreator from "./Web_Part_Creator.js";

export default async function extractCode(aiResponse, formData, webPart) {
  const respondToText = aiResponse.completion.content;

  //Extracting the code from the response putting it in an object and returning this object

  const htmlStartTag = "$HTML";
  const htmlEndTag = "!HTML";
  var extractedHTML = "";
  const cssStartTag = "$CSS";
  const cssEndTag = "!CSS";
  var extractedCSS = "";
  var extractHtmlCss = {};

  const htmlStartIndex = respondToText.indexOf(htmlStartTag);
  const cssStartIndex = respondToText.indexOf(cssStartTag);
  if (htmlStartIndex !== -1 && cssStartIndex !== -1) {
    const htmlEndIndex = respondToText.indexOf(
      htmlEndTag,
      htmlStartIndex + htmlStartTag.length
    );
    const cssEndIndex = respondToText.indexOf(
      cssEndTag,
      cssStartIndex + cssStartTag.length
    );

    if (htmlEndIndex !== -1 && cssEndIndex !== -1) {
      extractedHTML = respondToText.substring(
        htmlStartIndex + htmlStartTag.length,
        htmlEndIndex
      );
      extractedCSS = respondToText.substring(
        cssStartIndex + cssStartTag.length,
        cssEndIndex
      );
      extractHtmlCss.html = extractedHTML;
      extractHtmlCss.css = extractedCSS;
      extractHtmlCss.stats = "OK";
    } else {
      extractHtmlCss.stats = "NOT OK";
    }
  } else {
    extractHtmlCss.stats = "NOT OK";
  }

  //Check up to 3 time if the the tags can be found in not error displayed

  if (extractHtmlCss.stats == "NOT OK" && formData.reTry < 5) {
    console.log(chalk.red("No tag found."), chalk.yellow("Trying again..."));
    formData.reTry++;
    await webPartCreator(formData, webPart);
  } else if (formData.reTry == 5) {
    console.log(chalk.red("Extracting code fail!"));
    extractHtmlCss.stats = "NOT OK";
  }
  return extractHtmlCss;
}
