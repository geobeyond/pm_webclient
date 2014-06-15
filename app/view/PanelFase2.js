
Ext.define('PM.view.PanelFase2', {
    
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase2',
    requires: [],
	title: 'Fase 2',
	width: 200,
	id: 'fase2-report-buttons',
	listeners:{
		'expand': function(){
			console.log("expand");
			addLayerToMap(pmLayer, map);
		},
		'collapse': function(){
			console.log("collapse");
			map.removeLayer(pmLayer);
		}
		
	}
	});


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
						reportPanelDrawable=true;
						if (pageLoaded && !reportPanelDrawed){
							reportPanelDraw();
						}
	    			    }
					}); 

function reportPanelDraw(){
	reportPanelDrawed=true;
	selectFormField={xtype: 'combobox',
		    id: 'fase1-form-type',
			store: store,
		    width:200,
			padding:10,
			displayField: 'name',
			labelField: 'seleziona la form',
			valueField: 'id'
		};
	
	 
	 actionSubmit=Ext.create('Ext.Button', {
		    text: '<i class="fa fa-comment"></i> Invia',
		    tooltip: "Invia gli elementi selezionati",
		    handler: function() {
		    	if (getSelectedFeaturesCount()==0) {
		    		alert("Nessun elemento selezionato!");
		    	}
		    	else {
		    		if (Ext.getCmp('fase1-form-type').getValue()==null) alert("Selezionare il tipo di form");
		    		else showSelectedForm(Ext.getCmp('fase1-form-type').getValue());
		    	}
		    }
		});
	 
	 buttonsSendReportFieldset=Ext.getCmp('fase2-report-buttons');
	 buttonsSendReportFieldset.add(selectFormField);
	 buttonsSendReportFieldset.add(Ext.create('Ext.button.Button', actionSubmit));
	    
}

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

var formReport=null;
var thisUrl=self.location.href;
var locationUrl=thisUrl.split('//')[1].split('.')[0];

function showSelectedForm(formId){
	if (Ext.getCmp('fase1-form-selected-window')){
		Ext.getCmp('submitForm').destroy();
		Ext.getCmp('fase1-form-selected-window').destroy();
	}
	formReport=Ext.create('Ext.window.Window', {
	    title: '<i class="fa fa-comment"></i> Invia nuovo report',
	    id: 'fase1-form-selected-window',
	    height: 400,
	    width: 600,
		padding: 15,
	    autoScroll:true,
	    layout: 'fit',
	    items: [{
	                xtype: 'form',
	                id: 'submitForm',
	 			    autoScroll:true,
	 			    url: 'proxy.php?mode=native&url='+encodeURIComponent('http://89.31.77.165/ushahidi-v2/api/'),
	 			    items:[
		 			    {
						xtype:'textfield',
						id: 'incident_title',
						name: 'incident_title',
						fieldLabel: 'Report title'
						},{
							 xtype: 'hiddenfield',
							 id:'task',
							 name: 'task',
							 value: 'report'
						},{
							xtype:'textfield',
							id: 'location_name',
							name: 'location_name',
							fieldLabel: 'Nome luogo',
							value: locationUrl
							}
						,{
							xtype:'textarea',
							id: 'incident_description',
							name: 'incident_description',
							fieldLabel: 'Descrizione'
						},{
							xtype:'datefield',
							id: 'incident_date',
							name: 'incident_date',
							fieldLabel: 'Data'
						},{
							xtype:'timefield',
							id: 'incident_time',
							name: 'delete',
							fieldLabel: 'Ora'
						},{
							 xtype: 'hiddenfield',
							 id:'submitForm-hour',
							 name: 'incident_hour'
						},{
							 xtype: 'hiddenfield',
							 id:'submitForm-min',
							 name: 'incident_minute'
						},{
							 xtype: 'hiddenfield',
							 id:'submitForm-ampm',
							 name: 'incident_ampm'
						},{
							 xtype: 'hiddenfield',
							 id:'resp',
							 name: 'resp',
							 value: 'json'
						},{
							 xtype: 'hiddenfield',
							 id:'incident_category',
							 name: 'incident_category',
							 value: '4'
						}
					]
	 	       }
	       ],
	       buttons: [{
	           text: 'Annulla',
	           handler: function() {
	        	   Ext.getCmp('submitForm').getForm().reset();
	               Ext.getCmp('fase1-form-selected-window').hide();
	           }
	       }, {
	           text: 'Invia report',
	           disabled: false,
	           handler: function() {
	        	   var form = Ext.getCmp('submitForm').getForm();
	               items=form.getFields().items;
	               for (i=0;i<items.length;i++){
	                   if (items[i].name=='delete') {
	                       if (items[i].id=='incident_time'){
	                    	     
	                    	   if (items[i].getValue() && items[i].getValue().getHours()){
	                    		hour=items[i].getValue().getHours();
	                           ampm="am";
	                           if (hour>12){
	                               hour-=12;
	                               ampm="pm";
	                           }
	                           min=items[i].getValue().getMinutes();
	                           Ext.getCmp('submitForm-ampm').setValue(ampm);
	                           Ext.getCmp('submitForm-hour').setValue(hour);
	                           Ext.getCmp('submitForm-min').setValue(min);
	                    	   }else {
	                    		   alert("Inserire l'orario");
	                    		   return false;
	                    		   }
	                    	   
	                       }
	                       items[i].disable();
	                   }
	               }
	               form.submit({
	            	   waitMsg:'Loading...',
	            	   failure: function(form,action){//legge sempre un metodo failure anche quando � success
	            		   
	            		   if (action.result && action.result.payload && action.result.payload.success=='true'){
	            			   layer_fk='';
	            			   //saveGeometries();
		            		   formReport.close();
	            		   } else {
	            			   
	            			   if (action.result && action.result.error){
	            				   if (action.result.error.message!="") alert("Errore! "+action.result.error.message);
	            				   if (action.result.error.code!="") alert("Errore! Controllare la compilazione della form (code: "+action.result.error.code+")");
	            			   } else {
		            			   alert ("Errore! Controllare la compilazione della form");
	            			   }
	            		   }
                       }
	               });
	          	   
	               console.log("Inviato!!!")
	               
	               for (i=0;i<items.length;i++){
	                   if (items[i].name=='delete') {
	                       items[i].enable();
	                   }
	               }
	           },
	           success:function(data){
	        	   
	        	   
	           }
	       }]
	}).show();
	f={
			xtype: 'hidden',
			name:'incident_zoom',
			value: map.zoom
		};
		
	addItemToFieldset('submitForm', f);
	var proj_4326 = new OpenLayers.Projection('EPSG:4326');
    var proj_900913 = new OpenLayers.Projection('EPSG:900913');
    center=map.getCenter();
    center.transform(proj_900913,proj_4326);
	
	f={
			xtype: 'hidden',
			name:'latitude',
			value: center.lat
		};
	addItemToFieldset('submitForm', f);
	f={
			xtype: 'hidden',
			name:'longitude',
			value: center.lon
		};
	addItemToFieldset('submitForm', f);
	i=0;
	for (var f in selectedFeatures) {
		feature=selectedFeatures[f];
		geom=feature.geometry;
		lonlatclone = geom.clone();
	    lonlatclone.transform(proj_900913, proj_4326);
		
		f={
    			xtype: 'hidden',
    			name:'geometry['+i+']',
    			value: '{"geometry":"'+lonlatclone.toString()+'","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5"}'
    		};
		addItemToFieldset('submitForm', f);
		i++;
	}
	
	buildCustomForm(formId, 'submitForm');
	
}

