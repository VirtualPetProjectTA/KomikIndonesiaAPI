const express = require("express");
const axios = require("axios");
const { fetchPages } = require("./helpers");
const app = express();
const { JSDOM } = require("jsdom");

// Trending
const baseUrl = "https://komikstation.co";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fetchListComics = async (urlListComics) => {
  const responsePages = await fetchPages(`${baseUrl}${urlListComics}`);

  const dom = new JSDOM(responsePages).window.document;
  const results = [];
  // getting image
  dom.querySelectorAll(".bs").forEach((item) => {
    results?.push({
      comicThumbnail: item?.querySelector("img").getAttribute("src"),
      comicTitle: item?.querySelector(".tt").textContent,
      comicType: item?.querySelector(".type").textContent,
      comicTypeLink: `/comic_type/${item
        ?.querySelector(".type")
        .textContent.toLowerCase()
        .trim()}`,
      comicDetailsLink: item
        ?.querySelector("a")
        .getAttribute("href")
        .replaceAll(baseUrl, ""),
    });
  });
  return results;
};

// fetch list trending pages
app.get("/", async (req, res) => {
  fetchListComics("/manga/?order=update").then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

// fetch list genres pages
app.get("/genres/:genreTypes", async (req, res) => {
  fetchListComics(`/genres/${req?.params.genreTypes}`).then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

// fetch list comic type
app.get("/comic_type/:comic_type", async (req, res) => {
  fetchListComics(`/manga/?type=${req.params.comic_type}`).then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

// Detail Comic

app.get("/manga/:comic_name", async (req, res) => {
  const url = `${baseUrl}/manga/${req?.params?.comic_name}`;

  const fetchKomikDatas = async () => {
    const responsePages = await fetchPages(url);

    const dom = new JSDOM(responsePages).window.document;
    const results = {};
    const genres = [];
    const chapters = [];
    const recommendedComics = [];

    results["comicTitle"] = dom.querySelector(
      "li[itemprop=itemListElement]:nth-child(2) span[itemprop=name]"
    ).textContent;

    results["comicThumbnail"] = dom
      .querySelector(".thumb img")
      .getAttribute("src");

    results["comicDescription"] = dom
      .querySelector("div[itemprop=description] p")
      .textContent.trim();

    results["comicStatus"] = dom
      .querySelectorAll(".tsinfo .imptdt")[0]
      .querySelector("i").textContent;

    // results["comicType"] = dom
    //   .querySelectorAll(".tsinfo .imptdt")[1]
    //   .querySelector("a").textContent;
    console.log("sdasd : ", dom.querySelectorAll(".tsinfo .imptdt")[1]);
    // results["comicTypeLink"] = `/comic_type/${
    //   dom.querySelector(".tsinfo .imptdt:nth-child(2) a").textContent
    // }`;

    const genresDOM = dom.querySelectorAll(".mgen a");
    for (let i = 0; i < genresDOM.length; i++) {
      genres.push({
        genreName: genresDOM[i].textContent,
        genreLink: genresDOM[i].getAttribute("href").replaceAll(baseUrl, ""),
      });
    }
    results["comicGenres"] = genres;

    const chaptersDOM = dom.querySelectorAll("#chapterlist li");
    for (let i = 0; i < chaptersDOM.length; i++) {
      chapters.push({
        chapterName: chaptersDOM[i]?.querySelector(".chapternum").textContent,
        chapterDate: chaptersDOM[i]?.querySelector(".chapterdate").textContent,
        chapterLink: `/read${chaptersDOM[i]
          ?.querySelector(".eph-num a")
          .getAttribute("href")
          .replaceAll(baseUrl, "")}`,
        chapterDownloadLink: chaptersDOM[i]
          ?.querySelector(".dt a")
          .getAttribute("href"),
      });
    }
    results["comicChapters"] = chapters;

    dom.querySelectorAll(".listupd .bs").forEach((item) => {
      console.log("item : ", item.querySelector(".type"));
      recommendedComics.push({
        comicThumbnail: item?.querySelector("img").getAttribute("src"),
        comicTitle: item?.querySelector(".tt").textContent,
        ...(item.querySelector(".type")
          ? {
              comicType: item?.querySelector(".type")?.textContent,
              comicTypeLink: `/comic_type/${item
                ?.querySelector(".type")
                ?.textContent.toLowerCase()
                .trim()}`,
            }
          : {
              comicType: "",
              comicTypeLink: "",
            }),

        comicDetailsLink: item
          ?.querySelector("a")
          .getAttribute("href")
          .replaceAll(baseUrl, ""),
      });
    });
    results["recommendedComics"] = recommendedComics;

    return results;
  };

  fetchKomikDatas().then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

app.get("/read/:comicChapters", (req, res) => {
  const url = `${baseUrl}/${req?.params?.comicChapters}`;
  const fetchChapters = async () => {
    const responsePages = await fetchPages(url);

    const dom = new JSDOM(responsePages).window.document;
    const results = {};
    const images = [];
    const terbaru = [];

    // // getting title
    results["comicTitle"] = dom.querySelector(
      ".headpost .entry-title"
    ).textContent;

    // getting image
    dom.querySelectorAll("#readerarea img").forEach((item) => {
      images?.push({
        imagesSrc: item?.getAttribute("src"),
        imagesAlt: item?.getAttribute("alt"),
      });
    });
    results["images"] = images;

    // getting prevLink
    results["prevLink"] = dom
      .querySelector(".ch-prev-btn")
      .getAttribute("href");
    // results["prevLink"] =
    //   dom.querySelector("a.ch-prev-btn").getAttribute("href") === "#/prev/"
    //     ? false
    //     : dom.querySelector(".nextprev  .ch-prev-btn").getAttribute("href");

    // getting nextLink
    results["nextLink"] =
      dom.querySelector(".nextprev .ch-next-btn").getAttribute("href") ===
      "#/next/"
        ? false
        : dom.querySelector(".nextprev .ch-next-btn").getAttribute("href");

    // // getting terbaru
    // dom.querySelectorAll("#Terbaru .ls8").forEach((item) => {
    //   terbaru.push({
    //     terbaruImage: item?.querySelector("img").getAttribute("src"),
    //     terbaruTitle: item?.querySelector("h4").textContent.trim(),
    //     terbaruLink: item?.querySelector("a").getAttribute("href"),
    //   });
    // });

    results["terbaru"] = terbaru;

    return results;
  };

  fetchChapters().then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

app.get("/cari/:s", (req, res) => {
  const searchKey = req?.params?.s;
  const url = `https://data.komiku.id/cari/?post_type=manga&s=${searchKey}`;

  const fetchDataSearch = async () => {
    const responsePages = await fetchPages(url);

    const dom = new JSDOM(responsePages).window.document;

    const results = [];

    dom.querySelectorAll(".daftar .bge").forEach((item) => {
      results.push({
        comicTitle: {
          englishTitle: item.querySelector("h3").textContent.trim(),
          indonesiaTitle: item.querySelector("span.judul2").textContent.trim(),
        },
        comicThumbnail: item.querySelector("img").getAttribute("src"),
        comicLink: item
          .querySelector("a")
          .getAttribute("href")
          ?.replaceAll(baseUrl, "/"),
      });
    });

    return results;
  };

  fetchDataSearch().then((response) => {
    res.send({ status: 200, data: response, message: "Successfully get data" });
  });
});

app.get("*/*", (req, res) =>
  res.send({ status: 404, message: "Route not found" })
);

app.listen(8000);
