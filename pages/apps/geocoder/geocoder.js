Ext.define('Geocoder.view.LoadDataBtn', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-loaddata",
    id: "geocoder-loaddata",
    iconCls: "loadData",
    width: 120,
    handler: function () {
        if (Ext.getCmp("load-data-win").isVisible()) {
            Ext.getCmp("load-data-win").hide()
        } else {
            Ext.getCmp("load-data-win").show();
        }
    },
    text: 'Caricamento Dati'
});

Ext.define('Geocoder.view.ShowLegendBtn', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-showlegend",
    id: "geocoder-showlegend",
    iconCls: "showLegend",
    width: 70,
    handler: function () {
        if (Ext.getCmp("legend-win").isVisible()) {
            Ext.getCmp("legend-win").hide()
        } else {
            Ext.getCmp("legend-win").show();
            Ext.getCmp("legend-win").alignTo(CWN2.app.layout.mapPanel.body, "tr-tr", [-10, 10]);
        }
    },
    text: 'Legenda'
});

Ext.define('Geocoder.view.DragFeature', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-dragfeature",
    id: "geocoder-dragfeature",
    iconCls: "dragFeature",
    width: 65,
    handler: function () {
        Ext.each(geocoderAppConfig.tematismi, function (tema) {
            var dragControls = CWN2.app.map.getControlsBy("id", "drag-feature-layer" + tema.codiceTematismo);
            if (dragControls && dragControls[0]) {
                dragControls[0].activate();
            }
        });
        var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
        if (controls && controls[0]) {
            controls[0].activate();
        }
        var insertControls = CWN2.app.map.getControlsBy("id", "cwn2-control-drawpoint");
        if (insertControls) {
            insertControls[0].deactivate();
        }
    },
    text: 'Sposta'
});


Ext.define('Geocoder.view.Validate', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-validate",
    id: "geocoder-validate",
    iconCls: "validate",
    width: 65,
    handler: function () {
        Ext.MessageBox.confirm(
            CWN2.I18n.get('Conferma'),
            CWN2.I18n.get('Desideri salvare le modifiche?'),
            function (btn) {
                //var id = Ext.getCmp("georif-grid").getSelectionModel().getSelection()[0].getData()[geocoderAppConfig.campi.campoID];
                var id = null;
                var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
                if (controls && controls[0]) {
                    Ext.each(controls[0].layers, function (layer) {
                        if (layer.selectedFeatures.length > 0) {
                            Ext.each(layer.selectedFeatures, function (feature) {
                                id = feature.attributes[geocoderAppConfig.campi.campoID];
                            });
                        }
                    });
                }
                var idCatalogo = geocoderAppConfig.data.id;
                var jsonData = {
                    "action": "VALIDATE",
                    "id": id,
                    "stato_validazione": 1
                }
                CWN2.Util.ajaxRequest({
                    type: "JSON",
                    url: "/geoservices/REST/geocoder/update/" + idCatalogo,
                    jsonData: jsonData,
                    callBack: function (response) {
                        callLoadDataSrv(true);
                    }
                });
            }
        );
    },
    text: 'Valida'
});


Ext.define('Geocoder.view.Unvalidate', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-unvalidate",
    id: "geocoder-unvalidate",
    iconCls: "unvalidate",
    width: 130,
    handler: function () {
        Ext.MessageBox.confirm(
            CWN2.I18n.get('Conferma'),
            CWN2.I18n.get('Desideri salvare le modifiche?'),
            function (btn) {
                if (btn === "yes") {
                    //var id = Ext.getCmp("georif-grid").getSelectionModel().getSelection()[0].getData()[geocoderAppConfig.campi.campoID];
                    var id = null;
                    var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
                    if (controls && controls[0]) {
                        Ext.each(controls[0].layers, function (layer) {
                            if (layer.selectedFeatures.length > 0) {
                                Ext.each(layer.selectedFeatures, function (feature) {
                                    id = feature.attributes[geocoderAppConfig.campi.campoID];
                                });
                            }
                        });
                    }
                    var idCatalogo = geocoderAppConfig.data.id;
                    var jsonData = {
                        "action": "VALIDATE",
                        "id": id,
                        "stato_validazione": 0
                    }
                    CWN2.Util.ajaxRequest({
                        type: "JSON",
                        url: "/geoservices/REST/geocoder/update/" + idCatalogo,
                        jsonData: jsonData,
                        callBack: function (response) {
                            callLoadDataSrv(true);
                        }
                    });
                }
            }
        );
    },
    text: 'Annulla Validazione'
});


Ext.define('Geocoder.view.Dereference', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-dereference",
    id: "geocoder-dereference",
    iconCls: "dereference",
    width: 160,
    handler: function () {
            Ext.MessageBox.confirm(
                CWN2.I18n.get('Conferma'),
                CWN2.I18n.get('Desideri salvare le modifiche?'),
                function (btn) {
                    if (btn === "yes") {
                        //var id = Ext.getCmp("georif-grid").getSelectionModel().getSelection()[0].getData()[geocoderAppConfig.campi.campoID];
                        var id = null;
                        var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
                        if (controls && controls[0]) {
                            Ext.each(controls[0].layers, function (layer) {
                                if (layer.selectedFeatures.length > 0) {
                                    Ext.each(layer.selectedFeatures, function (feature) {
                                        id = feature.attributes[geocoderAppConfig.campi.campoID];
                                    });
                                }
                            });
                        }
                        var idCatalogo = geocoderAppConfig.data.id;
                        var jsonData = {
                            "action": "SET_GEOMETRY",
                            "id": id,
                            "stato_validazione": 0,
                            "geom": {
                                "x": null,
                                "y": null
                            }
                        }
                        CWN2.Util.ajaxRequest({
                            type: "JSON",
                            url: "/geoservices/REST/geocoder/update/" + idCatalogo,
                            jsonData: jsonData,
                            callBack: function (response) {
                                callLoadDataSrv(true);
                            }
                        });
                    }
                }
            );
    },
    text: 'Annulla Georeferenziazione'
});