var layer_fk='';

function buildCustomForm(formId, fieldsetId){
	 layer_fk='';
	 for (var f in selectedFeatures) {
		 layer_fk=selectedFeatures[f].fid;
	 }
	 Ext.Ajax.request({
		    url: 'proxy.php?url=http://89.31.77.165/ushahidi-v2/api',
			params: {task:'customforms',
					by:'meta',
					formid:formId},
		    success: function(response){
		    	var text = response.responseText;
		    	f={
		    			xtype: 'hidden',
		    			name:'form_id',
		    			value: formId
		    		};

                addItemToFieldset(fieldsetId, f);
		        responseJson=Ext.JSON.decode(text);
		        for(i=0;i<responseJson.contents.payload.customforms.fields.length;i++){
		        	field=responseJson.contents.payload.customforms.fields[i];
		        	idx=i+1;
                 switch (field.type){
		        	case '1': 
		        				f={
			        			xtype: 'textfield',
			        			id:field.id,
			        			name:'custom_field['+field.id+']',
			        			fieldLabel:field.name
			        			};
                 			
		        		break;
					case '2': 
						if (field.name=='layer_fk'){
	        				f={
				        	xtype: 'hidden',
				        	id:field.id,
				        	name:'custom_field['+field.id+']',
				        	value: layer_fk
				        	};
	        			}else {
							f={
							xtype: 'textarea',
							id:field.id,
		        			name:'custom_field['+field.id+']',
							fieldLabel:field.name
							};
	        			}
						break;
					case '3': f={
							xtype: 'datefield',
							id:field.id,
		        			name:'custom_field['+field.id+']',
							width:200,
							fieldLabel:field.name
						};
						break;
		        	case '5': var storeVal=ParseFields(field.default)[0];
							  var defValue=ParseFields(field.default)[1];
						f={
						xtype      : 'fieldcontainer',
						fieldLabel : 'Size',
	        			name:'custom_field['+field.id+']',
						defaultType: 'radiofield',
						defaults: {
							flex: 1
						},
						layout: 'vbox',
						items: [
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
		        	case '6': var storeVal=ParseFields(field.default)[0];
							  var defValue=ParseFields(field.default)[1];
								f={
										xtype: 'checkbox',
										id:field.id,
					        			name:'custom_field['+field.id+']',
										fieldLabel:field.name
									};
								break;
		        	case '7': var storeVal=ParseFields(field.default)[0];
							  var defValue=ParseFields(field.default)[1];
								
								f={xtype: 'combobox', 
								width:200,
								fieldLabel:field.name,
								store: storeVal,
			        			name:'custom_field['+field.id+']',
								value: defValue};break;
					case '8': f=null;
					break;
					case '9': f=null;
					break;
		        	}
					
	                addItemToFieldset(fieldsetId, f);
		        	
		        }
		    }
		});
}

