const { expect } = require("@playwright/test");
const { TomsMainPage } = require("../pageObjects/toms/toms-main.page");

exports.ValidarMSISDN = class ValidarMSISDN {

    //Selectores
    idNro1 = "#id_v9144776102013673910_0";
    idNro2 = "#id_v9144776102013673910_2";
    idNro3 = "#id_v9144776102013673910_4";
    btnBusqueda = "div.buttonInner";
    pageScroll = ".content.page-scroll";
    footer = ".footer";
    textBusquedaCero = "//img[@src='/img/ico/ico_rolledback.gif']";
    totalItems = "#t4122361118013615427_9141907040613227267_t_total_items";
    linkMSISDN = ".refImage.commonReferenceLink";
    estadoLogicoValor = "(//td[@class='Default'])[3]";
    btnEditarICCID = "//a[@class='IconButton' and text()='Editar']";
    selectEstadoLogico = "(//select[@class='wide'])[1]";
    valorDisponible = "//a[@class='SpanInfoLine_Value'][contains(.,'Disponible')]";
    btnActualizar = "#pcUpdate";

    constructor(page) {
        this.page = page;
        this.tomsMainPage = new TomsMainPage(page);
    }

    validarMsisdn = async (msisdn) => {
        console.log("El MSISDN pasado por parametros en validarMsisdn() es:  " +msisdn);
        if(msisdn.length!=8)
        return false;

        await this.tomsMainPage.menuPrincipal.busquedaNumero();
        await this.page.locator(this.idNro1).type(`${msisdn}`.substring(0, 2));
        await this.page.locator(this.idNro2).type(`${msisdn}`.substring(2, 5));
        await this.page.locator(this.idNro3).type(`${msisdn}`.substring(5, 8));
        await this.page.locator(this.btnBusqueda).click();
        await this.page.locator(this.pageScroll).click();
        await this.page.locator(this.footer).scrollIntoViewIfNeeded();
        if (await this.page.locator(this.textBusquedaCero).isVisible()) {
            return false;
        } else
            this.total = await this.page.locator(this.totalItems, { delay: 8 }).textContent();
        if (this.total != 1) {
            console.log("el MSISDN no se puede utilizar, el total es igual a: " + this.total);
            return false;
        } else
            this.estado = await this.page.locator(this.estadoLogicoValor).textContent();
        console.log("El estado del numero " + msisdn + " es " + this.estado)
        if (this.estado == "Disponible") {
            return true;
        } else if (this.estado == "Planeado") {
            await this.page.locator(this.linkMSISDN).click();
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