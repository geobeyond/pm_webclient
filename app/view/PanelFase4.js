Ext.define('PM.view.PanelFase4', {
    
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase4',
    requires: [],
	title: 'Fase 4',
	//title: '<i class="fa fa-star-o"></i> Definisci stili',
	bodyPadding: 5,
	width: 200,
	items: [
	        {
	        	xtype: 'textfield',
	        	fieldLabel: 'Colore riempimento',
	        	id: 'style-fillColor',
	        	listeners:{
	        		focus: function(){
	        			showColorPicker('style-fillColor');
	        		}
	        	}
	        
	        },
	        {
	        	xtype: 'textfield',
	        	fieldLabel: 'Colore contorno',
	        	id: 'style-strokeColor',
	        	listeners:{
	        		focus: function(){
	        			showColorPicker('style-strokeColor');
	        		}
	        	}
	        },{
	        	xtype: 'sliderfield',
	        	width: 200,
	        	value: 1,
	            increment: 1,
	            minValue: 0,
	            maxValue: 10,
	        	fieldLabel: 'Spessore linea/contorno',
	        	id: 'style-strokeWidth'
	        },{
	        	xtype: 'sliderfield',
	        	width: 200,
	        	value: 10,
	            increment: 1,
	            minValue: 5,
	            maxValue: 20,
	        	fieldLabel: 'Spessore punto',
	        	id: 'style-pointRadius'
	        },{
	        	xtype: 'combobox',
	        	width:200,
				fieldLabel:'Stile punto',
				store: [["star","star"],["cross","cross"],["x","x"],["square","square"],["triangle","triangle"],["circle","circle"],["lightning","lightning"],["rectangle","rectangle"]],
    			id:'style-graphicName',
    			value:'circle'
	        },{
	        	xtype: 'combobox',
	        	width:200,
				fieldLabel:'Stile Contorno',
				store: [["dot","dot"],["dash","dash"],["dashdot","dashdot"],["longdash","longdash"],["longdashdot","longdashdot"],["solid","solid"]],
    			id:'style-strokeDashstyle',
    			value:'solid'
	        },{
	        	xtype: 'button',
	        	text: '<i class="fa fa-star-o"></i> Applica lo stile',
	 		    tooltip: "Invia gli elementi selezionati",
	 		    handler: function() {
	 		    	applyStyle();
	 		    }
	        }
	       ]
	});


function applyStyle(){
	for (var f in selectedFeatures) {
	    feature=selectedFeatures[f];
	    feature.style=new OpenLayers.Style();
	    feature.style.setDefaultStyle();
	    feature.style.fill=true;
	    feature.style.fillColor=Ext.getCmp('style-fillColor').getValue();
	    feature.style.strokeWidth=Ext.getCmp('style-strokeWidth').getValue();
	    feature.style.strokeColor=Ext.getCmp('style-strokeColor').getValue();
	    feature.style.strokeDashstyle=Ext.getCmp('style-strokeDashstyle').getValue();
	    feature.style.pointRadius=Ext.getCmp('style-pointRadius').getValue();
	    feature.style.graphicName=Ext.getCmp('style-graphicName').getValue();
	 }
	 vector.redraw();
}

