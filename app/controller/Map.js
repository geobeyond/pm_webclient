/**
 * Map controller
 * Used to manage map layers and showing their related views
 */
Ext.define('PM.controller.Map', {
    extend: 'Ext.app.Controller',

    models: [],
    stores: [],

    refs: [],

    init: function() {
        var me = this;

        this.control({
            'pm_mappanel': {
                'beforerender': this.onMapPanelBeforeRender
            }
        }, this);
    },

    onMapPanelBeforeRender: function(mapPanel, options) {
        var me = this;

        var layers = [];

        // OpenLayers object creating
        var wms = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0?",
            {layers: 'basic'}
        );
        layers.push(wms);
        mapPanel.map.addLayers(layers);

		}});