Ext.define('Geocoder.view.SelectFeature', {
    extend: 'Ext.button.Button',
    alias: "widget.cwn2-button-selectfeature",
    id: "geocoder-selectfeature",
    iconCls: "selectFeature",
    width: 75,
    handler: function () {
        Ext.each(geocoderAppConfig.tematismi, function (tema) {
            var dragControls = CWN2.app.map.getControlsBy("id", "drag-feature-layer" + tema.codiceTematismo);
            if (dragControls && dragControls[0]) {
                dragControls[0].deactivate();
            }
        });
        var insertControls = CWN2.app.map.getControlsBy("id", "cwn2-control-drawpoint");
        if (insertControls) {
            insertControls[0].deactivate();
        }
    },
    text: 'Seleziona'
});



// richiamo del servizio di caricamento dati
function callLoadDataSrv(noZoom) {
    var codiceCatalogo;
    if (geocoderAppConfig.tavole.length > 1) {
        codiceCatalogo = Ext.getCmp("geocoder-combo-tavole").value;
    } else {
        codiceCatalogo = geocoderAppConfig.tavole[0].codiceCatalogo;
    }

    var where = "1=1";

    Ext.each(geocoderAppConfig.filtri, function (filtro) {
        var value = Ext.getCmp("geocoder-filter-" + filtro.nomeCampo).value;
        if (value) {
            where += " AND " + filtro.nomeCampo + "='" + value + "'";
        }
    });

    CWN2.loadingScreen = Ext.getBody().mask('Caricamento in corso', 'loadingscreen');
    CWN2.Util.ajaxRequest({
        type: "JSON",
        url: "/geoservices/REST/geocoder/data/" + codiceCatalogo + "?APP=" + geocoderAppConfig.codice + "&WHERE=" + where,
        callBack: function (response) {
            response.data.noZoom = noZoom;
            loadData(response.data);
            Ext.getCmp("geocoder-selectfeature").enable();
            Ext.getCmp("geocoder-dragfeature").disable();
            Ext.getCmp("geocoder-validate").disable();
            Ext.getCmp("geocoder-unvalidate").disable();
            Ext.getCmp("geocoder-dereference").disable();
            Ext.each(geocoderAppConfig.tematismi, function (tema) {
                var dragControls = CWN2.app.map.getControlsBy("id", "drag-feature-layer" + tema.codiceTematismo);
                if (dragControls && dragControls[0]) {
                    dragControls[0].deactivate();
                }
            });
            var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
            if (controls && controls[0]) {
                controls[0].activate();
            }
        }
    });
}

// carica i dati su mappa e liste
function loadData(data) {
    geocoderAppConfig.data = data;
    loadLayers(data);
    loadGeorifPanel(data);
    loadNonGeorifPanel(data);

    // mostro legenda
    //Ext.getCmp("legend-win").show();
    //Ext.getCmp("legend-win").alignTo(CWN2.app.layout.mapPanel.body, "tr-tr", [-10, 10]);
};

