const { test, expect, request } = require("@playwright/test");
const {DB2} = require('../utiles/db');
const {GooglePage } = require("../page/searchGooglePage");
const {ResultSearch } = require("../page/resultSearchPage");
const {WikiPage} = require ("../page/wikiPage");




test("Test de prueba con Google", async ({ page }) => {

    const searchGoogle = new GooglePage(page);
    const resultSearch = new ResultSearch(page);
    const wikiPage = new WikiPage(page);
    //base de datos
    const db = new DB2();
    let urlBD;

    await page.goto('https://www.google.com/');
    await searchGoogle.searchGoogle();
    await resultSearch.resultSearch();

    const titulo = await page.title();
    console.log("El titulo seleccionado es: " + titulo );

    await wikiPage.confirmWiki();

     const url = page.url();
    db.insertURL(url);
    console.log("La url insertada en la BD es: "+url);

    await db.getURLP(url).then(results=>{
        console.log("La url desde BD es: "+results.pageURL) 
        urlBD = results.pageURL;
        
        })

    await page.goto('https://www.google.com/'); 
    await page.goto(urlBD);
    await expect(page).toHaveURL(urlBD);
});

