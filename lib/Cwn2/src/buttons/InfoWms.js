/*global CWN2:false, window:false, OpenLayers:false, Ext:false, GeoExt:false , $:false*/
Ext.define('CWN2.button.InfoWms', {
    extend: 'Ext.button.Button',
    alias: 'widget.cwn2-button-infowms',

    constructor: function (config) {
        "use strict";

        var btnOptions = config.options || {},
            map = CWN2.app.map,
            id = "infowms",
            me = this,
            hiliteLayerName = "_wmsInfo";

        // --------------------------------------------------------------------------------//

        // instanzio il gestore del layer di evidenziazione
        if (!btnOptions.disableHilite) {
            this.wmsSldHiliter = new CWN2.WmsSldHiliter(map, hiliteLayerName);
        }

        function setQueryLayersByName(layers) {
            if (layers) {
                var len = layers.length,
                    match = {},
                    i;
                match.test = function (name) {
                    for (i = 0; i < len; i++) {
                        if (name === layers[i]) {
                            return true;
                        }
                    }
                    return false;
                };
                return map.getLayersByName(match);
            } else {
                return null;
            }
        }

        // ritorna l'array con i layer della mappa
        function setQueryLayersByConfig() {
            var layers = map.layers,
                queryLayers = [];
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].config && layers[i].config.type === "WMS" && layers[i].config.queryable) {
                    queryLayers.push(layers[i]);
                }
            }
            return queryLayers;
        }

        var vendorParams = btnOptions.vendorParams || {};
        if (btnOptions.radius) {
            vendorParams.radius = btnOptions.radius;
        }

        var control = new OpenLayers.Control.WMSGetFeatureInfo(
            {
                id: "infoWmsControl",
                layers: (btnOptions.layers) ? setQueryLayersByName(btnOptions.layers.split(",")) : setQueryLayersByConfig(),
                queryVisible: true,
                drillDown: true,
                maxFeatures: btnOptions.maxFeatures || CWN2.Globals.INFO_WMS_MAX_FEATURES,
                infoFormat: "application/vnd.ogc.gml",
                //vendorParams: vendorParams,
                output: "object",
                eventListeners: {
                    getfeatureinfo: function (event) {
                        me.fireEvent("getfeatureinfo", event);
                    }
                }
            }
        );

        map.addControl(control);

        this.options = btnOptions;

        this.superclass.constructor.call(this, Ext.create('GeoExt.Action', {
            id: id,
            tooltip: CWN2.I18n.get("Info"),
            iconCls: (btnOptions && btnOptions.iconCls) ? btnOptions.iconCls : id,
            text: (btnOptions && btnOptions.text) ? btnOptions.text : "",
            width: (btnOptions && btnOptions.width) ? btnOptions.width : 26,
            enableToggle: true,
            control: control,
            toggleGroup: "mapInteractToggleGroup"
        }));
    }
});

Ext.define('CWN2.button.InfoWms.featureList.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.cwn2-infowms-featurelist-win',
    title: CWN2.I18n.get("Risultato Interrogazione"),
    height: 350,
    width: 480,
    layout: "fit",
    resizable: false,
    constructor: function (config) {
        this.items = config.items;
        this.superclass.constructor.call(this);
    }
});

Ext.define('CWN2.button.InfoWms.featureList.GridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.cwn2-infowms-featurelist-grid',
    header: false,
    frame: true,
    width: 440,
    height: 300,
    iconCls: "icon-grid",
    columns: [
        {
            header: "Livello",
            id: "layerLabel",
            sortable: true,
            dataIndex: "layerLabel",
            renderer: function (legend, metaData, record) {
                var label = record.data.layerLabel;
                var cssStyle = "cursor:pointer; text-decoration:underline";
                return "<div style='" + cssStyle + "'>" + label + " </div>";
            },
            width: 240
        },
        {
            header: "Feature",
            id: "label",
            sortable: true,
            dataIndex: "label",
            renderer: function (legend, metaData, record) {
                var label = record.data.label;
                var cssStyle = "cursor:pointer; text-decoration:underline;font-weight: bold";
                return "<div style='" + cssStyle + "'>" + label + " </div>";
            },
            width: 200
        }
    ],

    constructor: function (config) {
        this.store = Ext.create('CWN2.button.InfoWms.featureList.Store', {
            data: config.data
        });

        this.superclass.constructor.call(this);
    }


});

