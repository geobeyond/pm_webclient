Ext.require(['Ext.form.FieldSet',
			'Ext.form.field.*',
			'Ext.data.*',
			'GeoExt.Action']);


Ext.define('PM.view.PanelFase1', {
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase1',
    requires: [''],
	title: 'Fase 1',
	bodyPadding: 5,
	autoScroll: true,
	items:[
			{
				xtype: 'panel',
				title: '<i class="fa fa-folder-open"></i> Layers',
				items:[{
					xtype: 'fieldset',
					id: 'layers-div',
					padding: '5px',	
				}]
			},
			{
			    xtype:'button',
				text: '<i class="fa fa-comment"></i> Invia standard report',
			    tooltip: "Invia gli elementi selezionati",
			    handler: function() {
			    	if (getSelectedFeaturesCount()==0) {
			    		alert("Nessun elemento selezionato!");
			    	}
			    	else {
			    		showSelectedForm(2);
			    	}
			    }
			}
	       ]
	});

var buttonsDrawable=false;
var buttonsDrawed=false;
var reportPanelDrawable=false;
var reportPanelDrawed=false;
var pageLoaded=false;


Ext.onReady(function(){
	
	buttonsDrawable=true;
	if (reportPanelDrawable && !reportPanelDrawed) reportPanelDraw();
	if (buttonsDrawable && checkAllLayersLoaded()) drawButtons();
	pageLoaded=true;
});




var actionSelect;
var selectControl;
var actionDelete;
var actionSubmit;


function drawButtons(){
	if (buttonsDrawed) return;
	buttonsDrawed=true;
	//buttonsNavSelFieldset=Ext.getCmp('fase1-nav-sel-buttons');
	//buttonsDelSendFieldset=Ext.getCmp('fase1-send-delete-buttons');
	buttonsDrawFieldset=Ext.getCmp('fase1-draw-buttons');
	map.addControl(new OpenLayers.Control.LayerSwitcher({
		'div':OpenLayers.Util.getElement('layers-div')
	}));
	/*
	actionDrawPoly = Ext.create('GeoExt.Action', {
        text: "<i class=\"fa fa-square-o\"></i> poly",
        control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Polygon),
        id: 'fase1-button-poly',
        map: map,
        toggleGroup: "draw",
        allowDepress: true,
        tooltip: "polygon",
        group: "draw"
    });
	
	actionDrawPoint = Ext.create('GeoExt.Action', {
        text: "<i class=\"fa fa-map-marker\"></i> point",
        control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Point),
        id: 'fase1-button-point',
        map: map,
        toggleGroup: "draw",
        allowDepress: true,
        tooltip: "draw point",
        group: "draw"
    });
	
	actionDrawLine = Ext.create('GeoExt.Action', {
        text: "<i class=\"fa fa-angle-left \"></i> line",
        control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Path),
        id: 'fase1-button-line',
        map: map,
        toggleGroup: "draw",
        allowDepress: true,
        tooltip: "draw line",
        group: "draw"
    });
   
	

	 
	//buttonsNavSelFieldset.add(Ext.create('Ext.button.Button', actionMaxExtent));
	//buttonsNavSelFieldset.add(Ext.create('Ext.button.Button', actionNav));
    buttonsDrawFieldset.add(Ext.create('Ext.button.Button', actionDrawPoint));
    buttonsDrawFieldset.add(Ext.create('Ext.button.Button', actionDrawLine));
    buttonsDrawFieldset.add(Ext.create('Ext.button.Button', actionDrawPoly));
    //buttonsNavSelFieldset.add(Ext.create('Ext.button.Button', actionSelect));
    //buttonsNavSelFieldset.add(Ext.create('Ext.button.Button', actionDelete));
    
*/
	
    
}





function formTypeSelect(){
	if (Ext.getCmp('fase1-form-type-selection-Window')){
		Ext.getCmp('fase1-form-type-selection-Window').destroy();
	}
	Ext.create('Ext.window.Window', {
	    title: '<i class="fa fa-sitemap"></i> Selezione il tipo di form',
	    id: 'fase1-form-type-selection-Window',
	    layout: 'fit',
	    items: [
	            
	            ]
	}).show();
}




					