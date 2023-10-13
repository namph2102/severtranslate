import Until from "../api/utils";
import axios from "axios";
const cheerio = require("cheerio");
export default class Cambridge {
  static siteurl = "https://dictionary.cambridge.org";
  static async dictionary(html) {
    const $ = cheerio.load(html);

    // basic
    const word = $(".hw.dhw").first().text();
    const pos = $(".pos.dpos") // part of speech
      .map((index, element) => {
        return $(element).text();
      })
      .get();

    // pronunciation

    const usaudio =
      this.siteurl + $(".us.dpron-i audio source").first().attr("src");
    const uspron = $(".us.dpron-i .pron.dpron").first().text();
    const ukaudio =
      this.siteurl + $(".uk.dpron-i audio source").first().attr("src");
    const ukpron = $(".uk.dpron-i .pron.dpron").first().text();

    // definition & example

    const exampleCount = $(".def-body.ddef_b")
      .map((index, element) => {
        const exampleElements = $(element).find(".examp.dexamp");
        return exampleElements.length;
      })
      .get();
    for (let i = 0; i < exampleCount.length; i++) {
      if (i == 0) {
        exampleCount[i] = exampleCount[i];
      } else {
        exampleCount[i] = exampleCount[i] + exampleCount[i - 1];
      }
    }

    const exampletrans = $(
      ".examp.dexamp > .trans.dtrans.dtrans-se.hdb.break-cj"
    ); // translation of the example
    const example = $(".examp.dexamp > .eg.deg")
      .map((index, element) => {
        return {
          id: index,
          text: $(element).text(),
          translation: exampletrans.eq(index).text(),
        };
      })
      .get();

    const definitiontrans = $(
      ".def-body.ddef_b > .trans.dtrans.dtrans-se.break-cj"
    ); // translation of the definition
    const definition = $(".def.ddef_d.db")
      .map((index, element) => {
        return {
          id: index,
          text: $(element).text(),
          translation: definitiontrans.eq(index).text(),
          example: example.slice(exampleCount[index - 1], exampleCount[index]),
        };
      })
      .get();

    return {
      word: word,
      pos: pos,

      pronunciation: [
        {
          lang: "us",
          url: usaudio,
          pron: uspron,
        },
        {
          lang: "uk",
          url: ukaudio,
          pron: ukpron,
        },
      ],
      definition: definition,
    };
  }
  static async Translator() {
    // dịch từ bất kỳ nước gì sang tiếng anh
  }
  static async FindImage(html) {
    const $ = cheerio.load(html);
    const data = [];
    $("img").each((index, element) => {
      const src = $(element).attr("src");

      if (Until.checkUrl(src)) {
        data.push(src);
      }
    });
    return data;
  }
  static renderImageFromWord(work = "") {
    let url = `https://www.google.com/search?q=${work}+not+background&tbm=isch&ved=2ahUKEwjD7ayztumBAxVZcfUHHbCHDyEQ2-cCegQIABAA`;
    return axios.get(url).then(async (response) => {
      if (response.status === 200) {
        const html = response.data;
        return await Cambridge.FindImage(html);
      } else {
        console.error("Failed to fetch the website.");
      }
    });
  }
}