// creo i layer e carico le features
function loadLayers(data) {
    var layers = [];
    Ext.each(geocoderAppConfig.tematismi, function (tema) {
        var styleMaps = [
            {
                "renderIntent": "default",
                "style": {
                    pointRadius: 6,
                    fillColor: tema.colore,
                    fillOpacity: 0.6,
                    hoverFillColor: tema.colore,
                    hoverFillOpacity: 0.8,
                    strokeColor: tema.colore,
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    strokeLinecap: "round",
                    strokeDashstyle: "solid",
                    hoverStrokeColor: tema.colore,
                    hoverStrokeOpacity: 1,
                    hoverStrokeWidth: 0.2,
                    hoverPointRadius: 1,
                    hoverPointUnit: "%",
                    pointerEvents: "visiblePainted",
                    cursor: "inherit"
                }
            },
            {
                "renderIntent": "select",
                "style": {
                    pointRadius: 8,
                    fillColor: tema.colore,
                    fillOpacity: 1,
                    hoverFillColor: tema.colore,
                    hoverFillOpacity: 0.8,
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    strokeLinecap: "round",
                    strokeDashstyle: "solid",
                    hoverStrokeColor: tema.colore,
                    hoverStrokeOpacity: 1,
                    hoverStrokeWidth: 0.2,
                    hoverPointRadius: 1,
                    hoverPointUnit: "%",
                    pointerEvents: "visiblePainted",
                    cursor: "inherit"
                }
            }
        ];

        // carico layer su mappa
        var nomeLayer = "editingLayer" + tema.codiceTematismo;
        var editingLayer = CWN2.app.map.layerManager.createVectorLayer({
            name: nomeLayer,
            format: "GeoJSON",
            notVisible: !(tema.visible),
            classes: {"filter": null, "styleMaps": styleMaps}
        });

        // carico feature su layer
        Ext.each(data.featureCollections, function (collection) {
            if (collection.codiceTematismo === tema.codiceTematismo) {
                var featureCollection = new OpenLayers.Format.GeoJSON({
                    "internalProjection": new OpenLayers.Projection(CWN2.app.map.projection),
                    "externalProjection": editingLayer.projection
                }).read(collection.featureCollection);
                editingLayer.destroyFeatures();
                editingLayer.addFeatures(featureCollection);
                editingLayer.redraw();
                if (!data.noZoom) {
                    editingLayer.map.zoomToFeatures(featureCollection, 15);
                }
                return false;
            }
        });

        // rendo visibile layer e imposto check-box
        CWN2.app.map.layerManager.setLayerVisible(nomeLayer, tema.visible);
        var check = Ext.get("legenda-checkbox-" + tema.codiceTematismo);
        if (check) {
            check.dom.checked = tema.visible;
        }

        // attivo controllo per drag
        var dragControls = CWN2.app.map.getControlsBy("id", "drag-feature-layer" + tema.codiceTematismo);
        if (dragControls && dragControls.length === 0) {
            if (!tema.noEditing) {
                var control = new OpenLayers.Control.DragFeature(editingLayer, {id: "drag-feature-layer" + tema.codiceTematismo});
                control.onComplete = function (feature, pixel) {
                    var id = feature.attributes[data.idColumn];
                    var point = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
                    OpenLayers.Projection.transform(
                        point,
                        new OpenLayers.Projection(CWN2.app.map.projection),
                        new OpenLayers.Projection("EPSG:4326")
                    );

                    Ext.MessageBox.confirm(
                        CWN2.I18n.get('Conferma'),
                        CWN2.I18n.get('Desideri salvare le modifiche?'),
                        function (btn) {
                            if (btn === "yes") {
                                //var id = Ext.getCmp("georif-grid").getSelectionModel().getSelection()[0].getData()[geocoderAppConfig.campi.campoID];
                                var id = null;
                                var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
                                if (controls && controls[0]) {
                                    Ext.each(controls[0].layers, function (layer) {
                                        if (layer.selectedFeatures.length > 0) {
                                            Ext.each(layer.selectedFeatures, function (feature) {
                                                id = feature.attributes[geocoderAppConfig.campi.campoID];
                                            });
                                        }
                                    });
                                }
                                var idCatalogo = geocoderAppConfig.data.id;
                                var jsonData = {
                                    "action": "SET_GEOMETRY",
                                    "id": id,
                                    "stato_validazione": 1,
                                    "geom": {
                                        "x": point.x,
                                        "y": point.y
                                    }
                                }
                                CWN2.Util.ajaxRequest({
                                    type: "JSON",
                                    url: "/geoservices/REST/geocoder/update/" + idCatalogo,
                                    jsonData: jsonData,
                                    callBack: function (response) {
                                        callLoadDataSrv(true);
                                    }
                                });
                            }
                        }
                    );
                }
                CWN2.app.map.addControl(control);
            }
            layers.push(editingLayer);
        }
    });

    var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
    if (controls && controls.length === 0) {
        var selectControl = new OpenLayers.Control.SelectFeature(
            layers,
            {
                id: "selectControlCustom"
            }
        );
        selectControl.onSelect = function (feature) {
            var grid = Ext.getCmp("georif-grid");
            var gridSelMod = grid.getSelectionModel();
            gridSelMod.deselectAll();
            var controls = CWN2.app.map.getControlsBy("id", "selectControlCustom");
            if (controls && controls[0]) {
                Ext.each(controls[0].layers, function (layer) {
                    if (layer.selectedFeatures.length > 0) {
                        Ext.each(layer.selectedFeatures, function (selFeature) {
                            gridSelMod.select(grid.getStore().getById(selFeature.attributes[data.idColumn]), true);
                        });
                    }
                });
            }
            //disattivo controlli drag feature e insert
            Ext.each(geocoderAppConfig.tematismi, function (tema) {
                var dragControls = CWN2.app.map.getControlsBy("id", "drag-feature-layer" + tema.codiceTematismo);
                if (dragControls && dragControls[0]) {
                    dragControls[0].deactivate();
                }
            });
            var insertControls = CWN2.app.map.getControlsBy("id", "cwn2-control-drawpoint");
            if (insertControls) {
                insertControls[0].deactivate();
            }
            // abilito validazione e annullamento

            if (feature.attributes[geocoderAppConfig.data.campoStatoValidazione] === "1") {
                Ext.getCmp("geocoder-unvalidate").enable();
                Ext.getCmp("geocoder-validate").disable();
                Ext.getCmp("geocoder-dereference").disable();
            } else {
                Ext.getCmp("geocoder-validate").enable();
                Ext.getCmp("geocoder-dragfeature").enable();
                Ext.getCmp("geocoder-unvalidate").disable();
                Ext.getCmp("geocoder-dereference").enable();
            }
        };

        selectControl.onUnselect = function (feature) {
            unSelect(feature);

        };

        CWN2.app.map.addControl(selectControl);
        selectControl.activate();
    }

    var selectControls = CWN2.app.map.getControlsBy("name", "selectFeatureControl");
    if (selectControls && selectControls[0]) {
        selectControls[0].onSelect = function (feature) {
            // abilito validazione e annullamento
            if (feature.attributes[geocoderAppConfig.data.campoStatoValidazione] === "1") {
                Ext.getCmp("geocoder-unvalidate").enable();
                Ext.getCmp("geocoder-validate").disable();
                Ext.getCmp("geocoder-dereference").disable();
            } else {
                Ext.getCmp("geocoder-validate").enable();
                Ext.getCmp("geocoder-dragfeature").enable();
                Ext.getCmp("geocoder-unvalidate").disable();
                Ext.getCmp("geocoder-dereference").enable();
            }
        };
        selectControls[0].onUnselect = function (feature) {
            //selectControls[0].unSelect(feature);
            unSelect(feature);

        };
    }

    var insertControls = CWN2.app.map.getControlsBy("id", "cwn2-control-drawpoint");
    if (insertControls && insertControls[0]) {
        insertControls[0].events.register('featureadded', this, function (evt) {
            saveInsertPoint(data, evt.feature.geometry);
        });
    }

}

function unSelect(feature) {
//    Ext.getCmp("georif-grid").getSelectionModel().deselectAll();
    Ext.getCmp("georif-grid").getView().clearHighlight();
    Ext.getCmp("geocoder-validate").disable();
    Ext.getCmp("geocoder-unvalidate").disable();
    Ext.getCmp("geocoder-dereference").disable();
}

