# Komikstation Scrape API

This API based on this [website](https://komikstation.co/)

<hr />

## Steps for use this project for your own projects

1. Clone this project <br />
   `git clone https://github.com/VirtualPetProjectTA/KomikIndonesiaAPI.git`

2. Install Dependencies <br />
   `npm i` or `npm i --legacy-peer-deps` or `npm i --force`

3. Run <br />
   `npm start`

<hr />

## Routes

<table border=1>
    <tr>
        <th>
            Route
        </th>
        <th>
            Descriptions
        </th>
    </tr>
    <tr>
        <td>
            /
        </td>
        <td>
            For getting trending comics
        </td>
    </tr>
    <tr>
        <td>
            /genres/:genreTypes
        </td>
        <td>
            [action, shounen, ecchi, horror]
        </td>
        <td>
            For getting genres comics
        </td>
    </tr>
    <tr>
        <td>
            /comic_type/:comic_type
        </td>
        <td>
            [manhua, manga, manhwa]
        </td>
        <td>
            For getting comic types
        </td>
    </tr>
</table>

<hr />

## Demo

You guys can try this API in this [Link]()