function showColorPicker(target){
	if (Ext.getCmp('fase4-colorPicker-Window')){
		Ext.getCmp('fase4-colorPicker-Window').destroy();
	}
	Ext.create('Ext.window.Window', {
	    title: '<i class="fa fa-sitemap"></i> Selezione il colore',
	    id: 'fase4-colorPicker-Window',
	    layout: 'fit',
	    items: [
	            {
	            xtype: 'colorpicker',
	            listeners: {
	                select: function(picker, selColor) {
	                    Ext.getCmp(target).setValue('#'+selColor);
	                    document.getElementById(target).style.background='#'+selColor;
	                    Ext.getCmp('fase4-colorPicker-Window').hide();
		                }
		            }	
	            }
	            ]
	}).show();
}
	/*
function addItemToFieldset(fieldsetId, item){
	var fs=Ext.getCmp(fieldsetId);
	fs.add(item);
}

function ParseFields(str){
	var val,valori=[];
	val=str.split('::');
	valPredefinito=val[1];
	valori=val[0].split(',');
	return [valori,valPredefinito];
}

function formTypeSelect(){
	if (Ext.getCmp('fase1-form-type-selection-Window')){
		Ext.getCmp('fase1-form-type-selection-Window').destroy();
	}
	Ext.create('Ext.window.Window', {
	    title: 'Selezione il tipo di form',
	    id: 'fase1-form-type-selection-Window',
	    layout: 'fit',
	    items: [
	            {xtype: 'combobox',
	    		    id: 'fase1-form-type',
	    			store: store,
	    		    width:200,
	    			displayField: 'name',
	    			valueField: 'id',
	    			listeners:{
	    		         'select': function(){
	    		        	 Ext.getCmp('fase1-form-type-selection-Window').hide();
	    		        	 showSelectedForm(Ext.getCmp('fase1-form-type').value);
	    		         }
	    		    }

	    			}
	            ]
	}).show();
}
	
function buildCustomForm(formId, fieldsetId){
	 Ext.Ajax.request({
		    url: 'proxy.php?url=http://89.31.77.165/ushahidi-v2/api',
			params: {task:'customforms',
					by:'meta',
					formid:formId},
		    success: function(response){
		    	fs=Ext.getCmp(fieldsetId).removeAll();
		    	var text = response.responseText;
		        responseJson=Ext.JSON.decode(text);
		        for(i=0;i<responseJson.contents.payload.customforms.fields.length;i++){
		        	field=responseJson.contents.payload.customforms.fields[i];
		        	
                 switch (field.type){
		        // textfield
					case '1': f={xtype: 'textfield',id:field.id,fieldLabel:field.name};break;
				// textarea	
		        	case '2': f={xtype: 'textarea',id:field.id,fieldLabel:field.name};break;
				// date
		        	case '3': f={xtype: 'datefield',id:field.id,width:200,fieldLabel:field.name};break;
		        // radio	
					case '5': var storeVal=ParseFields(field.default)[0];
							  var defValue=ParseFields(field.default)[1];
						f={
						xtype      : 'fieldcontainer',
						fieldLabel : 'Size',
						defaultType: 'radiofield',
						defaults: {
							flex: 1
						},
						layout: 'vbox',
						items: [//cambiare gli items....
							{
								boxLabel  : 'M',
								name      : 'size',
								inputValue: 'm',
								id        : 'radio1'
							}, {
								boxLabel  : 'L',
								name      : 'size',
								inputValue: 'l',
								id        : 'radio2'
							}, {
								boxLabel  : 'XL',
								name      : 'size',
								inputValue: 'xl',
								id        : 'radio3'
							}
						]
					};break;
				// checkbox
		        	case '6': var storeVal=ParseFields(field.default)[0];
							  var defValue=ParseFields(field.default)[1];
								f={xtype: 'checkbox',id:field.id,fieldLabel:field.name};break;
				// combobox
		        	case '7': var storeVal=ParseFields(field.default)[0];
							  var defValue=ParseFields(field.default)[1];
								
								f={xtype: 'combobox', 
								width:200,
								fieldLabel:field.name,
								store: storeVal,
								value: defValue};break;
					case '8': f=null;
					case '9': f=null;
		        	}
					
	                addItemToFieldset(fieldsetId, f);
		        	
		        }
		        b= {
		    			xtype: 'button',
		    			html: 'Controlla features',
		    			handler: function (){
		    				report=''; cont=1;
		    				map.layers[1].features.forEach(function (i){
		    					report+=cont+'. '+i.geometry.toString()+'\n'+'-----'+'\n'; 
		    					cont++});
		    				Ext.getCmp('reportFeatures').setValue(report);
		    				}
		    	   };
		        addItemToFieldset(fieldsetId, b);
		    }
		});
}
	
function showSelectedForm(formId){
	if (Ext.getCmp('fase1-form-selected-window')){
		Ext.getCmp('fase1-form-selected-window').destroy();
	}
	Ext.create('Ext.window.Window', {
	    title: 'Compila form',
	    id: 'fase1-form-selected-window',
	    height: 400,
	    width: 600,
	    layout: 'fit',
	    items: [{
	                xtype: 'fieldset',
	                id: 'fase1-fieldset',
	 			   padding: 5
	 	       }
	       ]
	}).show();
	buildCustomForm(formId, 'fase1-fieldset');
	
}
*/