function saveInsertPoint(data, geometry) {
    Ext.MessageBox.confirm(
        CWN2.I18n.get('Conferma'),
        CWN2.I18n.get('Desideri salvare le modifiche?'),
        function (btn) {
            if (btn === "yes") {
                var id = Ext.getCmp("nogeorif-grid").getSelectionModel().getSelection()[0].getData()[data.idColumn];
                var point = new OpenLayers.Geometry.Point(geometry.x, geometry.y);
                OpenLayers.Projection.transform(
                    point,
                    new OpenLayers.Projection(CWN2.app.map.projection),
                    new OpenLayers.Projection("EPSG:4326")
                );
                var idCatalogo = geocoderAppConfig.data.id;
                var jsonData = {
                    "action": "SET_GEOMETRY",
                    "id": id,
                    "stato_validazione": 1,
                    "geom": {
                        "x": point.x,
                        "y": point.y
                    }
                }
                CWN2.Util.ajaxRequest({
                    type: "JSON",
                    url: "/geoservices/REST/geocoder/update/" + idCatalogo,
                    jsonData: jsonData,
                    callBack: function (response) {
                        callLoadDataSrv(true);
                    }
                });
            }
        }
    );
}

// carico pannello lista georiferiti
function loadGeorifPanel(data) {
    var columns = [];
    var gridWidth = 0;
    Ext.each(geocoderAppConfig.gridCols, function (col) {
        Ext.each(data.columns, function (column) {
            if (col.nomeCampo === column) {
                var gridCol = {
                    text: col.label,
                    width: col.width,
                    dataIndex: col.nomeCampo,
                    sortable: true
                };
                if (col.editabile) {
                    gridCol.editor = "textfield";
                }
                columns.push(gridCol);
                gridWidth += col.width;
                return false;
            }
        });
    });
    columns.push(
        {
            dataIndex: "COLORE",
            renderer: function (value, metaData, record) {
                return '<div class="x-grid3-cell-inner" style="background-color:' + value + ';"><span style="color:green;">&nbsp; </span></div>';
            },
            width: 30
        }
        ,{
            xtype:'actioncolumn',
            width:20,
            items: [{
                icon: 'http://geoportale.regione.liguria.it/geoviewer/stili/default/icons/marker_blue.png',  // Use a URL in the icon config
                tooltip: 'Geocode',
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    geocode(record);
                }
            }]
        }
    );
    gridWidth += 100;

    var georifPanel = Ext.getCmp("cwn2-geocoder-georif-panel");
    georifPanel.setWidth(gridWidth);

    var oldGrid = Ext.getCmp("georif-grid");
    if (oldGrid) {
        georifPanel.remove(oldGrid);
    }

    var fields = data.columns;
    fields.push("TEMATISMO");
    fields.push("COLORE");

    Ext.define('georiferiti', {
        extend: 'Ext.data.Model',
        fields: fields,
        idProperty: data.idColumn
    });

    var properties = [];
    Ext.each(data.featureCollections, function (collection) {
        Ext.each(collection.featureCollection.features, function (feature) {
            var record = feature.properties;
            record.TEMATISMO = collection.codiceTematismo;
            record.COLORE = collection.colore;
            properties.push(record)
        });
    });

    var georefStore = Ext.create('Ext.data.Store', {
        model: 'georiferiti',
        data: properties
    });

    georifPanel.add(Ext.create('Ext.ux.LiveSearchGridPanel', {
        store: georefStore,
        id: "georif-grid",
        selModel: { allowDeselect: true   },
        columnLines: true,
        frame: true,
        autoScroll: true,
        width: gridWidth,
        height: 250,
        columns: columns,
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2
            })
        ],
        listeners: {
            "select": function (sm, record, index, eOpts) {
                var tema = record.data["TEMATISMO"];
                var layer = CWN2.app.map.getLayerByName("editingLayer" + tema);

                CWN2.FeatureSelecter.selectFeature(
                    {
                        "layer": layer,
                        "attrName": data.idColumn,
                        "item": record.data[data.idColumn],
                        "options": {
                            "zoom": true,
                            "maxZoomLevel": 19,
                            "hiliteOnly": false
                        }
                    });

                // abilito / disabilito bottoni
                if (layer.selectedFeatures[0].attributes[geocoderAppConfig.data.campoStatoValidazione] === "1") {
                    Ext.getCmp("geocoder-unvalidate").enable();
                    Ext.getCmp("geocoder-validate").disable();
                    Ext.getCmp("geocoder-dereference").disable();
                } else {
                    Ext.getCmp("geocoder-validate").enable();
                    Ext.getCmp("geocoder-dragfeature").enable();
                    Ext.getCmp("geocoder-unvalidate").disable();
                    Ext.getCmp("geocoder-dereference").enable();
                }
                Ext.getCmp("geocoder-selectfeature").enable();
                // deseleziono altra griglia
                Ext.getCmp("nogeorif-grid").getSelectionModel().deselectAll();
            },
            "edit": function (editor, e) {
                //richiesta conferma + salvataggio + refresh
                var idCat = data.id,
                    idColumn = data.idColumn,
                    idValue = e.record.data[idColumn],
                    modColumn = Object.keys(e.record.modified)[0],
                    oldValue = e.record.modified[modColumn],
                    modValue = e.record.data[modColumn];
                if (oldValue === modValue) {
                    return false;
                }
                Ext.MessageBox.confirm(
                    CWN2.I18n.get('Conferma'),
                    CWN2.I18n.get('Desideri salvare le modifiche?'),
                    function (btn) {
                        if (btn === "yes") {
                            var jsonData = {
                                "action": "SET_FIELD",
                                "id": idValue,
                                "col": modColumn,
                                "value": modValue
                            }
                            var idCatalogo = data.id;
                            CWN2.Util.ajaxRequest({
                                type: "JSON",
                                url: "/geoservices/REST/geocoder/update/" + idCatalogo,
                                jsonData: jsonData,
                                callBack: function (response) {
                                    //TODO
                                }
                            });
                        } else {
                            e.record.reject();
                        }
                    }
                );
            }
        }
    }));

    filterGridStore();
}

