import getGoogleTranslateHTML from "./googleTranslateHTML.js";
export default getGoogleTranslateHTML(async function translate(str) {
  return (
    await (
      await fetch(
        "https://farside.link/simplytranslate/api/translate?" +
          new URLSearchParams({
            engine: "google",
            from: "auto",
            to: "en",
            text: str,
          })
      )
    ).json()
  )["translated-text"];
});
