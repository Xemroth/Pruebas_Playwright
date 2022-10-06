const { expect ,  test } = require('@playwright/test');

exports.WikiPage = class WikiPage{

    //localizadores
    logoWiki = ".mw-wiki-logo";
    titulo = "h1#firstHeading";

    constructor(page){
        this.page = page;
    }

    confirmWiki = async()=>{
        await this.page.waitForSelector(this.logoWiki);
        await expect(this.page.locator(this.titulo)).toHaveText("Molécula de agua");
    }

}