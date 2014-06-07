Ext.define('PM.view.PanelFase3', {
    
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase3',
    requires: [],
	//title: '<i class="fa fa-globe"></i> Seleziona servizi WMS',
	title: 'Fase 3',
	width: 200,
	items: [
	        {
            	xtype: "fieldset",
            	id: 'wms-fieldset',
				padding: 5,
            	items:[
		            {
		            	xtype: 'textfield',
		    		    id: 'fase1-formWmsUrlInput-url',
						label: 'aaa'
	    			},
	    			{
	    				xtype: 'button',
	    				text: '<i class="fa fa-cloud-download"></i> Layers da Server Locale',
	    				tooltip: "Invia gli elementi selezionati",
						padding: '5 0 5 0',
	    				handler: function() {
	    				  	url=encodeURIComponent("http://89.31.77.165//geoserver/ows?service=wms&request=GetCapabilities");
	    				  	loadDynWms(url);
	    				 }
	    			},
					{
	    				xtype: 'button',
	    				text: '<i class="fa fa-cloud-download"></i> Carica WMS Capabilities',
	    				tooltip: "Invia gli elementi selezionati",
	    				handler: function() {
	    				  	url=Ext.getCmp('fase1-formWmsUrlInput-url').getValue();
	    				  	loadDynWms(url);
	    				 }
	    			}
    			]
            } 
	]
	});



var wmsUrl='http://giswebservices.massgis.state.ma.us/geoserver/wms?request=getcapabilities';


function loadDynWms(wmsUrl){
	wmsUrl='wmsProxy.php?url='+encodeURIComponent(wmsUrl);
	if (Ext.getCmp('wmscapsStore')){
		Ext.getCmp('wmscapsStore').destroy();
	}
	if (Ext.getCmp('wms-loaded')){
		Ext.getCmp('wms-loaded').destroy();
	}
	wmsStore = Ext.create('GeoExt.data.WmsCapabilitiesStore', {
        storeId: 'wmscapsStore',
        url: wmsUrl,
        autoLoad: true
    });
	
	 var grid = Ext.create('Ext.grid.Panel', {
         title: "WMS Capabilities",
         id:'wms-loaded',
         store: wmsStore,
         height: 300,
         columns: [
             {header: "Title", dataIndex: "title", sortable: true},
             {header: "Name", dataIndex: "name", sortable: true}
         ],
         listeners: {
        	 itemdblclick: mapPreview
         }
     });
	 Ext.getCmp('wms-fieldset').add(grid);
}

function mapPreview(grid, record) {
	var layer = record.getLayer().clone();
	addLayerToMap(layer, map);
}
