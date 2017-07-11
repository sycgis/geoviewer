Ext.application({
    name: 'ambienteinliguria',

    launch: function() {
        // imposto la url del servizio di configurazione
        var idMap = decodeURIComponent(CWN2.Util.getUrlParam('id'));
        //CWN2.Globals.AMBIENTE = decodeURIComponent(CWN2.Util.getUrlParam('ambiente'));


        var baselayers = [
            { "type": "no_base" },
            { "type": "OSM" },
            { "type": "rl_ortofoto_2013" },
            { "type": "google_terrain" },
            { "type": "google_roadmap" },
            { "type": "google_satellite", "visible": true}
        ];

        if (idMap === '1266') {
            baselayers = [
                { "type": "no_base" },
                { "type": "rl_ortofoto_2000" },
                { "type": "rl_ortofoto_2007" },
                { "type": "rl_ortofoto_2010" },
                { "type": "rl_ortofoto_2013" },
                { "type": "google_roadmap" },
                { "type": "google_satellite", "visible": true}
            ]
        }


        var toolbar = {
            "itemGroups": [
                {
                    "items": [
                        { "name": "pan" },
                        { "name": "zoomin" },
                        { "name": "zoomout" },
                        //{ "name": "fitall" },
                        { "name": "zoomToInitialExtent" },
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
                                    "type": "mapTree",
                                    "name": "Canali Tematici",
                                    "options":
                                    {
                                        "treeServiceUrl": "http://geoportale.regione.liguria.it/geoservices/REST/config/ag_app_canali_tree/ECO3/"
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
                        {"name": "window",
                            "options": {
                                id: "window",
                                tooltip: "Metadati",
                                url: "http://www.cartografiarl.regione.liguria.it/SiraWebGis/sitInfoCarta.asp?Entita=" + idMap,
                                winWidth: 800,
                                winHeight: 600,
                                iconCls: "metadati"
                            }
                        },
                        {"name": "print" },
                        {"type": "combo", "name": "geocoder"}
                    ]
                }
            ]
        };

        var config = {
            "application": {
                "mapOptions": {
                    "displayProjection": "EPSG:3857",
                    "restrictedExtent": "830036,5402959,1123018,5597635"
                },
                "layout": {
                    "header": {
                        "html": "<div><table><tr><td><img src='http://geoportale.regione.liguria.it/geoviewer/img/ambienteinliguria.gif' ></td><td>&nbsp;&nbsp;</td><td><div id='titolo'></div></td></tr></table></div>",
                        "height": 125,
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
            "baseLayers": baselayers
        };

        CWN2.app.load({
            appConfig: config,
            idMap: idMap,
            loadBaseLayers: true,
            debug: false,
            app: 'ambiente-pubblico',
            setMapTitle: 'titolo'
        });

    } //eo launch
});




