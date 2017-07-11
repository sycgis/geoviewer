/**
 *
 * Class: CWN2.IframeWindow
 *
 * Crea una finestra ExtJS con un pannello contenente un Iframe con un documento esterno (html/pdf/ecc...)
 *
 */

Ext.define('CWN2.IframeWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.cwn2-iframe-window',

    layout: 'fit',
    renderTo: window.document.body,
    renderSelectors: {
        iframeEl: 'iframe'
    },

    loadDocument: function(uri) {
        var el = this.iframeEl;

        // Windows are lazy and render themselves to the DOM
        // only when they're shown the first time, so if you
        // call loadDocument before first show(), the iframeEl
        // will be missing. This is to avoid the kaboom.
        if (el) {
            el.set({ src: uri });
        }
    },

    constructor: function(config) {
        var defaultConfig = {
            height: config.height || 400,
            width: config.width || 600,
            items: [
                {
                    xtype: 'box',
                    autoEl: {
                        tag: 'iframe',
                        src: config.url
                    }
                }
            ],
            id: config.id,
            resizable: (config.resizable === false) ? false : true,
            listeners: config.listeners
        };

        if (config.hide) {
            defaultConfig.closeAction = 'hide';
        }

        this.superclass.constructor.call(this, defaultConfig);
        //if (!config.hide) {
        //    this.show();
        //}
        Ext.WindowManager.register(this);
        Ext.WindowManager.bringToFront(this);
    }

});

