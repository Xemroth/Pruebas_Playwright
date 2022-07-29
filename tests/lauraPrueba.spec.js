const { test, expect, request } = require("@playwright/test");


test("Test de prueba con Google", async ({ page }) => {
    //localizadores
    const inputBusqueda = "//input[@class='gLFyf gsfi' and @type='text']";
    const textH20 = "//span[text()='H2O']";
    const menuTodos = "div#hdtb-msb";
    const linkWiki = "//h3[@class='LC20lb MBeuO DKV0Md' and contains(text(),'Wikipedia')]";
    const logoWiki = ".mw-wiki-logo";


    await page.goto('https://www.google.com/');
    await page.locator(inputBusqueda).type("H2O");
    await page.locator(textH20).click();
    await page.waitForSelector(menuTodos);
    await page.locator(linkWiki).first().click();
    await page.waitForSelector(logoWiki,{delay: 2000});
    await page.waitForTimeout(3000);
    
    const titulo = await page.title();
    console.log("El titulo seleccionado es: " + titulo);

});