// carico pannello lista non georiferiti
function loadNonGeorifPanel(data) {
    var columns = [];
    var gridWidth = 0;
    Ext.each(geocoderAppConfig.gridCols, function (col) {
        Ext.each(data.columns, function (column) {
            if (col.nomeCampo === column) {
                var gridCol = {
                    text: col.label,
                    width: col.width,
                    dataIndex: col.nomeCampo,
                    sortable: true
                };
                if (col.editabile) {
                    gridCol.editor = "textfield";
                }
                columns.push(gridCol);
                gridWidth += col.width;
                return false;
            }
        });
    });
    columns.push({
        dataIndex: "COLORE",
        renderer: function (value, metaData, record) {
            return '<div class="x-grid3-cell-inner" style="background-color:' + value + ';"><span style="color:green;">&nbsp; </span></div>';
        },
        width: 30
    });
    gridWidth += 100;

    var georifPanel = Ext.getCmp("cwn2-geocoder-nogeorif-panel");
    var oldGrid = Ext.getCmp("nogeorif-grid");
    if (oldGrid) {
        georifPanel.remove(oldGrid);
    }

    georifPanel.add(Ext.create('Ext.ux.LiveSearchGridPanel', {
        store: Ext.create('Ext.data.Store', {
            model: 'georiferiti',
            data: data.notGeoref
        }),
        id: "nogeorif-grid",
        columnLines: true,
        selModel: { allowDeselect: true   },
        frame: true,
        width: gridWidth,
        height: 250,
        columns: columns,
        plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2
            })
        ],
        listeners: {
            "select": function (sm, record, index, eOpts) {
                Ext.getCmp("georif-grid").getSelectionModel().deselectAll();
                geocode(record);
            }
        }
    }));

}

function geocode(record) {

    var data = geocoderAppConfig.data,
        campoIndirizzo = data.campoIndirizzo,
        campoCivico = data.campoCivico,
        campoCap = data.campoCap,
        campoComune = data.campoComune;
    /*
     //var hereSrvURL = "http://geocoder.cit.api.here.com/6.2/geocode.json?state=Liguria&country=ITA&gen=8";
     var hereSrvURL = "http://geoportale.regione.liguria.it/geoservices/REST/proxy/here_geocode?";
     //hereSrvURL += "app_id=inwresuveWra5ebewaSweh&app_code=zBWCuMTr-PrXwr6pc5uqLg"; // uso credenziali del ruolo GEOCODE_DEMO (vedi tavola GEOCODER_APP)
     hereSrvURL += "app_id=uHFYCdocrLoinMf8j6RK&app_code=XKQe3be7-30iGWPuh3dbtQ"; // uso credenziali del ruolo GEOCODE_REG (vedi tavola GEOCODER_APP)
     hereSrvURL += "&street=" + record.data[campoIndirizzo];
     hereSrvURL += "&city=" + record.data[campoComune];
     if (campoCap && record.data[campoCap]) {
     hereSrvURL += "&postalcode=" + record.data[campoCap]
     }
     if (campoCivico && record.data[campoCivico]) {
     hereSrvURL += "&housenumber=" + record.data[campoCivico];
     }
     */

    var googleSrvURL = CWN2.Globals.GOOGLE_GEOCODE_PROXY;
    googleSrvURL += "&address=" + record.data[campoIndirizzo] + "," + record.data[campoComune] + " "
    if (campoCap && record.data[campoCap]) {
        googleSrvURL += "," + record.data[campoCap]
    }
    if (campoCivico && record.data[campoCivico]) {
        googleSrvURL += "," + record.data[campoCivico];
    }
    CWN2.Util.ajaxRequest({
        type: "JSON",
        //url: hereSrvURL,
        url: googleSrvURL,
        callBack: function (response) {
            var results = [];
            /*
             // Servizi HERE
             if (response.Response.View[0]) {
             Ext.each(response.Response.View[0].Result, function (result) {
             results.push({
             label: result.Location.Address.Label,
             x: result.Location.DisplayPosition.Longitude,
             y: result.Location.DisplayPosition.Latitude,
             rilevanza: result.Relevance
             })
             });
             }
             */
            // Servizi Google
            if (response.results) {
                Ext.each(response.results, function (result) {
                    results.push({
                        label: result.formatted_address,
                        x: result.geometry.location.lng,
                        y: result.geometry.location.lat,
                        rilevanza: result.types[0],
                        trovato: result.formatted_address
                    })
                });
            }

            var address = {
                indirizzo: record.data[campoIndirizzo],
                civico: record.data[campoCivico],
                cap: record.data[campoCap],
                comune: record.data[campoComune]
            }
            showResultsWin(results, address);
        }
    });

    Ext.getCmp("drawPoint").enable();
    Ext.getCmp("geocoder-selectfeature").disable();
    Ext.getCmp("geocoder-dragfeature").disable();
    Ext.getCmp("geocoder-validate").disable();
    Ext.getCmp("geocoder-unvalidate").disable();
    Ext.getCmp("geocoder-dereference").disable();
    Ext.getCmp("georif-grid").getSelectionModel().deselectAll();
    var control = CWN2.app.map.getControlsBy("id", "selectControlCustom")[0];
    control.unselectAll();
    var selectControl = CWN2.app.map.getControlsBy("name", "selectFeatureControl")[0];
    selectControl.unselectAll();

}

