Ext.define('PM.view.PanelFase6', {
    
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase6',
    requires: [],
	//title: '<i class="fa fa-bar-chart-o"></i> Report',
	title: 'Fase 6',
	bodyPadding: 5,
	width: 200,
		items: [
		        
		        {
		        	xtype: 'panel',
		        	title: 'Seleziona range',
		        	items:[
							{
								xtype:'datefield',
								width: '70%',
								id: 'fromDate',
								name: 'fromDate'
							},{
								xtype:'datefield',
								width: '70%',
								id: 'toDate',
								name: 'toDate'
							}
		        	       ]
		        }
				
		      ]
	});