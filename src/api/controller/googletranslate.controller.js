import axios from "axios";
export default class GoogleTranslateController {
  static translator(req, res) {
    const { work, from = "auto", to = "en" } = req.body;
    if (!work) {
      throw new Error("work is required");
    }
    const url = `https://translate.google.com/?hl=vi&sl=${from}&tl=${to}&text=${work}&op=translate`;
    return axios.get(url).then((response) => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);

        $("a").each((index, element) => {
          const link = $(element).attr("href");
          console.log(link);
        });
      } else {
        console.error("Failed to fetch the website.");
      }
    });
  }
}
