Ext.define('CWN2.button.BaseLayersCombo', {
    alias: 'widget.cwn2-combo-base-layers',
    constructor: function(config) {
        return Ext.create("CWN2.BaseLayersComboBox", {id: 'combo-base-layers'});
    }
});