function showResultsWin(results, address) {
    // finestra con lista risultati e zoom sul primo
    Ext.define('results', {
        extend: 'Ext.data.Model',
        fields: ["label", "x", "y", "rilevanza", "trovato"]
    });

    var panel;
    if (results.length === 0 || results[0].rilevanza === "locality") {

        var rilevanza = (results[0]) ? results[0].rilevanza : null;
        var trovato = (results[0]) ? results[0].trovato : null;

        panel = new Ext.form.Panel({
            id: "results-form",
            viewConfig: {
                forceFit: true
            },
            width: 450,
            title: "",
            layout: 'anchor',
            defaultType: 'textfield',
            bodyStyle: {"background-color": "#d8d8d8"},
            margin: '10 10 10 10',
            items: [
                {
                    fieldLabel: 'Rilevanza',
                    name: 'rilevanza',
                    readOnly: true,
                    value: rilevanza,
                    allowBlank: false
                },
                {
                    fieldLabel: 'Indirizzo Trovato',
                    name: 'trovato',
                    width: 400,
                    readOnly: true,
                    value: trovato,
                    allowBlank: false
                },
                {
                    xtype: 'menuseparator',
                    style: 'border: 1px solid #CCCCCC;height:1px;',
                    margin: '10 0 10 0',
                    width: '100%'
                },
                {
                    fieldLabel: 'Indirizzo Cercato',
                    name: 'indirizzo',
                    width: 400,
                    value: address.indirizzo,
                    allowBlank: false
                },
                {
                    fieldLabel: 'Civico',
                    name: 'civico',
                    value: address.civico,
                    allowBlank: true
                },
                {
                    fieldLabel: 'CAP',
                    name: 'cap',
                    value: address.cap,
                    allowBlank: true
                },
                {
                    fieldLabel: 'Comune',
                    name: 'comune',
                    value: address.comune,
                    allowBlank: true
                }
            ],
            buttons: [{
                text: 'Ricerca',
                handler: function () {
                    var fields = Ext.getCmp("results-form").getForm().getValues();

/*
                    var hereSrvURL = "http://geoportale.regione.liguria.it/geoservices/REST/proxy/here_geocode?";
                    hereSrvURL += "app_id=uHFYCdocrLoinMf8j6RK&app_code=XKQe3be7-30iGWPuh3dbtQ"; // uso credenziali del ruolo GEOCODE_REG (vedi tavola GEOCODER_APP)
                    hereSrvURL += "&street=" + fields.indirizzo;
                    hereSrvURL += "&city=" + fields.comune;
                    if (fields.cap) {
                        hereSrvURL += "&postalcode=" + fields.cap
                    }
                    if (fields.civico) {
                        hereSrvURL += "&housenumber=" + fields.civico;
                    }
*/

                    var googleSrvURL = CWN2.Globals.GOOGLE_GEOCODE_PROXY;
                    googleSrvURL += "&address=" + fields.indirizzo + "," + fields.comune + " "
                    if (fields.cap) {
                        googleSrvURL += "," + fields.cap
                    }
                    if (fields.civico) {
                        googleSrvURL += "," + fields.civico;
                    }
                    CWN2.Util.ajaxRequest({
                        type: "JSON",
                        //url: hereSrvURL,
                        url: googleSrvURL,
                        callBack: function (response) {
                            var results = [];

                            /*
                             // Servizi HERE
                             if (response.Response.View[0]) {
                             Ext.each(response.Response.View[0].Result, function (result) {
                             results.push({
                             label: result.Location.Address.Label,
                             x: result.Location.DisplayPosition.Longitude,
                             y: result.Location.DisplayPosition.Latitude,
                             rilevanza: result.Relevance
                             })
                             });
                             showResultsWin(results, null);
                             } else {
                             alert("Indirizzo non trovato")
                             }*/

                            // Servizi Google
                            Ext.each(response.results, function (result) {
                                results.push({
                                    label: result.formatted_address,
                                    x: result.geometry.location.lng,
                                    y: result.geometry.location.lat,
                                    rilevanza: result.types[0]
                                })
                            });
                            if (results.length === 0 || results[0].rilevanza === "locality") {
                                alert("Indirizzo non trovato")
                            } else {
                                showResultsWin(results, null);
                            }
                        }
                    })
                }
            }]
        });
    } else {
        Ext.getCmp("drawPoint").enable();
        panel = new Ext.grid.Panel({
            id: "results-grid",
            store: new Ext.data.Store({
                storeId: "result-store",
                model: "results",
                data: results
            }),
            viewConfig: {
                forceFit: true
            },
            width: 450,
            title: "",
            hideHeaders: true,
            columns: [
                {
                    dataIndex: "label",
                    width: 300
                },
                {
                    dataIndex: "rilevanza",
                    width: 150
                }
            ],
            autoScroll: true,
            listeners: {
                "select": function (sm, record, index, eOpts) {
                    CWN2.FeatureLoader.loadMarker(
                        {
                            x: record.data.x,
                            y: record.data.y,
                            map: CWN2.app.map,
                            epsgCode: "EPSG:4326",
                            label: '',
                            zoomLevel: 17
                        }
                    );
                }
            },
            frame: false
        });
    }

    var win = Ext.getCmp("results-win");
    if (!win) {
        win = new Ext.Window({
            title: "Risultato Geocoding",
            id: "results-win",
            height: 270,
            width: 470,
            layout: "fit",
            bodyStyle: {"background-color": "#d8d8d8"},
            frame: true,
            resizable: true,
            closeAction: "hide",
            items: [panel],
            buttons: [],
            listeners: {
                close: function () {
                    Ext.getCmp("nogeorif-grid").getSelectionModel().deselectAll();
                    Ext.getCmp("drawPoint").disable();
                    var layer = CWN2.app.map.getLayerByName("findLayer");
                    layer.destroyFeatures();
                    Ext.getCmp("geocoder-selectfeature").enable();
                }
            }
        });
    } else {
        win.removeAll();
        win.add(panel);
    }
    win.show();
    win.alignTo(CWN2.app.layout.mapPanel.body, "tl-tl", [10, 10]);

    if (panel.getSelectionModel) {
        panel.getSelectionModel().select(0);
    }
}