Ext.define('CWN2.button.InfoWms.featureList.Store', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: "featureId", mapping: "featureId"
        },
        {
            name: "layerLabel", mapping: "layerLabel"
        },
        {
            name: "layerName", mapping: "layerName"
        },
        {
            name: "label", mapping: "label"
        },
        {
            name: "attributes", mapping: "attributes"
        },
        {
            name: "doc", mapping: "doc"
        },
        {
            name: "feature", mapping: "feature"
        }
    ],
    sortInfo: {field: "layerName", direction: "ASC"},

    constructor: function (config) {
        this.data = config.data;
        this.superclass.constructor.call(this);
    }
});

Ext.define('CWN2.button.InfoWms.baseInfo.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.cwn2-infowms-baseinfo-win',
    height: 400,
    width: 360,
    layout: "fit",
    resizable: false,
    constructor: function (config) {
        this.title = config.title;
        this.items = config.items;
        this.superclass.constructor.call(this);
    }
});

Ext.define('CWN2.button.InfoWms.baseInfo.GridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.cwn2-infowms-baseinfo-grid',
    frame: true,
    width: 300,
    header: false,
    height: 300,
    hideHeaders: true,
    iconCls: "icon-grid",
    columns: [
        {
            header: "Campo",
            id: "infoLabelAttr",
            dataIndex: "infoLabelAttr",
            renderer: function (val) {
                return '<div style="white-space:normal !important;"><b>' + val + '</b></div>';
            },
            width: 150
        },
        {
            header: "Valore",
            id: "fieldValue",
            dataIndex: "fieldValue",
            renderer: function (val) {
                return '<div style="white-space:normal !important;">' + val + '</div>';
            },
            width: 150
        }
    ],

    constructor: function (config) {
        this.id = config.id;

        this.store = Ext.create('CWN2.button.InfoWms.baseInfo.Store', {
            data: config.data
        });

        this.superclass.constructor.call(this);
    }

});

Ext.define('CWN2.button.InfoWms.baseInfo.Store', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: "infoLabelAttr", mapping: "infoLabelAttr"
        },
        {
            name: "fieldValue", mapping: "fieldValue"
        }
    ],

    constructor: function (config) {
        this.data = config.data;
        this.superclass.constructor.call(this);
    }
});

Ext.define('CWN2.button.InfoWms.html.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.cwn2-infowms-html-win',
    title: "Info",
    resizable: false,
//    layout: "fit",
    autoScroll: true,

    constructor: function (config) {
        this.height = config.height;
        this.width = config.width;
        this.items = config.items;
        this.superclass.constructor.call(this);
    }
});

