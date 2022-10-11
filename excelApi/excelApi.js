// Google api
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
// configure a JWT auth client
const privatekey = require("../credentials.json");
const secrets = require("../secrets.json");
//Clase para validar el ICCID
const { ValidarACCID } = require("../validator/validarICCID");
const { ValidarMSISDN } = require("../validator/validarMSISDN");


exports.ExcelApi = class ExcelApi {

    //google api
    auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    // service = google.sheets({ version: 'v4', auth });

    //autenticación por token
    authClient = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']);

    // hoja de excel
    sheets = google.sheets('v4');
    today = new Date();
    constructor(page) {
        this.page = page;
        this.validadorICCID = new ValidarACCID(page);
        this.validadorMSISDN = new ValidarMSISDN(page);
        // authentication
        this.authClient.authorize()
            .then(function () {
                console.log("Authentication successful.\n");
            })
            .catch(function (error) {
                throw (error);
            });

    }

    //Funciones para actualizar los valores de las celdas en el excel
    updateCellUsado = async (i,sheetId) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            resource: {
                "valueInputOption": "RAW",
                "data": [
                    {
                        "dataFilter": {
                            "gridRange": {
                                "startRowIndex": i,
                                "startColumnIndex": 2,
                                "sheetId": sheetId
                            }
                        },
                        "values": [
                            [
                                "Usado"
                            ]
                        ]
                    }
                ]
            },
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchUpdateByDataFilter(request)).data;
            //console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
    updateCellUsuario = async (i,sheetId) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            resource: {
                "valueInputOption": "RAW",
                "data": [
                    {
                        "dataFilter": {
                            "gridRange": {
                                "startRowIndex": i,
                                "startColumnIndex": 3,
                                "sheetId": sheetId
                            }
                        },
                        "values": [
                            [
                                "lacamacho"
                            ]
                        ]
                    }
                ]
            },
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchUpdateByDataFilter(request)).data;
            //console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
    updateCellAmbiente = async (i,sheetId) => {
        const url = await this.page.url();
        ///todo capturar ambiente de la URL, para preprod y test
        const urlSUB = url.substring(14, 17);
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            resource: {
                "valueInputOption": "RAW",
                "data": [
                    {
                        "dataFilter": {
                            "gridRange": {
                                "startRowIndex": i,
                                "startColumnIndex": 4,
                                "sheetId": sheetId
                            }
                        },
                        "values": [
                            [
                                `${urlSUB}`
                            ]
                        ]
                    }
                ]
            },
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchUpdateByDataFilter(request)).data;
            //console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
    updateCellFecha = async (i,sheetId) => {
        const now = this.today.toLocaleString();
        // console.log("la fecha actual es: " + now.substring(0, 7));
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            resource: {
                "valueInputOption": "RAW",
                "data": [
                    {
                        "dataFilter": {
                            "gridRange": {
                                "startRowIndex": i,
                                "startColumnIndex": 5,
                                "sheetId": sheetId
                            }
                        },
                        "values": [
                            [
                                `${now.substring(0, 9)}`
                            ]
                        ]
                    }
                ]
            },
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchUpdateByDataFilter(request)).data;
            //console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
    updateCellNoUsar = async (i,sheetId) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            resource: {
                "valueInputOption": "RAW",
                "data": [
                    {
                        "dataFilter": {
                            "gridRange": {
                                "startRowIndex": i,
                                "startColumnIndex": 2,
                                "sheetId": sheetId
                            }
                        },
                        "values": [
                            [
                                "No en el ambiente"
                            ]
                        ]
                    }
                ]
            },
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchUpdateByDataFilter(request)).data;
        } catch (err) {
            console.error(err);
        }
    }

    //
    getCellDisponible = async (i) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: ['ICCID!A2:A8', 'ICCID!C2:C8'],
            auth: authClient,
        };
        try {
            const response = (await sheets.spreadsheets.values.batchUpdateByDataFilter(request)).data;
            console.log(JSON.stringify(response, null, 2));
        } catch (err) {
            console.error(err);
        }
    }
    

    //Devuelve el 1er ICCID Disponible y actualiza el estado a Usado
    getIccidDisponibleExcel = async () => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: ['ICCID!A37:A618', 'ICCID!C37:C618'],
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchGet(request)).data;
            //console.log(JSON.stringify(response, null, 2));
            const rows = response.valueRanges;
            const numeros = rows[0].values;
            const estado = rows[1].values;
            console.log("La variable numeros es igual a : " + numeros)
            for (let index = 0; index < numeros.length; index++) {
                if (estado[index] == 'Disponible') {
                    const result = numeros[index];
                    await this.updateCellUsado(index + 1);
                    await this.updateCellUsuario(index + 1);
                    await this.updateCellAmbiente(index + 1);
                    await this.updateCellFecha(index + 1);
                    return result[0];
                }
            }
            return 0;
        } catch (err) {
            console.error(err);
        }
    }

    //Devuelve el 1er ICCID Disponible en un rango dado y actualiza el estado a Usado
    getIccidDisponibleExcelRango = async (start, end) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: [`ICCID!A${start}:A${end}`, `ICCID!C${start}:C${end}`],
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchGet(request)).data;
            //console.log(JSON.stringify(response, null, 2));
            const rows = response.valueRanges;
            const numeros = rows[0].values;
            const estado = rows[1].values;
            console.log("La variable numeros es igual a : " + numeros)
            for (let index = 0; index < numeros.length; index++) {
                if (estado[index] == 'Disponible') {
                    const result = numeros[index];
                    await this.updateCellUsado((start - 1) + index,866962264);
                    await this.updateCellUsuario((start - 1) + index,866962264);
                    await this.updateCellAmbiente((start - 1) + index,866962264);
                    await this.updateCellFecha((start - 1) + index,866962264);
                    return result[0];
                }
            }
            return 0;
        } catch (err) {
            console.error(err);
        }
    }

    //Valida todos los ICCID del Excel
    revisarICCID = async () => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: ['ICCID!A15:A617', 'ICCID!C15:C617'],
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchGet(request)).data;
            //console.log(JSON.stringify(response, null, 2));
            const rows = response.valueRanges;
            console.log("La variable numeros es igual a : " + rows[0].values)
            const numeros = rows[0].values;
            const estado = rows[1].values;
            console.log("La variable numeros es igual a : " + numeros)
            for (let index = 0; index < numeros.length; index++) {
                if (estado[index] == 'Disponible') {
                    const result = numeros[index];
                    console.log("Result esta imprimiendo " + result);
                    this.control = await this.validadorICCID.validarIccid(`${result[0]}`);
                    console.log("control es igual a: " + this.control);
                    if (!this.control) await this.updateCellNoUsar(index + 1);

                }
            }

        } catch (err) {
            console.error(err);
        }
    }

    //Valida todos los ICCID de un rango dado
    revisarICCIDRango = async (start, end) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: [`ICCID!A${start}:A${end}`, `ICCID!C${start}:C${end}`],
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchGet(request)).data;
            //console.log(JSON.stringify(response, null, 2));
            const rows = response.valueRanges;
            console.log("La variable numeros es igual a : " + rows[0].values)
            const numeros = rows[0].values;
            const estado = rows[1].values;
            console.log("La variable numeros es igual a : " + numeros)
            for (let index = 0; index < numeros.length; index++) {
                if (estado[index] == 'Disponible'&& numeros[index]!='') {
                    const result = numeros[index];
                    console.log("Result esta imprimiendo " + result);
                    this.control = await this.validadorICCID.validarIccid(`${result[0]}`);
                    console.log("control es igual a: " + this.control);
                    if (!this.control) await this.updateCellNoUsar((start - 1) + index,866962264);

                }
            }

        } catch (err) {
            console.error(err);
        }
    }

    //Validar todos los MSISDN de un rango dado
    revisarMSISDNRango = async (start, end) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: [`MSISDN!A${start}:A${end}`, `MSISDN!C${start}:C${end}`],
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchGet(request)).data;
            //console.log(JSON.stringify(response, null, 2));
            const rows = response.valueRanges;
            
            console.log("La variable numeros es igual a : " + rows[0].values)
            const numeros = rows[0].values;
            const estado = rows[1].values;
            console.log("La variable numeros es igual a : " + numeros)
            for (let index = 0; index < numeros.length; index++) {
                if (estado[index] == 'Disponible'&& numeros[index]!='' ) {
                    const result = numeros[index];
                    console.log("Result esta imprimiendo " + result);
                    this.control = await this.validadorMSISDN.validarMsisdn(`${result[0]}`);
                    console.log("control es igual a: " + this.control);
                    if (!this.control) await this.updateCellNoUsar((start - 1) + index,655220071);

                }
            }

        } catch (err) {
            console.error(err);
        }
    }

    //Devuelve el 1er MSISDN Disponible en un rango dado y actualiza el estado a Usado
    getMsisdnDisponibleExcelRango = async (start, end) => {
        const request = {
            spreadsheetId: secrets.spreadsheet_id,
            ranges: [`MSISDN!A${start}:A${end}`, `MSISDN!C${start}:C${end}`],
            auth: this.authClient,
        };
        try {
            const response = (await this.sheets.spreadsheets.values.batchGet(request)).data;
            //console.log(JSON.stringify(response, null, 2));
            const rows = response.valueRanges;
            const numeros = rows[0].values;
            const estado = rows[1].values;
            console.log("La variable numeros es igual a : " + numeros)
            for (let index = 0; index < numeros.length; index++) {
                if (estado[index] == 'Disponible') {
                    const result = numeros[index];
                    await this.updateCellUsado((start - 1) + index,655220071);
                    await this.updateCellUsuario((start - 1) + index,655220071);
                    await this.updateCellAmbiente((start - 1) + index,655220071);
                    await this.updateCellFecha((start - 1) + index,655220071);
                    return result[0];
                }
            }
            return 0;
        } catch (err) {
            console.error(err);
        }
    }
}