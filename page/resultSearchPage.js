const { expect ,  test } = require('@playwright/test');


exports.ResultSearch = class ResultSearch{
    
    menuTodos = "div#hdtb-msb";
    linkWiki = "//h3[@class='LC20lb MBeuO DKV0Md' and contains(text(),'Wikipedia')]";
    
    constructor(page){
        this.page = page;
    }
    
    resultSearch = async() =>{
        
        await this.page.waitForSelector(this.menuTodos);
        await this.page.locator(this.linkWiki).first().click();
    }


}