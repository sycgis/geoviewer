
// URL
//http://www.cartografiarl.regione.liguria.it/cartoWebNET/CwSelezionaFogliRepCartRichiesta.aspx?cod_catalogo=1592&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=&dom=03
// http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=1592&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=&dom=03
// http://parodi.datasiel.net/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=1592&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=&dom=03

/* TEST
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=1592&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=63&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=158&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=2&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=457&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=20&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=4&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=1407&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=1237&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=383&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=419&cod_formato=MAPINFO&cod_supporto=4.1&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=1423&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
 http://geoportale.regione.liguria.it/geoviewer/pages/apps/repertorio/selezione_fogli.html?cod_catalogo=459&cod_formato=SU%20CARTA&cod_supporto=1.3&numero_ordine=325538&dom=03
*/

Ext.application({
    name: 'repertorio',


    launch: function() {
        var idMap = decodeURIComponent(CWN2.Util.getUrlParam('cod_catalogo'));
        var codFormato = decodeURIComponent(CWN2.Util.getUrlParam('cod_formato'));
        var codSupporto = decodeURIComponent(CWN2.Util.getUrlParam('cod_supporto'));
        var numeroOrdine = decodeURIComponent(CWN2.Util.getUrlParam('numero_ordine'));
        var codTema = decodeURIComponent(CWN2.Util.getUrlParam('cod_tema'));
        var dom = decodeURIComponent(CWN2.Util.getUrlParam('dom'));
        var codTSquadro = null;
        var codAcquisiz = null;

        if (codTema === "null") {
            codTema = "";
        }

        var config = {
            "application": {
                "mapOptions": {
                    "displayProjection": "EPSG:3857",
                    "restrictedExtent": "830036,5402959,1123018,5597635"
                },
                "layout": {
                    "type": "viewport",
                    "statusBar": true,
                    "legend": {
                        "type": "simple",
                        "position": "east"
                    },
                    "width": 860,
                    "height": 500,
                    "widgets": [
                        { "name": "Scale" }
                    ],
                    "toolbar": {
                        "id": 1,
                        "pressed": "selectfeature",
                        "name": "ToolBar",
                        "itemGroups": [
                            {
                                "name": "navigazione",
                                "items": [
                                    { "name": "pan" },
                                    { "name": "zoomin" },
                                    { "name": "zoomout" },
                                    { "name": "fitall" },
                                    { "name": "zoomprevious" },
                                    { "name": "zoomnext" }
                                ]
                            },
                            {
                                "name": "avanzate",
                                "items": [
                                    {"type": "combo", "name": "geocoder"}
                                ]
                            },
                            {
                                "name": "selezione",
                                "items": [
                                    {
                                        "type": "button",
                                        "name": "selectfeature",
                                        "options": {
                                            //idLayer: "L3557",
                                            radius: 1,
                                            callBacks: {
                                                "submit": function(items) {
                                                    var fogli =  items;
                                                    if (fogli.length < 1) {
                                                        CWN2.Util.messageBox("Selezionare almeno un foglio");
                                                        return;
                                                    }
                                                    var listaFogli = "";
                                                    for (var i = 0; i < fogli.length; i++) {
                                                        listaFogli += fogli[i].data["LABEL"] + ",";
                                                    }
                                                    listaFogli = listaFogli.substr(0, listaFogli.length - 1);

                                                    var urlSitoRepCart = null;
                                                    if (document.referrer.indexOf("dcarto3.datasiel.net") > 0) {
                                                        urlSitoRepCart = "http://dcarto3.datasiel.net/sitar/sito/eco_metti_linea_ord.asp?selezioneFogliIntra="
                                                    } else {
                                                        urlSitoRepCart = (dom == "01")?
                                                            "http://cartografia-ics.regione.liguria.it/eco_metti_linea_ord.asp?selezioneFogliIntra=OK" :
                                                            (dom == "REGIONE")?
                                                                "http://www-intra.cartografia.regione.liguria.it/eco_metti_linea_ord.asp?selezioneFogliIntra=OK":
                                                                "http://www.cartografia.regione.liguria.it/eco_metti_linea_ord.asp?selezioneFogliIntra=";
                                                    }
                                                    urlSitoRepCart += '&cod_catalogo='+ idMap;
                                                    urlSitoRepCart += '&cod_formato='+ codFormato;
                                                    urlSitoRepCart += '&cod_supporto='+ codSupporto;
                                                    urlSitoRepCart += '&cod_tema='+ codTema;
                                                    urlSitoRepCart += '&cod_acquisiz='+ codAcquisiz;
                                                    urlSitoRepCart += '&cod_t_squadro='+ codTSquadro;
                                                    urlSitoRepCart += '&numero_ordine='+ numeroOrdine;
                                                    urlSitoRepCart += '&num_fogli='+ listaFogli;
                                                    if (parent.frames.length>1)
                                                        parent.frames[1].location.href=urlSitoRepCart;
                                                    else
                                                        window.location.href=urlSitoRepCart;
                                                },
                                                "cancel": function(items) {
                                                    window.history.back();
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            "baseLayers": [
                { "type": "no_base" },
                { "type": "OSM" },
                { "type": "rl_ortofoto_2013" },
                { "type": "google_terrain" },
                { "type": "google_roadmap" },
                { "type": "google_satellite", "visible": true}
            ]


        };

        // funzione che carica il livello dello squadro
        var loadMapConfig = function(params) {
            var url = CWN2.Globals.RL_LAYER_CONFIG_SERVICE + params.idLayer;
            CWN2.Util.ajaxRequest({
                type: "JSONP",
                url: url,
                callBack: function(response) {
                    var layerConfig = response.data;
					layerConfig[0].legend.label = "Selezione Squadro";
                    CWN2.app.map.layerManager.addLayers(layerConfig);
                }
            });
        };

        CWN2.Util.ajaxRequest({
            type: "JSONP",
            url: "/geoservices/REST/config/selezione_fogli_repcarto/" + idMap + "?cod_formato=" + codFormato + "&cod_supporto=" + codSupporto,
            callBack: function(response) {
                var idLayer = response.data.livello;
                codTSquadro = response.data.squadro;
                codAcquisiz = response.data.acquisiz;
                config.application.layout.toolbar.itemGroups[2].items[0].options.idLayer = "L" + idLayer;
                CWN2.app.load({
                    appConfig: config,
                    divID: "mappanel",
                    idMap: idMap,
                    loadBaseLayers: false,
                    callBack: loadMapConfig,
                    callBackArgs: {
                        idLayer: idLayer
                    },
                    debug: false,
                    app: 'selezione-fogli',
                    setMapTitle: 'titolo'
                });
            }
        });
    } //eo launch
});



