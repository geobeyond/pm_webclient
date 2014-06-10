Ext.require(['Ext.form.FieldSet',
			'Ext.form.field.*',
			'Ext.data.*']);
var responseJson=null;
var records = [];

var store = Ext.create('Ext.data.Store', {
							fields: ['id', 'name'],
							data : records
							});

Ext.Ajax.request({url: 'proxy.php?url=http://89.31.77.165/ushahidi-v2/api',
	    				params: {task:'customforms', by:'all'},
	    			    success: function(response){
							var text = response.responseText;
	    			        responseJson=Ext.JSON.decode(text);
							responseJson.contents.payload.customforms.forEach(function (obj) {
							records.push({id: obj.id, name: obj.title});
								});
						store.loadData(records);

Ext.define('PM.view.PanelFase1', {
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase1',
    requires: [''],
	title: 'Fase 1',
	bodyPadding: 5,
	items:[
	       {xtype: 'button', html:'Compila form',
	    	   handler: function() {
	    		   formTypeSelect();
	    	   }
	       }
	       /*,
	       {xtype: 'combobox',
		    id: 'cfType',
			store: store,
		    width:200,
			displayField: 'name',
			valueField: 'id',
			},
           {xtype: 'button', html:'Invia',
	    	   handler: function() {
	    		   buildCustomForm(Ext.getCmp('cfType').value, 'fieldset1');
	            }
	       },
	       {
               xtype: 'fieldset',
               id: 'fieldset1',
			   padding: 5
	       },
		   {
				xtype: 'button',
				html: 'Controlla features',
				handler: function (){
					report=''; cont=1;
					map.layers[1].features.forEach(function (i){
						report+=cont+'. '+i.geometry.toString()+'\n'+'-----'+'\n'; 
						cont++});
					Ext.getCmp('reportFeatures').setValue(report);
					}
		   },
		   {
				xtype: 'textarea',
				text: 'features',
				id: 'reportFeatures',
				height:500,
				width: 250
		   }
		   */
	       ]
	});

						}});
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
								console.log(field.default);
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

					