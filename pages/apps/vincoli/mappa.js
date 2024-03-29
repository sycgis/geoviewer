Ext.application({
    name: 'repertorio',


    ricercaParticellaCatastale: function (codiceLivello, bounds, layer, chiave, valore) {
        var searchBounds = OpenLayers.Bounds.fromString(CWN2.Util.transformStrBounds("EPSG:3003", CWN2.app.map.projection, bounds));

        CWN2.FeatureLoader.loadMarker(
            {
                x: searchBounds.getCenterLonLat().lon,
                y: searchBounds.getCenterLonLat().lat,
                map: CWN2.app.map,
                label: valore.replace('_','unica'),
                zoomLevel: 17
            }
        );
    },

    launch: function() {

        var toolbar = {
            "itemGroups": [
                {
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
                    "items": [
                        { "name": "measureline" },
                        { "name": "measurearea" }
                    ]
                },
                {
                    "items": [
                        {"name": "infowms" },
                        {"name": "transparency" },
                        {"name": "loadlayers",
                            "panels": [
                                {
                                    "type": "mapTree",
                                    "name": "Repertorio Cartografico",
                                    "options": {
                                        "treeServiceUrl": "http://geoportale.regione.liguria.it/geoservices/REST/config/rep_carto_tree/03"
                                    }
                                },
                                {
                                    "type": "wms",
                                    "name": "Livelli WMS",
                                    "options": {}
                                },
                                {
                                    "type": "kml",
                                    "name": "File KML/GPX",
                                    "options": {}
                                }
                            ]
                        },
                        {"name": "removelayers" },
                        {"name": "find", "panels": [
                            { "type": "layer", "name": "Livello" },
                            { "type": "coordinate", "name": "Coordinate" }
                        ]},
                        {"name": "routeplanner", "options": { "flagLimitaTerritorioLigure": "true" }},
                        {"name": "s3ricerche",
                            "options": {
                                id: "s3ricerche",
                                url: "/sigmater/script/CwRicercheS3.asp?applicazione=REPERTORIO",
                                tooltip: "Ricerca Particella Catastale",
                                render: "panel"
                            }
                        },
                        {"name": "print" },
                        {"type": "combo", "name": "geocoder"}
                    ]
                }
            ]
        };

        var header = [
            "<DIV STYLE='display:block; POSITION:absolute; LEFT:0px; TOP:0px; height:85px; width: 100%; font-size:16px;'>",
            "<div STYLE='margin: 0px;color:#FFFFFF;background-color:#ff8106;height:85px;clear: both;'>",
            "<div STYLE='float:right;margin: 0px;height:84px;'><a href='http://www.beniculturali.it' title='sito beni culturali: apre una nuova finestra' onClick='window.open(this.href);return false;' onkeypress='window.open(this.href);return false;'><img src='img/vincoli_logo_dx_1.gif' alt='Ministero Beni Culturali' title='Ministero Beni Culturali' width='90' height='85' class='noborder'></a><a href='http://www.regione.liguria.it' title='vai al sito regione liguria: apre una nuova finestra' onClick='window.open(this.href);return false;' onkeypress='window.open(this.href);return false;'><img src='img/vincoli_logo_dx_2.jpg' alt='Regione Liguria' title='Logo Regione Liguria' width='67' height='85' class='noborder'></a></div>",
            "<div STYLE='float:left;margin: 0px;height:84px;'><a href='http://www.liguriavincoli.it/home.asp' title='vai alla home page'><img  class='noborder' src='img/vincoli_logo_sx_1.jpg' alt='Vincoli architettonici, archeologici, paesaggistici' title='Logo vincoli architettonici, archeologici, paesaggistici' width='473' height='85'></a> </div>",
            "</div>",
//            "<div id='subheader'>sito a cura di Regione Liguria e Direzione Regionale per i Beni Culturali e Paesaggistici della Liguria </div>",
            "</DIV>"
        ].join('\n');

        var config = {
            "application": {
                "mapOptions": {
                    "displayProjection": "EPSG:3003",
                    "restrictedExtent": "830036,5402959,1123018,5597635"
                },
                "layout": {
                    "header": {
                        "html": header,
                        "height": 85,
                        "style": {
                            "background-color": "#ffffff"
                        }
                    },
                    "statusBar": true,
                    "legend": {
                        "type": "simple",
                        "position": "east"
                    },
                    "widgets": [
                        { "name": "ScaleCombo" },
                        { "name": "CoordinateReadOut" }
                    ],
                    "toolbar": toolbar
                }
            },
            "baseLayers": [
                { "type": "no_base" },
                { "type": "rl_ortofoto_2013" },
                { "type": "rl_carte_base"},
                { "type": "google_roadmap" },
                { "type": "google_satellite", "visible": true}
            ]
        };

        var idMap = null;
        var idRichiesta = CWN2.Util.getUrlParam('idRichiesta');

        if (!idRichiesta) {
//            idMap = 1378;
            idMap = 1646;
        }

        CWN2.app.load({
            appConfig: config,
            idRequest: idRichiesta,
            idMap: idMap,
            loadBaseLayers: true,
            debug: false,
            findOptions: { maxZoomLevel: 18 },
            app: 'vincoli',
            setMapTitle: 'none'
        });

    } //eo launch
});




