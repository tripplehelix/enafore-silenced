import getGoogleTranslateHTML from "./googleTranslateHTML.js";
export default getGoogleTranslateHTML(async function translate(text, to, from) {
  return (
    await (
      await fetch(
        "https://simplytranslate.org/api/translate?" +
          new URLSearchParams({
            engine: "google",
            from,
            to,
            text
          })
      )
    ).json()
  )["translated-text"];
});
