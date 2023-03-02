const axios = require("axios");
const { JSDOM } = require("jsdom");

const url = "https://komiku.id/ch/boruto-chapter-78/";

const fetchPages = async (urlPages = url) => {
  try {
    const { data } = await axios.get(urlPages);
    return data;
  } catch (e) {
    return `error in catch : ${e}`;
  }
};

const fetchKomikDatas = async () => {
  const response = [];
  const result = {
    comicPages: [],
  };
  const res = await fetchPages();
  const document = new JSDOM(res)?.window?.document;
  document.querySelectorAll(selector).forEach((item) => {
    result.comicPages.push(item.getAttribute("src"));
  });
  response.push(result);
  return response;
};

module.exports = { fetchPages, fetchKomikDatas };
