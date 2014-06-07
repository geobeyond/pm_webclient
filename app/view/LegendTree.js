Ext.define('PM.view.LegendTree', {
			extend: 'GeoExt.tree.Panel',
			alias : 'widget.treePanel',
			requires: 'PM.store.StoreMap',
            border: true,
            collapseMode: "mini",
            //autoScroll: true,
            store: {xtype: 'storemap'},
            rootVisible: false,
            lines: false,
            tbar: [{
                text: "remove",
                handler: function() {
                    layer = mapPanel.map.layers[2];
                    mapPanel.map.removeLayer(layer);
                }
            }, {
                text: "add",
                handler: function() {
                    mapPanel.map.addLayer(layer);
                }
            }]
        });