// crea la finestra per il caricamento dei dati
function createLoadDataWin() {

    var panel = createLoadDataPanel();

    var win = new Ext.Window({
        title: "Caricamento Dati",
        id: "load-data-win",
        height: 300,
        width: 400,
        layout: "fit",
        bodyStyle: {"background-color": "#d8d8d8"},
        frame: true,
        resizable: true,
        closeAction: "hide",
        items: [panel],
        buttons: [
            {
                text: "Carica...",
                handler: function () {
                    var checkForm = true;
                    Ext.each(geocoderAppConfig.filtri, function (filtro) {
                        var filter = Ext.getCmp("geocoder-filter-" + filtro.nomeCampo).value;
                        if (filtro.obbligatorio && !filter) {
                            Ext.MessageBox.alert('Attenzione', 'Campo "' + filtro.nomeFiltro + '" obbligatorio');
                            checkForm = false;
                            return false;
                        }
                    });
                    if (checkForm) {
                        callLoadDataSrv();
                        win.hide();
                    }
                }
            }
        ],
    });
    win.show();
    win.alignTo(CWN2.app.layout.mapPanel.body, "tl-tl", [10, 10]);
}

// crea il pannello per il caricamento dei dati
function createLoadDataPanel() {
    var panel = new Ext.Panel({
        header: false,
        border: false,
        padding: '10 5 3 10',
        bodyStyle: {"background-color": "#d8d8d8"},
        items: []
    })

    // aggiungo eventuale combo delle tavole
    if (geocoderAppConfig.tavole.length > 1) {
        var tabStore = [];
        Ext.each(geocoderAppConfig.tavole, function (tavola) {
            tabStore.push([tavola.codiceCatalogo, tavola.valoreComboScelta]);
        });
        panel.add([
            {
                xtype: 'combo',
                id: 'geocoder-combo-tavole',
                labelWidth: 80,
                width: 350,
                fieldLabel: geocoderAppConfig.nomeComboSceltaTavola,
                store: tabStore,
                value: geocoderAppConfig.tavole[0].codiceCatalogo
            }
        ]);
    }

    // aggiungo combo dei filtri
    if (geocoderAppConfig.tavole.length > 0) {
        var filterStore = [];
        Ext.each(geocoderAppConfig.filtri, function (filtro) {
            if (filtro.listaValori) {
                var filterStore = [];
                filterStore.push(['&nbsp;', '&nbsp;']);
                Ext.each(filtro.valori, function (valore) {
                    filterStore.push([valore, valore]);
                });
                panel.add([
                    {
                        xtype: 'combo',
                        id: 'geocoder-filter-' + filtro.nomeCampo,
                        labelWidth: 80,
                        width: 350,
                        value: filtro.defaultValue,
                        fieldLabel: filtro.nomeFiltro,
                        store: filterStore,
                        listeners: {
                            select: function (comp, record, index) {
                                // impedisco che venga visualizzato &nbsp;
                                if (comp.getValue() == "" || comp.getValue() == "&nbsp;")
                                    comp.setValue(null);
                            }
                        }
                    }
                ]);
            } else {
                panel.add([
                    {
                        xtype: 'textfield',
                        id: 'geocoder-filter-' + filtro.nomeCampo,
                        labelWidth: 80,
                        width: 350,
                        value: filtro.defaultValue,
                        fieldLabel: filtro.nomeFiltro
                    }
                ]);
            }
        });

    }

    return panel;
}

function filterGridStore() {

    // applico filtro allo store
    var store = Ext.getCmp("georif-grid").getStore();
    store.clearFilter(true);
    var temiNonAttivi = [];
    Ext.each(geocoderAppConfig.tematismi, function (tema) {
        // aggiorno grid
        var checkBox = Ext.get("legenda-checkbox-" + tema.codiceTematismo);
        if (checkBox) {
            var check = checkBox.dom.checked;
            if (!check) {
                temiNonAttivi.push(tema.codiceTematismo);
                tema.visible = false;
            }
        }
    });
    store.filterBy(function (record, id) {
            var nonAttivo = false;
            Ext.each(temiNonAttivi, function (tema) {
                if (record.data.TEMATISMO === tema) {
                    nonAttivo = true;
                    return false;
                }
            });
            if (nonAttivo) {
                return false;
            } else {
                return true;
            }
        }
    );

}

// crea la finestra per la legenda
function createLegendWin() {
    Ext.define('tematismi', {
        extend: 'Ext.data.Model',
        fields: ["codiceTematismo", "nomeTematismo", "espressione", "colore"],
        idProperty: "codiceTematismo"
    });

    var store = new Ext.data.Store({
        storeId: "tematismi-store",
        model: "tematismi",
        data: geocoderAppConfig.tematismi
    });

    geocoderImpostaTematismo = function (tema, visible) {
        // rendo visibile/nascosto il livello
        CWN2.app.map.layerManager.setLayerVisible("editingLayer" + tema, visible);
        // levo eventuale selezione al livello
        var layer = CWN2.app.map.getLayerByName("editingLayer" + tema);
        var control = CWN2.app.map.getControlsBy("id", "selectControlCustom")[0];
        Ext.each(layer.selectedFeatures, function (feature) {
            control.unselect(feature);
        });
        Ext.each(geocoderAppConfig.tematismi, function (tematismo) {
            if (parseInt(tema) === tematismo.codiceTematismo) {
                tematismo.visible = visible;
            }
        });
        filterGridStore();
    };


    var panel = new Ext.grid.Panel({
        store: store,
        viewConfig: {
            forceFit: true
        },
        width: 250,
        title: "",
        hideHeaders: true,
        disableSelection: true,
        columns: [
            {
                dataIndex: "colore",
                renderer: function (value, metaData, record) {
                    return '<div class="x-grid3-cell-inner" style="background-color:' + value + ';"><span style="color:green;">&nbsp; </span></div>';
                },
                width: 30
            },
            {
                dataIndex: "codiceTematismo",
                renderer: function (value, metaData, record) {
                    var onClick = "geocoderImpostaTematismo('" + value + "',this.checked);";
                    return "<input type='checkbox' id='legenda-checkbox-" + value + "' onClick=" + onClick + " CHECKED>";
                },
                width: 25
            },
            {
                dataIndex: "",
                renderer: function (value, metaData, record) {
                    return "<div style='white-space:normal; text-align:left'>" + record.data.nomeTematismo + " </div>";
                },
                width: 200
            }
        ],
        autoScroll: true,
        frame: false
    });


    var win = new Ext.Window({
        title: "Legenda",
        id: "legend-win",
        height: 250,
        width: 270,
        layout: "fit",
        bodyStyle: {"background-color": "#d8d8d8"},
        frame: true,
        resizable: true,
        closeAction: "hide",
        items: [panel],
        buttons: [],
    });


};

