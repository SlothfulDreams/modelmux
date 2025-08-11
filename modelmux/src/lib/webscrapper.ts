export async function getWebsiteText(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    console.log(doc.body.innerText);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
