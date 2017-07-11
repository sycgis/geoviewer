Ext.define('CWN2.button.Print', {
    extend: 'Ext.button.Button',
    alias: 'widget.cwn2-button-print',

    constructor: function(config) {
        var btnOptions = config.options;

        this.superclass.constructor.call(this, {
            id: "print",
            tooltip: CWN2.I18n.get("Stampa"),
            iconCls: (btnOptions && btnOptions.iconCls) ? btnOptions.iconCls : "print",
            text: (btnOptions && btnOptions.text) ? btnOptions.text : "",
            width: (btnOptions && btnOptions.width) ? btnOptions.width : 26,
            pressed: false
        });
    }
});

Ext.define('CWN2.button.Print.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.cwn2-print-win',
    closeAction: 'hide',
    title: CWN2.I18n.get("Stampa"),
    height: 400,
    width: 400,
    layout: "fit",
    resizable: false,

    constructor: function(config) {

        this.items = [
            {
                xtype: 'panel',
                height: "auto",
                width: "auto",
                frame: true,
                items: [
                    {
                        xtype: 'fieldset',
                        title: ' ',
                        width: 350,
                        border: false,
                        labelWidth: 20,
                        flex: 1,
                        //layout: 'hbox',
                        items: [
                            {
                                xtype: 'cwn2-btn-print-format-combo'
                            },
                            {
                                xtype: 'cwn2-btn-print-scale-field'
                            }
                        ]
                    },
                    {
                        xtype: 'cwn2-btn-print-pngfieldset'
                    },
                    {
                        xtype: 'cwn2-btn-print-pdffieldset'
                    }

                ],
                buttons: [
                    {
                        text: CWN2.I18n.get("Stampa"),
                        action: "print-submit"
                    },
                    {
                        text: CWN2.I18n.get("Annulla"),
                        action: "print-cancel"
                    }
                ],
                autoScroll: true
            }
        ];

        this.superclass.constructor.call(this);
    }
});

Ext.define('CWN2.button.Print.PngFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: "widget.cwn2-btn-print-pngfieldset",
    title: 'Dimensione PNG',
    width: 370,
    flex: 1,
    //layout: 'hbox',
    items: [
        {
            xtype: 'cwn2-btn-print-width-field'
        },
        {
            xtype: 'cwn2-btn-print-height-field'
        }
    ]

});

Ext.define('CWN2.button.Print.PdfFieldSet', {
    extend: 'Ext.form.FieldSet',
    alias: "widget.cwn2-btn-print-pdffieldset",
    title: 'Pagina PDF',
    width: 370,
    flex: 1,
    //layout: 'hbox',
    items: [
        {
            xtype: 'cwn2-btn-print-pagesize-combo'
        },
        {
            xtype: 'cwn2-btn-print-orientation-combo'
        },
        {
            xtype: 'cwn2-btn-print-title-field'
        }
    ]

});

Ext.define('CWN2.button.Print.OrientationCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: "widget.cwn2-btn-print-orientation-combo",
    fieldLabel: 'Orientazione',
    queryMode: 'local',
    store: [
        ["portrait", "Verticale"],
        ["landscape", "Orizzontale"]
    ],
    typeAhead: true,
    triggerAction: 'all',
    value: "portrait",
    width: 200
});

Ext.define('CWN2.button.Print.PageSizeCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: "widget.cwn2-btn-print-pagesize-combo",
    fieldLabel: 'Dimensione',
    queryMode: 'local',
    store: [
        ["A3", "A3"],
        ["A4", "A4"],
        ["A5", "A5"]
    ],
    typeAhead: true,
    triggerAction: 'all',
    value: "A4",
    width: 160
});

Ext.define('CWN2.button.Print.FormatCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: "widget.cwn2-btn-print-format-combo",
    fieldLabel: 'Formato',
    labelWidth: 50,
    queryMode: 'local',
    store: [
        ["pdf", "File PDF"],
        ["png", "Immagine PNG"]
    ],
    typeAhead: true,
    triggerAction: 'all',
    value: "pdf",
    width: 160
});

