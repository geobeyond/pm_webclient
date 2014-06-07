/**
 * The main application viewport, which displays the whole application
 * @extends Ext.Viewport
 */
var mi;
Ext.define('KitchenSink.view.button.MenuButtons', {
    extend: 'Ext.Container',
    xtype: 'menu-buttons',
    alias : 'widget.btnMenu',
    layout: 'vbox',
	});

Ext.define('PM.view.Viewport', {
    extend: 'Ext.Viewport',
    layout: 'fit',

    requires: [
        'Ext.slider.Single',
		'Ext.data.writer.Json',
		'Ext.grid.Panel',
		'GeoExt.data.reader.WmsCapabilities',
		'GeoExt.data.WmsCapabilitiesLayerStore',
		'GeoExt.panel.Map',
        'Ext.form.Panel',
        'Ext.form.Label',
        'Ext.data.TreeStore',
        'Ext.layout.container.Border',
		'Ext.layout.container.Accordion',
        'PM.view.Map',
		'PM.view.PanelFase1',
		'PM.view.PanelFase2',
		'PM.view.PanelFase3',
		'PM.view.PanelFase4',
		'PM.view.PanelFase5',
		'PM.view.PanelFase6',
		'PM.view.PanelFase7',
		'PM.view.PanelFase8',
		],

	
	
    initComponent: function() {
        var me = this;
mi=this;

        Ext.apply(me, {
            layout: 'border',
			items: [
			{
                region: 'center',
				xtype: 'pm_mappanel',
				margin: '35 0 5 5',
                },
			{
				region: 'west',
				xtype: 'panel',
				title: 'Fasi',
				width: 250,
				minWidth: 175,
				collapsible: true,
				margin: '35 0 5 5',
				layout: {
					type: 'accordion',
					animate: true
					},
				items: [{xtype:'panelFase1'}, 
						{xtype:'panelFase2'},
						{xtype:'panelFase3'},
						{xtype:'panelFase4'}, 
						{xtype:'panelFase5'},
						{xtype:'panelFase6'},
						{xtype:'panelFase7'},
						{xtype:'panelFase8'},
						]
				},
			{	
				region: 'east',
				xtype: 'panel',
				id: 'featInfo',
				title: 'Feature Report',
				width: 250,
				minWidth: 175,
				collapsible: true,
				collapsed: true,
				margin: '35 0 5 5'
			}]
            
        });
        me.callParent(arguments);
    }
});