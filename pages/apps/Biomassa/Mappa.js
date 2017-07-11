Ext.application({
    name: 'BioMassa',

    launch: function() {

        var config = {
            "application": {
                "mapOptions": {
                    "restrictedExtent": "830036,5402959,1123018,5597635"
                },
                "layout": {
                    "statusBar": true,
                    "legend": {
                        "type": "simple",
                        "position": "east",
                        "collapsed": false
                    },
                    "widgets": [
                        { "name": "Scale" },
                        { "name": "CoordinateReadOut" }
                    ],
                    "toolbar": {
                        "itemGroups": [
                            {
                                "items": [
                                    { "name": "pan" },
                                    { "name": "zoomin" },
                                    { "name": "zoomout" },
                                    { "name": "fitall" },
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
                                            }
                                        ]
                                    },
                                    {"name": "removelayers" },
                                    /*
                                     {"name": "find",
                                     "panels": [
                                     {
                                     "type": "indirizzo",
                                     "name": "Indirizzo"
                                     }
                                     ]
                                     },
                                     */
                                    {"name": "routeplanner", "options": { "flagLimitaTerritorioLigure": "true" }},
                                    {"type": "combo", "name": "geocoder"}
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

        // imposto il codice catalogo e la lista di valori per la find
        // leggendo la querystring
        var values = decodeURIComponent(CWN2.Util.getUrlParam('FIND_VALORI'));

        // carico la mappa
        CWN2.app.load({
            appConfig: config,
            proxy: "/geoservices/proxy/proxy.jsp?url=",
            idMap: 1580,
            findOptions: {
                layers: ["L4077"],
                fields: "ID1",
                values: values,
                zoomLevel: null
            },
            debug: false
        });
    }
});