// CONTROLLER
Ext.define('CWN2.controller.button.infowms', {
    extend: 'Ext.app.Controller',

    views: [
        'CWN2.button.InfoWms'
    ],

    refs: [
        {
            ref: 'button',
            selector: 'cwn2-button-infowms'
        },
        {
            ref: 'featureListWin',
            selector: 'cwn2-infowms-featurelist-win'
        },
        {
            ref: 'featureListGrid',
            selector: 'cwn2-infowms-featurelist-grid'
        },
        {
            ref: 'baseInfoWin',
            selector: 'cwn2-infowms-baseinfo-win'
        },
        {
            ref: 'htmlWin',
            selector: 'cwn2-infowms-html-win'
        }
    ],

    init: function (application) {
        CWN2.Util.log('CWN2.controller.button.infowms: init');

        this.control({
            'cwn2-button-infowms': {
                toggle: this.onButtonPress,
                getfeatureinfo: this.onGetFeatureInfo
            },
            'cwn2-infowms-featurelist-win': {
                destroy: this.onWinDestroy
            },
            'cwn2-infowms-baseinfo-win': {
                destroy: this.onWinDestroy
            },
            'cwn2-infowms-html-win': {
                destroy: this.onWinDestroy
            },
            '#infoWmsMediaWin': {
                destroy: this.onWinDestroy
            },
            'cwn2-infowms-featurelist-grid': {
                select: this.onFeatureListGridSelect
            }

        });
    },

    onGetFeatureInfo: function (event) {
        this.showFeatureList(event);
    },

    onWinDestroy: function () {
        var wmsSldHiliter = this.getButton().wmsSldHiliter;
        if (wmsSldHiliter) {
            wmsSldHiliter.cleanHiliteLayer();
        }
    },

    onFeatureListGridSelect: function (RowModel, record) {
        this.showFeatureInfo(record);
        this.getFeatureListGrid().getSelectionModel().clearSelections();
    },

    onButtonPress: function () {
    },

    showHideWin: function (win, mapPanel) {
        if (!win.isVisible()) {
            win.show();
            win.alignTo(mapPanel.body, "tl-tl", [10, 10]);
        } else {
            win.hide();
        }
    },

    // Costruisce una finestra con una grid contenente le feature trovate raggruppate per livello
    // Richiamata dalla getFeatureInfo
    showFeatureList: function (event) {
        var me = this,
            button = this.getButton();

        var layers = event.object.findLayers(),                             // elenco dei layer
            layersLabelList = setLayersLabelList(layers),                   // lista delle label dei layer
            groupFeature = event.features,                                  // gruppi di feature
            featureList = setFeatureList(groupFeature, layersLabelList, layers);     // array delle feature

        // se nessuna feature esco
        if (featureList.length === 0) {
            return;
        }

        // se esiste la finestra la distruggo
        if (this.getFeatureListWin()) {
            this.getFeatureListWin().destroy();
        }

        Ext.create("CWN2.button.InfoWms.featureList.Window", {
            items: [
                Ext.create("CWN2.button.InfoWms.featureList.GridPanel", {
                    data: featureList
                })
            ]
        }).show().alignTo(CWN2.app.layout.mapPanel.body, "tl-tl", [10, 10]);

        // se solo una riga apro la finestra della info
        if (featureList.length === 1) {
            this.getFeatureListGrid().getSelectionModel().select(0);
            // commentato per problemi di evidenziazione
            if (button.options.hideFeatureList) {
                this.getFeatureListWin().close();
            }
            //this.getFeatureListWin().close();
        }

        // imposta una lista con le etichette dei layer
        function setLayersLabelList(layers) {
            var label,
                layersLabelList = {},
                len = layers.length;

            for (var i = 0; i < len; i++) {
                if (layers[i].legend && layers[i].legend.label) {
                    label = layers[i].legend.label;
                } else {
                    label = layers[i].name;
                }
                layersLabelList[layers[i].name] = label;
            }

            return layersLabelList;

        }

        // imposta l'array delle feature
        function setFeatureList(groupFeature, layersLabelList, layers) {

            var featureId = 0,
                featureList = [],
                features = null,
                feature = null,
                len2 = groupFeature.length,
                len3 = null;

            for (var j = 0; j < len2; j++) {
                features = groupFeature[j].features;
                len3 = features.length;
                for (var j2 = 0; j2 < len3; j2++) {
                    feature = updateFeatureAttr(featureId, features[j2], groupFeature[j], layersLabelList, layers);
                    featureList.push(feature);
                    featureId++;
                }
            }

            return featureList;

        }

        // aggiorna gli attributi della feature
        function updateFeatureAttr(featureId, feature, group, layersLabelList, layers) {

            var featureType = (feature.gml && feature.gml.featureType) ? feature.gml.featureType : feature.type,
                layerName = getFeatureLayer(featureType, layers),
                attributes = getAttributes(featureType, feature, layers),
                newFeature = {};


            newFeature.featureId = featureId;
            newFeature.layerLabel = layersLabelList[layerName];
            newFeature.layerName = layerName;
            newFeature.attributes = attributes;
            newFeature.feature = feature;
            newFeature.url = group.url;
            newFeature.label = setFeatureLabel(layerName, attributes);

            return newFeature;
        }


        // imposta attributi feature
        // se layer ha cache PostGIS fa uppercase delle chiavi
        function getAttributes(featureType, feature, layers) {
            var len = layers.length,
                cachePostGIS = false;

            for (var i = 0; i < len; i++) {
                if (layers[i].params.LAYERS.indexOf(featureType) !== -1) {
                    if (layers[i].config.cachePostGIS) {
                        cachePostGIS = true;
                    }
                }
            }

            if (cachePostGIS) {
                return upperAttributes(feature.attributes)
            } else {
                return feature.attributes;
            }
        }

        function upperAttributes(attributes) {
            var newAttributes = {}
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    newAttributes[key.toUpperCase()] = attributes[key];
                }
            }
            return newAttributes;
        }

        // imposta il nome del layer di riferimento della feature
        // in base al nome del layer WMS/WFS (feature.type) cerca nei layer OL passati (layers)
        // quello che ha l'attributo params.NAME contenente la stringa contenuta in feature.type
        function getFeatureLayer(featureType, layers) {
            var len = layers.length;
            for (var i = 0; i < len; i++) {
                if (!layers[i].params.LAYERS) {
                    return featureType;
                }
                if (layers[i].params.LAYERS.indexOf(featureType) !== -1) {
                    return layers[i].name;
                }
            }
        }

        // ritorna la label della feature
        // se impostato uso il campo infoLabelAttr altrimenti uso il campo infoIdAttr altrimenti uso il primo attributo
        function setFeatureLabel(layerName, attributes) {
            var infoLabelAttr,
                infoIdAttr;
            infoLabelAttr = getField(layerName, "infoLabelAttr");
            infoIdAttr = getField(layerName, "infoIdAttr");
            if (infoLabelAttr && attributes[infoLabelAttr]) {
                return attributes[infoLabelAttr];
            } else {
                if (infoIdAttr && attributes[infoIdAttr]) {
                    return attributes[infoIdAttr];
                } else {
                    return attributes[getFirstAttribute(attributes)];
                }
            }
        }

        // ritorna il campo del layer corrispondente al fildName se non trovato ritorna null
        function getField(layerName, fieldName) {
            try {
                var layerConfig = CWN2.app.map.layerManager.getLayerConfigByName(layerName);
                if (!layerConfig) {
                    throw {
                        name: "BadConfiguration",
                        message: "CWN2.button.InfoWms: layer non esistente",
                        level: 1
                    };
                }
                if (layerConfig.infoOptions && layerConfig.infoOptions[fieldName]) {
                    return layerConfig.infoOptions[fieldName];
                } else {
                    return null;
                }
            } catch (exception) {
                CWN2.Util.handleException(exception);
                return null;
            }
        }

        // ritorna il primo attributo dalla lista di attributi della feature
        function getFirstAttribute(attributes) {

            for (var i in attributes) {
                if (attributes.hasOwnProperty(i) && typeof(i) !== "function") {
                    return i;
                }
            }
            return null;
        }
    },

    showFeatureInfo: function (rec) {
        var data = rec.data,
            layerName = data.layerName,
            layerConfig = CWN2.app.map.layerManager.getLayerConfigByName(layerName),
            me = this,
            btnOptions = me.getButton().options,
            configOptions = layerConfig.infoOptions,
            exception = {};

        if (!layerConfig) {
            return;
        }

        checkLayerConfig();

        if (me.getButton().wmsSldHiliter) {
            hiliteFeature();
        }


        // gestione infoUrl: se impostato attributo infoUrl gestisco la info con la url altrimenti costruisco scheda base con pannello extjs
        (configOptions && configOptions.infoUrl) ? showInfoUrlWiew(configOptions, data) : showBaseInfoWin(configOptions, data);

        // controlli
        function checkLayerConfig() {
            if (layerConfig.infoOptions && !layerConfig.infoOptions.infoIdAttr) {
                CWN2.Util.log("CWN2.button.InfoWms - parametro di configurazione del layer non impostato: infoIdAttr ", 0);
            }
            if (!layerConfig.geomSubType) {
                CWN2.Util.log("CWN2.button.InfoWms - parametro di configurazione del layer non impostato: geomSubType ", 0);
            }
        }

        // costruisce un pannello extjs con la scheda della feature
        // (se esiste oggetto "configOptions.infoScheda.mapping" in configurazione)
        function showBaseInfoWin(configOptions, data) {

            var attributes = data.attributes,
                attrList = [],
                gridTitle = data.layerLabel,
                fieldMapping = configOptions ? configOptions.fieldMapping : null,
                infoLabelAttr,
                fieldValue;

            // costruisco l'array con gli attributi della feature
            for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    infoLabelAttr = fieldMapping ? fieldMapping[attr] : attr;
                    fieldValue = attributes[attr] || '';
                    attrList.push({"infoLabelAttr": infoLabelAttr, "fieldValue": fieldValue});
                }
            }

            // se esiste la finestra la distruggo
            if (me.getBaseInfoWin()) {
                me.getBaseInfoWin().destroy();
            }

            var win = Ext.create("CWN2.button.InfoWms.baseInfo.Window", {
                title: data.layerLabel,
                items: [
                    Ext.create("CWN2.button.InfoWms.baseInfo.GridPanel", {
                        data: attrList
                    })
                ]
            });

            win.show().alignTo(CWN2.app.layout.mapPanel.body, "tl-tl", [500, 10]);

            //Ext.WindowManager.register(win);
            //Ext.WindowManager.bringToFront(win);

        }

        // costruisce la scheda con una url remota
        function showInfoUrlWiew(configOptions, data) {
            // sostituisco variabile con valore - prerequisito: deve esistere un attributo con nome uguale alla variabile
            // es: se infoUrl e' http://pippo/pluto.asp?id=${gid} deve esistere attributo "gid" in attributes della feature
            var infoUrl = OpenLayers.String.format(configOptions.infoUrl, data.attributes);

            // gestione formattazione QPG
            if (CWN2.app.configuration.qpgRequest) {
                var tematismi = CWN2.app.configuration.qpgRequest.tematismi;
                Ext.each(tematismi, function (tematismo) {
                    if (data.layerName === tematismo.olLayer.name && tematismo.separatoreDecimale === ",") {
                        numeral.language('it');
                        var valore = parseFloat(data.attributes["VALORE"]);
                        if (!isNaN(valore)) {
                            data.attributes["VALORE"] =  numeral(valore).format('0000.00')
                        }
                    }
                });
            }

            if ((infoUrl.substr(infoUrl.length - 4) === ".xsl") || (infoUrl.substr(infoUrl.length - 5) === ".xslt")) {
                buildHtmlDoc(configOptions, data);
            } else {
                if (!configOptions.infoTarget || configOptions.infoTarget === "panel") {
                    showIframeWin(infoUrl, configOptions);
                } else {
                    showPopupUrl(infoUrl, configOptions);
                }
            }

// costruisce una scheda html nel caso di info xsl
            function buildHtmlDoc(configOptions, data) {
                var xslUrl = "/geoservices/REST/config/xsl_info_service?";
                // costruisco il gml in formato getFeatureInfo Mapserver
                var xmlDoc = buildGml(data);

                var jsonData = {
                    xslUrl: configOptions.infoUrl,
                    ambiente: CWN2.Globals.AMBIENTE,
                    idLayer: data.layerName.replace("L", ""),
                    featureAttributes: data.attributes
                }

                CWN2.Util.ajaxRequest({
                    type: "XML",
                    url: xslUrl,
                    jsonData: jsonData,
                    callBack: function (xslDoc) {
                        try {
                            // scrivo il titolo del layer
                            var td = Ext.DomQuery.select("td", xslDoc);
                            Ext.each(td, function (el) {
                                if (el.id === "Titolo") {
                                    el.textContent = data.layerLabel;
                                    return false;
                                }
                                // Gestione IE
                                Ext.each(el.attributes, function (attr) {
                                        if (attr.text === "Titolo") {
                                            el.text = data.layerLabel; // IE8/9
                                            return false;
                                        }
                                    }
                                );
                            })
                            // applico la trasformazione xslt
                            var result = xslTransform(xmlDoc, xslDoc);
                            // levo i caratteri di encoding %0A e %09 dai link
                            result = result.replace(new RegExp('%0A', 'g'), '').replace(new RegExp('%09', 'g'), '').replace(new RegExp('%20', 'g'), '');
                            // visualizzo il risultato
                            if (!configOptions.infoTarget || configOptions.infoTarget === "panel") {
                                showHtmlPanel(result, configOptions);
                            } else {
                                showHtmlPopup(result, configOptions);
                            }
                        } catch (exception) {
                            CWN2.Util.handleException(exception);
                        }
                    }
                });

                // costruisce un documento GML in formato getFeatureInfo Mapserver
                function buildGml(feature) {
                    try {
                        var baseXml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><msGMLOutput xmlns:gml=\"http://www.opengis.net/gml\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"></msGMLOutput>",
                            xmlDoc = CWN2.Util.parseXML(baseXml),
                            layerName = feature.layerName + "_layer",
                            layerNode = xmlDoc.createElement(layerName),
                            featureName = feature.layerName + "_feature",
                            featureNode = xmlDoc.createElement(featureName),
                            attributes = feature.attributes;

                        for (var key in attributes) {
                            if (attributes.hasOwnProperty(key)) {
                                var text = null;
                                if (attributes[key]) {
                                    text = xmlDoc.createTextNode(attributes[key]);
                                } else {
                                    text = xmlDoc.createTextNode("");
                                }
                                var attrNode = xmlDoc.createElement(key);
                                attrNode.appendChild(text);
                                featureNode.appendChild(attrNode);
                            }
                        }
                        layerNode.appendChild(featureNode);
                        xmlDoc.documentElement.appendChild(layerNode);
                        return xmlDoc;
                    } catch (exception) {
                        throw {
                            name: "gmlTransformation",
                            message: "CWN2.button.infoWms.buildGml: errore costruzione xmlDoc gml - " + exception.message,
                            level: 1
                        };
                    }
                }

                // trasformo xml in html applicando xslt
                function xslTransform(xmlDoc, xslDoc) {
                    try {
                        if (window.XSLTProcessor) {
                            var xsltProcessor = new XSLTProcessor();
                            xsltProcessor.importStylesheet(xslDoc);
                            var transformedDoc = xsltProcessor.transformToDocument(xmlDoc);
                            return (new XMLSerializer()).serializeToString(transformedDoc);
                        } else {
                            return xmlDoc.transformNode(xslDoc);
                        }
                    } catch (exception) {
                        throw {
                            name: "gmlTransformation",
                            message: "CWN2.button.infoWms.xslTransform: errore trasformazione xslt - " + exception.message,
                            level: 1
                        };
                    }
                }

                // apre una panel extjs con un documento html
                function showHtmlPanel(html, configOptions) {
                    var width = configOptions.infoWidth || 400,
                        height = configOptions.infoHeight || 500;

                    // se esiste la finestra la distruggo
                    if (me.getHtmlWin()) {
                        me.getHtmlWin().destroy();
                    }

                    var win = Ext.create('CWN2.button.InfoWms.html.Window', {
                        height: height,
                        width: width,
                        items: [
                            {
                                xtype: 'panel',
                                manageHeight: false,
                                border: false,
                                title: "",
                                html: html
                            }
                        ]
                    }).show().alignTo(CWN2.app.layout.mapPanel.body, "tl-tl", [20, 20]);
                }

                // apre una popup con un documento html
                function showHtmlPopup(htmlString, configOptions) {
                    var width = configOptions.infoWidth || 400,
                        height = configOptions.infoHeight || 500,
                        popup = window.open("", null, "status=yes, toolbar=yes, menubar=no, width=" + width + ", height=" + height + ", resizable=yes, scrollbars=yes");
                    popup.document.open();
                    popup.document.write(htmlString);
                    popup.document.close();
                    popup.focus();
                }
            }

// costruisce la scheda con una documento in un Iframe
            function showIframeWin(infoUrl, configOptions) {
                var win = new CWN2.IframeWindow({
                    url: infoUrl,
                    width: configOptions.infoWidth,
                    height: configOptions.infoHeight,
                    id: "infoWmsMediaWin"
                }).alignTo(CWN2.app.layout.mapPanel.body, "tl-tl", [10, 10]);
            }

// apre una popup con una url remota
            function showPopupUrl(url, configOptions) {
                var width = configOptions.infoWidth || 400,
                    height = configOptions.infoHeight || 500,
                    popup = window.open(url, configOptions.infoTarget, "status=yes, toolbar=yes, menubar=no, width=" + width + ", height=" + height + ", resizable=yes, scrollbars=yes");
                popup.focus();
            }

        }

        // evidenziazione feature
        function hiliteFeature() {
            if (!layerConfig.infoOptions) {
                return null;
            }
            var idField = layerConfig.infoOptions.infoIdAttr;
            if (layerConfig.cachePostGIS) {
                idField = idField.toLowerCase();
            }
            var values = [];
            if (data.feature && data.feature.attributes) {
                values.push(data.feature.attributes[idField]);
            }
            if (typeof values[0] === "undefined") {
                CWN2.Util.log("Parametro layerConfig.infoOptions.infoIdAttr non impostato", 0);
                return;
            }
            var bounds = null,
                zoomLevel = null;
            if (btnOptions && btnOptions.zoomToSelected) {
                bounds = data.feature.bounds;
            }
            if (btnOptions && btnOptions.zoomLevel) {
                zoomLevel = btnOptions.zoomLevel;
            }
            return me.getButton().wmsSldHiliter.hiliteFeature({
                layers: [layerConfig.name],
                fields: idField,
                values: values,
                bounds: bounds,
                zoomLevel: zoomLevel
            });
        }

    }

});


