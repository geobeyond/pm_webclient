Ext.define('PM.store.StoreMap', {
            extend:'Ext.data.TreeStore',
			requires: 'PM.view.Map',
			alias: 'widget.storemap',
			model: 'GeoExt.data.LayerTreeModel',
			root: {
                expanded: true,
                children: [
                    {
                        plugins: [{
                            ptype: 'gx_layercontainer',
                            //store: map.layers
                        }],
                        expanded: true
                    },{
                        plugins: ['gx_baselayercontainer'],
                        expanded: true,
                        text: "Base Maps"
                    }, {
                        plugins: ['gx_overlaylayercontainer'],
                        expanded: true
                    }
                ]
            }
        });
		