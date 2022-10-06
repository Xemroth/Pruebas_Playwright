const { expect } = require("@playwright/test");

exports.TomsMenuPrincipalPage = class TomsMenuPrincipalPage {
    clienteResidencial = "#menuItem_0 >> text=Cliente residencial";
    crearRapido = "text=Creación Rápida";

    //menu -> Busqueda -> Busqueda te tarjetas SIM
    busqueda = "#gen_menu_6";
    scrollActivo = ".scrollArrowBottom.scrollArrowActive";
    busquedaSIM = "//li/a/span[text()='Búsqueda de tarjetas SIM']";
    busquedaNro = "//li/a/span[text()='Búsqueda de números fijos y móviles']";


    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    crearClienteResi = async () => {
        await this.page.locator(this.crearRapido).hover();
        await this.page.locator(this.clienteResidencial).dblclick();
    };

    busquedaTarjetaSIM = async () => {
        await this.page.locator(this.busqueda).hover();
        this.scrollDown(this.busquedaSIM);
         await this.page.locator(this.busquedaSIM).click();
    }

    busquedaNumero = async () => {
        await this.page.locator(this.busqueda).hover();
        this.scrollDown(this.busquedaNro);
         await this.page.locator(this.busquedaNro).click();
    }

     //metodo para hacer scroll en los elementos del menu principal(Navegacion, Busqueda,)
    scrollDown = async (localizador) => {
         while (!await this.page.locator(localizador).isVisible()) {
            await this.page.locator(this.scrollActivo).click();
        }
        
    }
};
