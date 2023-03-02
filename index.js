const express = require("express");
const axios = require("axios");
const { fetchPages } = require("./helpers");
const app = express();
const { JSDOM } = require("jsdom");

// Trending
const baseUrl = "https://komiku.id/";

app.get("/", async (req, res) => {
  const fethcTrendingDatas = async () => {
    const responsePages = await fetchPages(baseUrl);

    const dom = new JSDOM(responsePages).window.document;
    const results = [];
    // getting image
    dom.querySelectorAll("#Trending .ls23").forEach((item) => {
      results?.push({
        comicThumbnail: item?.querySelector("img").getAttribute("src"),
        comicName: item?.querySelector("h4").textContent,
        url: item?.querySelector("a").getAttribute("href"),
      });
    });
    return results;
  };
  fethcTrendingDatas().then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

// Detail Comic

app.get("/manga/:comic_name", async (req, res) => {
  const url = `${baseUrl}manga/${req?.params?.comic_name}`;

  const fetchKomikDatas = async () => {
    const responsePages = await fetchPages(url);

    const dom = new JSDOM(responsePages).window.document;
    const results = {};
    const genres = [];
    const chapters = [];

    results["comicTitle"] = {
      englishTitle: dom.querySelector("#Judul h1").textContent.trim(),
      indonesiaTitle: dom.querySelector("p").textContent.trim(),
    };
    results["synopsis"] = dom
      .querySelector(".desc")
      .textContent.trim()
      .replaceAll("\n", "");
    results["comicType"] = dom.querySelector(
      "table tbody tr:nth-child(2) td:nth-child(2)"
    ).textContent;
    results["author"] = dom.querySelector(
      "#Informasi > table > tbody > tr:nth-child(4) > td:nth-child(2)"
    ).textContent;
    results["ageMinimum"] = dom.querySelector(
      "#Informasi > table > tbody > tr:nth-child(6) > td:nth-child(2)"
    ).textContent;

    dom.querySelectorAll(".genre li").forEach((item) => {
      genres.push(item?.querySelector("a").textContent);
    });

    const arrDaftarChapterDOM = dom.querySelectorAll("#Daftar_Chapter tr");
    for (let i = 1; i < arrDaftarChapterDOM?.length; i++) {
      chapters?.push({
        chapterNum: arrDaftarChapterDOM?.[i]
          ?.querySelector(".judulseries")
          .textContent.trim(),
        chapterDate: arrDaftarChapterDOM?.[i]
          ?.querySelector(".tanggalseries")
          .textContent.trim(),
        chapterLink: arrDaftarChapterDOM?.[i]
          ?.querySelector("a")
          .getAttribute("href"),
      });
    }

    results["genres"] = genres;

    results["chapters"] = chapters;

    return results;
  };

  fetchKomikDatas().then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

app.get("/ch/:chapters", (req, res) => {
  const url = `${baseUrl}${req?.params?.chapters}`;
  const fetchChapters = async () => {
    const responsePages = await fetchPages(url);

    const dom = new JSDOM(responsePages).window.document;
    const results = {};
    const images = [];
    const terbaru = [];

    // getting title
    results["titleComic"] = dom.querySelector("#Judul h1").textContent.trim();

    // getting image
    dom.querySelectorAll("#Baca_Komik img").forEach((item) => {
      images?.push({
        imagesSrc: item?.getAttribute("src"),
        imagesAlt: item?.getAttribute("alt"),
      });
    });

    results["images"] = images;

    // getting terbaru
    dom.querySelectorAll("#Terbaru .ls8").forEach((item) => {
      terbaru.push({
        terbaruImage: item?.querySelector("img").getAttribute("src"),
        terbaruName: item?.querySelector("h4").textContent.trim(),
        terbaruLink: item?.querySelector("a").getAttribute("href"),
      });
    });

    results["terbaru"] = terbaru;

    return results;
  };

  fetchChapters().then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

app.listen(8000);
