const { expect } = require("@playwright/test");
const { TomsMainPage } = require("../pageObjects/toms/toms-main.page");

exports.ValidarACCID = class ValidarACCID {

    //selectores
    inputICCID = "#id_v9141616220113337702_0";
    linkICCID = ".refImage.commonReferenceLink";
    totalItems = "#t4122361118013615427_9142460686613821324_t_total_items";
    btnBusqueda = "div.buttonInner";
    textBusquedaCero = "//img[@src='/img/ico/ico_rolledback.gif']";
    pageScroll = ".content.page-scroll";
    footer = ".footer";
    //estadoLogicoValor = "(//a[@class='SpanInfoLine_Value'])[9]";
    estadoLogicoValor = "(//td[@class='Default'])[3]";
    btnEditarICCID = "//a[@class='IconButton' and text()='Editar']";
    selectEstadoLogico = "(//select[@class='wide'])[1]";
    valorDisponible = "//a[@class='SpanInfoLine_Value'][contains(.,'Disponible')]";
    btnActualizar = "#pcUpdate";

    constructor(page) {
        this.page = page;
        this.tomsMainPage = new TomsMainPage(page);
    }


    validarIccid = async (iccid) => {
        console.log("El ICCID pasado por parametros en validarIccid() es:  " + iccid);
        
        await this.tomsMainPage.menuPrincipal.busquedaTarjetaSIM();
        await this.page.locator(this.inputICCID).type(iccid);
        await this.page.locator(this.btnBusqueda).click();
        await this.page.locator(this.pageScroll).click();
        await this.page.locator(this.footer).scrollIntoViewIfNeeded();
        if (await this.page.locator(this.textBusquedaCero).isVisible()) {
            return false;
        } else
            this.total = await this.page.locator(this.totalItems, { delay: 8 }).textContent();
        if (this.total != 1) {
            console.log("el ICCID no se puede utilizar, el total es igual a: " + this.total);
            return false;
        } else
        this.estado = await this.page.locator(this.estadoLogicoValor).textContent();
        console.log("El estado del numero " + msisdn + " es " + this.estado)
        if (this.estado == "Disponible") {
            return true;
        } else if (this.estado == "Reservado") {
            await this.page.locator(this.linkICCID).click();
            await Promise.all([this.page.waitForResponse("**/common/ajsonrpc.jsp"),]);
            await this.page.locator(this.btnEditarICCID).click();
            await this.page.locator(this.selectEstadoLogico).click();
            await this.page.locator(this.selectEstadoLogico).selectOption({ label: 'Disponible' });
            await this.page.locator(this.btnActualizar).click();
            await Promise.all([this.page.waitForResponse("**/common/ajsonrpc.jsp"),]);
            if (await this.page.locator(this.valorDisponible).isVisible())
                return true;
            return false;

        } else return false


    }


}