Ext.define('CWN2.button.Print.TitleField', {
    extend: 'Ext.form.TextArea',
    alias: "widget.cwn2-btn-print-title-field",
    fieldLabel: 'Titolo',
    allowBlank: true,
    width: 340,
    value: null
});

Ext.define('CWN2.button.Print.WidthField', {
    extend: 'Ext.form.NumberField',
    alias: "widget.cwn2-btn-print-width-field",
    fieldLabel: 'Larghezza (pixel)',
    allowBlank: false,
    value: "1",
    minValue: 1,
    maxValue: 2024,
    width: 160
});

Ext.define('CWN2.button.Print.ScaleField', {
    extend: 'Ext.form.field.Checkbox',
    alias: "widget.cwn2-btn-print-scale-field",
    boxLabel: 'Mantieni Scala',
    checked   : true
});

Ext.define('CWN2.button.Print.HeightField', {
    extend: 'Ext.form.NumberField',
    alias: "widget.cwn2-btn-print-height-field",
    fieldLabel: 'Altezza (pixel)',
    allowBlank: false,
    value: "1",
    minValue: 1,
    maxValue: 2024,
    width: 160
});

// CONTROLLER
Ext.define('CWN2.controller.button.print', {
    extend: 'Ext.app.Controller',

    views: [
        'CWN2.button.Print'
    ],

    refs: [
        {
            ref: 'button',
            selector: 'cwn2-button-print'
        },
        {
            ref: 'win',
            selector: 'cwn2-print-win'
        },
        {
            ref: 'format',
            selector: 'cwn2-btn-print-format-combo'
        },
        {
            ref: 'width',
            selector: 'cwn2-btn-print-width-field'
        },
        {
            ref: 'height',
            selector: 'cwn2-btn-print-height-field'
        },
        {
            ref: 'title',
            selector: 'cwn2-btn-print-title-field'
        },
        {
            ref: 'orientation',
            selector: 'cwn2-btn-print-orientation-combo'
        },
        {
            ref: 'pageSize',
            selector: 'cwn2-btn-print-pagesize-combo'
        },
        {
            ref: 'scale',
            selector: ' cwn2-btn-print-scale-field'
        },
        {
            ref: 'pngFieldSet',
            selector: ' cwn2-btn-print-pngfieldset'
        },
        {
            ref: 'pdfFieldSet',
            selector: ' cwn2-btn-print-pdffieldset'
        }



    ],

    init: function(application) {
        CWN2.Util.log('CWN2.controller.button.print: init');

        this.control({
            'button[action=print-submit]': {
                click: this.onSubmitButtonClick
            },
            'button[action=print-cancel]': {
                click: this.onCancelButtonClick
            },
            'cwn2-btn-print-format-combo': {
                select: this.onFormatSelect
            },
            'cwn2-button-print': {
                click: this.onClick
            }
        });
    },

    onClick: function() {
        var mapPanel = CWN2.app.layout.mapPanel,
            win = this.getWin(),
            button = this.getButton(),
            me = this;

        if (!win) {
            win = Ext.create('CWN2.button.Print.Window', {
            });
        }
        this.showHideWin(win, mapPanel);

    },

    showHideWin: function(win, mapPanel) {
        if (!win.isVisible()) {
            win.show();
            this.setFieldValues();
            this.enableFieldSets();
            win.alignTo(mapPanel.body, "tl-tl", [10, 10]);
        } else {
            win.hide();
        }
    },

    setFieldValues: function() {
        var widthField = this.getWidth(),
            heightField = this.getHeight(),
            titleField = this.getTitle();
        if (widthField.value === 1) {
            widthField.setValue(CWN2.app.map.div.scrollWidth);
        }
        if (heightField.value === 1) {
            heightField.setValue(CWN2.app.map.div.scrollHeight);
        }
        if (titleField.value === null || titleField.value === "") {
            titleField.setValue(CWN2.app.layout.mapTitle);
        }
    },

    enableFieldSets: function() {
        var fileType = this.getFormat().value;
        if (fileType === "png") {
            this.getPngFieldSet().enable();
            this.getPdfFieldSet().disable();
        } else {
            this.getPngFieldSet().disable();
            this.getPdfFieldSet().enable();
        }
    },

    onFormatSelect: function() {
        this.enableFieldSets();
    },


    onCancelButtonClick: function() {
        this.getWin().hide();
    },

    onSubmitButtonClick: function(button, e, eOpts) {
        var me = this,
            win = this.getWin(),
            fileType = this.getFormat().value,
            width = this.getWidth().value,
            height = this.getHeight().value,
            title = this.getTitle().value || null,
            scale = this.getScale().value,
            orientation = this.getOrientation().value,
            pageSize = this.getPageSize().value;


        if (fileType === "pdf") {
            var ratio = CWN2.app.map.div.scrollHeight/CWN2.app.map.div.scrollWidth;
            switch (pageSize) {
                case "A4":
                    if (orientation === "portrait") {
                        width = 900;
                        height = parseInt(width*ratio);
                    } else {
                        height = 800;
                        width = parseInt(height/ratio)
                    }
                    break;
                case "A3":
                    if (orientation === "portrait") {
                        width = 1400;
                        height = parseInt(width*ratio);
                    } else {
                        height = 1150;
                        width = parseInt(height/ratio)
                    }
                    break;
                case "A5":
                    if (orientation === "portrait") {
                        width = 750;
                        height = parseInt(width*ratio);
                    } else {
                        height = 600;
                        width = parseInt(height/ratio)
                    }
                    break;
            }

        }

        // costruisco configurazione
        var data = {
            printConfig: {
                fileType : fileType,
                title: title,
                width : width,
                height : height,
                pageSize : pageSize,
                orientation : orientation
            },
            mapOptions: {
                projection : CWN2.app.map.projection,
                extent : CWN2.app.map.getExtent().toString(),
                center : {
                    lon: CWN2.app.map.center.lon,
                    lat: CWN2.app.map.center.lat
                },
                zoom : CWN2.app.map.zoom,
                flagSameScale : scale,
                scale: CWN2.app.map.getScale()
            },
            baseLayers: [
                CWN2.app.map.layerManager.getActiveBaseLayerConfig()
            ],
            layers: CWN2.app.map.layerManager.overlayLayersConfig
        };

        CWN2.loadingScreen = Ext.getBody().mask('Preparazione Stampa', 'loadingscreen');

        // chiamo servizio di stampa della mappa
        CWN2.Util.ajaxRequest({
            type: "JSON",
            url: "/geoservices/REST/gv_print/print",
            callBack: function(response) {
                //CWN2.loadingScreen = Ext.getBody().mask('Preparazione Stampa', 'loadingscreen');
                var exception = {};
                if (!response ) {
                    exception.message = response.responseText;
                    exception.level = 2;
                    CWN2.Util.handleException(exception);
                    return;
                }
                if (response.success === false) {
                    exception.message = response.message;
                    exception.level = 2;
                    CWN2.Util.handleException(exception);
                    return;
                }
                CWN2.Util.log('Preparato file di stampa: ' + response.url);
                var strWindowFeatures = "menubar=yes,location=no,resizable=no,scrollbars=no,status=no";
                var popup = window.open(response.url, '', strWindowFeatures);
                popup.focus();
                win.hide();
            },
            jsonData: data
        });

        if (fileType === "pdf") {
            // chiamo servizio di stampa della legenda
            CWN2.Util.ajaxRequest({
                type: "JSON",
                url: "/geoservices/REST/gv_print/print_legend",
                callBack: function(response) {
                    var exception = {};
                    if (!response ) {
                        exception.message = response.responseText;
                        exception.level = 2;
                        CWN2.Util.handleException(exception);
                        return;
                    }
                    if (response.success === false) {
                        exception.message = response.message;
                        exception.level = 2;
                        CWN2.Util.handleException(exception);
                        return;
                    }
                    Ext.each(response.url, function(url,index) {
                        //CWN2.Util.log('Preparato file di stampa della legenda: ' + url);
                        var strWindowFeatures = "menubar=yes,location=no,resizable=no,scrollbars=no,status=no";
                        window.open(url, '', strWindowFeatures);
                        win.hide();
                    });


                },
                jsonData: data
            });
        }
    }

});