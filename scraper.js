import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.glasistre.hr/sport");
  const newsElements = await page.$$(".news");
  const links = [];

  for (const element of newsElements) {
    const link = await page.evaluate((el) => el.href, element);
    links.push(link);
  }
  console.log(links);
  const news = [];

  for (const link of links) {
    const newBrowser = await puppeteer.launch();
    const newPage = await newBrowser.newPage();
    await newPage.goto(link);
    let content = "";
    const title = await newPage.$eval("h1", (el) => el.innerText);
    content += title + "\n";
    const parentElement = await newPage.$('[name="content"]');
    const paragraphs = await parentElement.$$("p");
    for (const p of paragraphs) {
      let text = await newPage.evaluate((el) => el.innerText, p);
      content += text + "\n";
    }
    console.log(content);
    news.push(content);

    await newBrowser.close();
  }

  console.log(news);
  await browser.close();
})();
