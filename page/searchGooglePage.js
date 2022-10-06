const { expect ,  test } = require('@playwright/test');


exports.GooglePage = class GooglePage{
    
    inputBusqueda = "//input[@class='gLFyf gsfi' and @type='text']";
    textH20 = "//span[text()='H2O']";
    
    constructor(page){
        this.page = page;
    }
    
    searchGoogle = async() =>{
        
        await this.page.locator(this.inputBusqueda).type("H2O");
        await this.page.locator(this.textH20).click();
    }


}