/**
 * Created with IntelliJ IDEA.
 * User: st
 * Date: 22/02/14
 * Time: 19.39
 * To change this template use File | Settings | File Templates.
 */

var navigazione = {
    "items": [
//        { "name": "pan" },
//        { "name": "zoomin" },
//        { "name": "zoomout" },
        { "name": "fitall" },
//        { "name": "zoomToInitialExtent" },
        { "name": "zoomprevious" },
        { "name": "zoomnext" }
    ]
};

var avanzate = {
    "name": "avanzate",
    "items": [
        {"name": "infowms" },
        {"name": "transparency" },
        {"name": "loadlayers",
            "panels": [
                {
                    "type": "layerTree",
                    "name": "Temi",
                    "options": {
                        "treeServiceUrl": "/geoservices/REST/corem/load_layer_tree/",
                        "layersConfigServiceUrl": "/geoservices/REST/corem/load_layer_config/"
                    }
                },
                {
                    "type": "mapTree",
                    "name": "PTR",
                    "options": {
                        "treeServiceUrl": "/geoservices/REST/config/ag_canale_tree/102"
                    }
                },
                {
                    "type": "mapTree",
                    "name": "Repertorio Cartografico",
                    "options": {
                        "treeServiceUrl": "/geoservices/REST/config/rep_carto_tree/03"
                    }
                }
            ]
        },
        {"name": "removelayers" },
        {"name": "selectfeature",
            "options": {
                "idLayer": "L26,L27,L28",
                "flagSelezioneSingola": true,
                "radius": 5
            }
        }
    ]
};

var legenda = {
    "align": "right",
    "items": [
        {"name": "simpleLegend"}
    ]
};

var toolbarConfig = {
    "itemGroups": [
        navigazione,
        avanzate,
        legenda
    ]
};

var config = {
    "application": {
        "mapOptions": {
            "displayProjection": "EPSG:900913",
            "restrictedExtent": "830036,5402959,1123018,5597635"
        },
        "layout": {
            "statusBar": true,
            "legend": null,
//                    "legend": {
//                        "type": "simple",
//                        "position": "east",
//                        "collapsed": false
//                    },
            "widgets": [
                { "name": "Scale" },
                { "name": "CoordinateReadOut" }
            ],
            "toolbar": toolbarConfig
        }
    },
    "baseLayers": [
        { "type": "no_base" },
        { "type": "google_satellite", "visible": false},
        { "type": "rl_ortofoto_2010" },
        { "type": "OSM" },
        { "type": "bing_road" },
        { "type": "bing_hybrid" },
        { "type": "google_roadmap" },
        { "type": "google_hybrid" },
        { "type": "google_terrain" },
        { "type": "google_satellite" },
        {
            "wmsParams": {
                "url": "http://mapproxy.regione.liguria.it/mapproxy/1505/service?",
                "name": "L3861",
                "transparent": true,
                "format": "image/png"
            },
            "type": "WMS",
            "name": "L3861",
            "projection": "EPSG:3003",
            "geomType": "RASTER",
            "geomSubType": "RASTER",
            "legend": {
                "label": "Ortofoto AGEA 2010 MapProxy WMS Cache",
                "icon": "/geoviewer/img/legend/raster.gif"
            },
            "visible": true
        },
        {
            "type": "MapProxyTMS",
            "url": "http://mapproxy.regione.liguria.it/mapproxy/1587/tms/",
            "name": "L4101/webmercator",
            "visible": false,
            "minScale": 10000,
            "maxScale": 1000,
            "maxZoomLevel": 17,
            "projection": "EPSG:3857",
            "attribution": "Regione Liguria",
            "legend": {
                "label": "CTR 1:5000",
                "icon": "/geoviewer/img/legend/raster.gif"
            }
        },
        {
            "type": "MapProxyTMS",
            "url": "http://mapproxy.regione.liguria.it/mapproxy/1407/tms/",
            "name": "L3627/webmercator",
            "visible": false,
            "minScale": 20000,
            "maxScale": 1000,
            "maxZoomLevel": 16,
            "projection": "EPSG:3857",
            "attribution": "Regione Liguria",
            "legend": {
                "label": "CTR 1:10000",
                "icon": "/geoviewer/img/legend/raster.gif"
            }
        },
        {
            "type": "MapProxyTMS",
            "url": "http://mapproxy.regione.liguria.it/mapproxy/7/tms/",
            "name": "L2073/webmercator",
            "visible": false,
            "maxScale": 0,
            "maxZoomLevel": 16,
            "projection": "EPSG:3857",
            "attribution": "Regione Liguria",
            "legend": {
                "label": "CTR 1:25000",
                "icon": "/geoviewer/img/legend/raster.gif"
            }
        }
    ],
    "layers": []
};