// imposto il pannello per le liste
function setToolsPanel() {
    var toolsPanel = CWN2.app.layout.layout.getComponent("cwn2-layout-toolspanel");
    toolsPanel.setBodyStyle({"background-color": "#d8d8d8"});
    var geocoderDataPanel = new Ext.tab.Panel({
        id: 'cwn2-geocoder-data-panel',
        items: [
            {
                xtype: 'panel',
                id: "cwn2-geocoder-georif-panel",
                bodyStyle: {"background-color": "#d8d8d8"},
                title: "Georiferiti"
            },
            {
                xtype: 'panel',
                id: "cwn2-geocoder-nogeorif-panel",
                bodyStyle: {"background-color": "#d8d8d8"},
                title: "Non Georiferiti"
            }

        ]
    });
    toolsPanel.add(geocoderDataPanel);
};

// carica la configurazione della applicazione
function loadConfig() {
    // imposto pannello per liste
    setToolsPanel();
    // chiamo servizio di configurazione
    var id = CWN2.Util.getUrlParam('id');
    if (id) {
        CWN2.Util.ajaxRequest({
            type: "JSON",
            url: "/geoservices/REST/geocoder/config/" + id,
            callBack: function (response) {
                geocoderAppConfig = response.data;

                var ruoli = CWN2.Globals.RUOLO.split(',');
                var ruoli_ammessi = response.data.ruolo.split(',');
                var trovato = false;
                Ext.each(ruoli_ammessi, function (ruolo_ammesso) {
                    Ext.each(ruoli, function (ruolo) {
                        if (ruolo_ammesso === ruolo) {
                            trovato = true;
                            return false;
                        }
                    });
                    if (trovato) {
                        return false;
                    }
                });

                if (trovato) {
                    createLoadDataWin();
                    createLegendWin();
                    Ext.getCmp("drawPoint").disable();
                    Ext.getCmp("geocoder-selectfeature").disable();
                    Ext.getCmp("geocoder-dragfeature").disable();
                    Ext.getCmp("geocoder-validate").disable();
                    Ext.getCmp("geocoder-unvalidate").disable();
                    Ext.getCmp("geocoder-dereference").disable();
                } else {
                    alert("Ruolo non abilitato per applicazione GeoCoder")
                }

            }
        });
    } else {

    }
};




Ext.application({
    name: 'Geocoder',

    launch: function () {


        var config = {
            "application": {
                "mapOptions": {
                    "restrictedExtent": "830036.283895,5402959.60361,1123018.973727,5597635.329038",
                    "olControls": [{name: "PanZoom"}]
                },
                "layout": {
                    "header": null,
                    "statusBar": false,
                    "toolsPanel": {
                        position: "south",
                        collapsible: false,
                        collapsed: false,
                        height: 300
                    },
                    "widgets": [
                        {"name": "ScaleCombo"},
                        {"name": "CoordinateReadOut"}
                    ],
                    "toolbar": {
                        "itemGroups": [
                            {
                                items: [
                                    {name: "loaddata"}
                                ]
                            },
                            {
                                items: [
                                    {name: "dragfeature"}
                                ]
                            },
                            {
                                items: [
                                    {name: "selectfeature"}
                                ]
                            },
                            {
                                items: [
                                    {name: "validate"}
                                ]
                            },
                            {
                                items: [
                                    {name: "unvalidate"}
                                ]
                            },
                            {
                                items: [
                                    {
                                        name: "drawpoint",
                                        "options": {
                                            text: "Inserisci",
                                            width: 70,
                                            singleFeature: true,
                                            styleMap: [
                                                {
                                                    "renderIntent": "default",
                                                    "style": {
                                                        pointRadius: 8,
                                                        fillColor: "#FF9900",
                                                        fillOpacity: 0.6,
                                                        hoverFillColor: "#FF9900",
                                                        hoverFillOpacity: 0.8,
                                                        strokeColor: "#FFFF00",
                                                        strokeOpacity: 1,
                                                        strokeWidth: 1,
                                                        strokeLinecap: "round",
                                                        strokeDashstyle: "solid",
                                                        hoverStrokeColor: "#FFFF00",
                                                        hoverStrokeOpacity: 1,
                                                        hoverStrokeWidth: 0.2,
                                                        hoverPointRadius: 1,
                                                        hoverPointUnit: "%",
                                                        pointerEvents: "visiblePainted",
                                                        cursor: "inherit"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            {
                                items: [
                                    {name: "dereference"}
                                ]
                            },
/*                            {
                                "items": [
                                    { "name": "measureline" },
                                    { "name": "measurearea" }
                                ]
                            },*/
                            {
                                "align": "right",
                                items: [
                                    {
                                        "type": "combo",
                                        "name": "geocoder",
                                        "options": {
                                            hilite: true,
                                            width: 300,
                                            callback: function (feature) {
                                            }
                                        }
                                    }
                                ]
                            },
                            {

                                "items": [
                                    {"type": "combo", "name": "base-layers"}
                                ]
                            },
                            {
                                items: [
                                    {name: "showlegend"}
                                ]
                            }
                        ]
                    }
                }
            },
            "baseLayers": [
                {"type": "no_base"},
                {"type": "rl_ortofoto_2013"},
                {"type": "rl_carte_base"},
                {"type": "OSM"},
                {"type": "google_terrain"},
                {"type": "google_roadmap", "visible": true},
                {"type": "google_satellite"}
            ],
            "layers": []
        };


        CWN2.app.load({
            appConfig: config,
            callBack: loadConfig,
            debug: true
        });


    }
});