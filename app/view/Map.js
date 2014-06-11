/**
 * The GeoExt.panel.Map used in the application.  Useful to define map options
 * and stuff.
 * @extends GeoExt.panel.Map
 */

OpenLayers.ProxyHost = "wfsProxy.php?url=";

var layersLoaded=new Object();
var map;
var selectControl;
var layers=new Object();
var wfs;
var wfsProtocol;

var actionDrawPoly;
var actionDrawPoint;
var actionDrawLine;

  
var pmLayer=null;
var selectedFeatures=new Object();

var feature=null;
var drawedFeature=null;
var savedFeature=null;

function saveFeature(f){
	formReport=Ext.create('Ext.window.Window', {
	    title: 'Salva',
	    id: 'map-form-selected-window',
	    height: 400,
	    width: 600,
		padding: 15,
	    autoScroll:true,
	    layout: 'fit',
	    items: [{
	                xtype: 'form',
	                id: 'map-submitForm',
	 			    autoScroll:true,
	 			    items:[
		 			    {
						xtype:'textfield',
						id: 'name',
						name: 'name',
						fieldLabel: 'Name'
						},{
							xtype:'textfield',
							id: 'description',
							name: 'description',
							fieldLabel: 'Descrizione'
							}
						,{
							xtype:'textfield',
							id: 'text',
							name: 'text',
							fieldLabel: 'Testo'
							}
						,{
							xtype:'textfield',
							id: 'maplabel',
							name: 'maplabel',
							fieldLabel: 'Label'
						},{
							xtype:'textfield',
							id: 'style',
							name: 'style',
							fieldLabel: 'style'
						},{
							xtype:'textfield',
							id: 'symbol_size',
							name: 'symbol_size',
							fieldLabel: 'Symbol Size'
						},{
							xtype:'textfield',
							id: 'title',
							name: 'title',
							fieldLabel: 'Title'
						},{
							xtype:'textfield',
							id: 'link',
							name: 'link',
							fieldLabel: 'Link'
						}
					]
	 	       }
	       ],
	       buttons: [{
	           text: 'Annulla',
	           handler: function() {
	        	   Ext.getCmp('map-submitForm').getForm().reset();
	               Ext.getCmp('map-form-selected-window').hide();
	               Ext.getCmp('map-form-selected-window').destroy();
	               f.destroy();
	           }
	       }, {
	           text: 'Salva',
	           disabled: false,
	           handler: function() {
	        	   var form = Ext.getCmp('map-submitForm').getForm();
	               items=form.getFields().items;
	               addLayerToMap(wfs, map);
		    	   console.log("Aggiunta feature"+f.id+" on Vector Layer");
		           feature=f.clone();
		           
		           for (i=0;i<items.length;i++){
	                   if (items[i].name=='name') {
	                	   feature.attributes.name=items[i].getValue();
	    		           feature.data.name=items[i].getValue();
	                   }
	                   if (items[i].name=='description') {
	                	   feature.attributes.description=items[i].getValue();
	    		           feature.data.description=items[i].getValue();
	                   }
	                   if (items[i].name=='maplabel') {
	                	   feature.attributes.maplabel=items[i].getValue();
	    		           feature.data.maplabel=items[i].getValue();
	                   }
	                   if (items[i].name=='style') {
	                	   feature.attributes.style=items[i].getValue();
	    		           feature.data.style=items[i].getValue();
	                   }
	                   if (items[i].name=='symbol_size') {
	                	   feature.attributes.symbol_size=items[i].getValue();
	    		           feature.data.symbol_size=items[i].getValue();
	                   }
	                   if (items[i].name=='title') {
	                	   feature.attributes.title=items[i].getValue();
	    		           feature.data.title=items[i].getValue();
	                   }
	                   if (items[i].name=='link') {
	                	   feature.attributes.link=items[i].getValue();
	    		           feature.data.link=items[i].getValue();
	                   }
	                   if (items[i].name=='text') {
	                	   feature.attributes.text=items[i].getValue();
	    		           feature.data.text=items[i].getValue();
	                   }
		           }
		           
		           feature.state=OpenLayers.State.INSERT;
		           //selectControl.select(feature);
		           wfs.addFeatures([feature]);
		           saveStrategy.save();
		        	//setTimeout("map.removeLayer(wfs);",500);
		           savedFeature=feature;
		           drawedFeature=f;
		           setTimeout("uploadImages();",500);
	               Ext.getCmp('map-form-selected-window').hide();
	               Ext.getCmp('map-form-selected-window').destroy();
	              
	               
	           },
	           success:function(data){
	        	   
	        	   
	           }
	       }]
	});
	formReport.show();
	formReport.on('close', function(){
		Ext.getCmp('map-submitForm').getForm().reset();
        Ext.getCmp('map-form-selected-window').hide();
        Ext.getCmp('map-form-selected-window').destroy();
        f.destroy();
	});
}

function deleteSelectedFeatures(){
	
	for (var f in selectedFeatures) {
		deleteFeature(selectedFeatures[f]);	
	}
}

function uploadImages(){
	console.log(savedFeature.fid);
	if (savedFeature.fid==undefined) {
		setTimeout("uploadImages();",500);
		return;
	}
	pmLayer.redraw(true) ;
	wfs.redraw();
	drawedFeature.fid=savedFeature.fid;
	new Ext.Window({
	    title : "Upload images/video",
	    width : 500,
	    height: 300,
	    layout : 'fit',
	    items : [{
	        xtype : "component",
	        autoEl : {
	            tag : "iframe",
	            src : "fileUpload.php?fid="+feature.fid
	        }
	    }]
	}).show();
}

function deleteFeature(fid){
	if (!confirm('Sei Sicuro?')) return;
	for (var fName in selectedFeatures){
		if (selectedFeatures[fName].fid==fid) sf=selectedFeatures[fName];
	}
	delete selectedFeatures[sf.id];
	sf.state=OpenLayers.State.DELETE;
    saveStrategy.save();
    Ext.getCmp('featInfo').collapse();
    Ext.Ajax.request({
		url: 'deleteMedia.php?fid='+fid
    });
    setTimeout('pmLayer.redraw(true);',500);
}


function getSelectedFeaturesCount(){
	var c=0;
	for (var f in selectedFeatures) {
		c++;
	}
	return c;
}

var featurePanelOpened=false;

function clearSelectedFeatures(){
	featurePanelOpened=false;
	selectedFeatures=new Object();
}

function gestDeSelected(feature){
	if (Ext.getCmp("fid-panel-"+feature.fid)) Ext.getCmp("fid-panel-"+feature.fid).destroy();
	for (var f in selectedFeatures){
		if (f==feature.name){
			delete selectedFeature[f];
		}
	}
}

function modSelectedFeature(fid){
	console.log(fid);
	console.log(selectedFeatures);
	for (var fName in selectedFeatures){
		if (selectedFeatures[fName].fid==fid) sf=selectedFeatures[fName];
	}
	
	formReport=Ext.create('Ext.window.Window', {
	    title: 'Modifica metadati',
	    id: 'map-form-selected-window',
	    height: 400,
	    width: 600,
		padding: 15,
	    autoScroll:true,
	    layout: 'fit',
	    items: [{
	                xtype: 'form',
	                id: 'map-submitEdit',
	 			    autoScroll:true,
	 			    items:[
		 			    {
						xtype:'textfield',
						id: 'name',
						name: 'name',
						fieldLabel: 'Name',
						value: sf.data.name
						},{
							xtype:'textfield',
							id: 'description',
							name: 'description',
							fieldLabel: 'Descrizione',
							value: sf.data.description
							}
						,{
							xtype:'textfield',
							id: 'text',
							name: 'text',
							fieldLabel: 'Testo',
							value: sf.data.text
							}
						,{
							xtype:'textfield',
							id: 'maplabel',
							name: 'maplabel',
							fieldLabel: 'Label',
							value: sf.data.maplabel
						},{
							xtype:'textfield',
							id: 'style',
							name: 'style',
							fieldLabel: 'style',
							value: sf.data.style
						},{
							xtype:'textfield',
							id: 'symbol_size',
							name: 'symbol_size',
							fieldLabel: 'Symbol Size',
							value: sf.data.symbol_size
						},{
							xtype:'textfield',
							id: 'title',
							name: 'title',
							fieldLabel: 'Title',
							value: sf.data.title
						},{
							xtype:'textfield',
							id: 'link',
							name: 'link',
							fieldLabel: 'Link',
							value: sf.data.link
						}
					]
	 	       }
	       ],
	       buttons: [{
	           text: 'Annulla',
	           handler: function() {
	        	   Ext.getCmp('map-submitEdit').getForm().reset();
	               Ext.getCmp('map-form-selected-window').destroy();
	           }
	       }, {
	           text: 'Salva',
	           disabled: false,
	           handler: function() {
	        	   var form = Ext.getCmp('map-submitEdit').getForm();
	               items=form.getFields().items;
	               for (i=0;i<items.length;i++){
	                   if (items[i].name=='name') {
	                	   sf.attributes.name=items[i].getValue();
	                	   sf.data.name=items[i].getValue();
	                   }
	                   if (items[i].name=='description') {
	                	   sf.attributes.description=items[i].getValue();
	                	   sf.data.description=items[i].getValue();
	                   }
	                   if (items[i].name=='maplabel') {
	                	   sf.attributes.maplabel=items[i].getValue();
	                	   sf.data.maplabel=items[i].getValue();
	                   }
	                   if (items[i].name=='style') {
	                	   sf.attributes.style=items[i].getValue();
	                	   sf.data.style=items[i].getValue();
	                   }
	                   if (items[i].name=='symbol_size') {
	                	   sf.attributes.symbol_size=items[i].getValue();
	                	   sf.data.symbol_size=items[i].getValue();
	                   }
	                   if (items[i].name=='title') {
	                	   sf.attributes.title=items[i].getValue();
	                	   sf.data.title=items[i].getValue();
	                   }
	                   if (items[i].name=='link') {
	                	   sf.attributes.link=items[i].getValue();
	                	   sf.data.link=items[i].getValue();
	                   }
	                   if (items[i].name=='text') {
	                	   sf.attributes.text=items[i].getValue();
	                	   sf.data.text=items[i].getValue();
	                   }
		           }
	               sf.state=OpenLayers.State.UPDATE;
		           saveStrategy.save();
		           pmLayer.redraw(true) ;
	               Ext.getCmp('map-form-selected-window').hide();
	               Ext.getCmp('map-form-selected-window').destroy();
	               if (Ext.getCmp("fid-panel-"+sf.fid)) Ext.getCmp("fid-panel-"+sf.fid).destroy();
	               gestSelected(sf);
	               
	           },
	           success:function(data){
	        	   
	        	   
	           }
	       }]
	});
	formReport.show();
	formReport.on('close', function(){
		Ext.getCmp('map-submitEdit').getForm().reset();
        Ext.getCmp('map-form-selected-window').destroy();
	});
}

function riempiDiv1(feat){
	var attr=feat.data;
	var mod="" +
			"<a href='#' onclick=\"modSelectedFeature('"+feat.fid+"'); return false;\"><i class='fa fa-pencil'> </i> Modifica</a>" +
					"&nbsp;" +
					"<a href='#' onclick=\"deleteFeature('"+feat.fid+"'); return false;\"><i class='fa fa-trash-o'> </i> Elimina</a>";
	var divIcon="<h1><img src='http://www.montagna.tv/cms/wp-content/themes/montagnatv/styles/montagnatv/PDF_icon.png'>";
	var divMapLabel="    "+attr.maplabel+"</h1>";
	var divDescr="<div style='border: 1px solid gray; padding: 10px'>"+attr.description+"</div>";
	var divTitle="<h1>"+attr.title+"</h1>";
	var divText="<div style='border: 1px solid gray; padding: 10px'>"+attr.text+"</div>";
	var divHtml=divIcon+divMapLabel+divDescr+divTitle+divText+mod;
	return divHtml;
}

function viewImage(imgPath){
	if (Ext.getCmp("photo-view")) {
		Ext.getCmp("photo-view").destroy();
	}
		var imgGreat=Ext.create('Ext.Img', {
		    src: imgPath
		});
		formReport=Ext.create('Ext.window.Window', {
		    title: 'Image',
		    id: 'photo-view',
		    height: 400,
		    width: 600,
			padding: 15,
		    autoScroll:true,
		    layout: 'fit',
		    items: [imgGreat]
		}).show();
}

function deleteImage(id){
	if (!confirm("sei sicuro?")) return false;
	Ext.Ajax.request({
		url: 'deleteMedia.php?id='+id,
		success: function(){
			for (var fName in selectedFeatures){
				sf=selectedFeatures[fName];
			}
			if (Ext.getCmp("fid-panel-"+sf.fid)) Ext.getCmp("fid-panel-"+sf.fid).destroy();
		    gestSelected(sf);
		}
	});
	
    
}

function riempiDiv2(feat){
	var feature=feat;
	var itemsImg=new Array();
	Ext.Ajax.request({
		url: 'getMedia.php',
		params: {fid: feature.fid},
		callback : function(options, success, response){
			var json = Ext.decode(response.responseText);
			
			
			var addMedia=Ext.create('Ext.Button', {
			    text: '<i class="fa fa-picture-o"> </i> Aggiungi media',
			    renderTo: Ext.getBody(),
			    handler: function() {
			    	var upload=new Ext.Window({
					    title : "Upload images/video",
					    width : 500,
					    height: 300,
					    layout : 'fit',
					    items : [{
					        xtype : "component",
					        autoEl : {
					            tag : "iframe",
					            src : "fileUpload.php?fid="+feature.fid
					        }
					    }]
					});
			    	upload.show();
			    	upload.on('close', function() {
			    		for (var fName in selectedFeatures){
							sf=selectedFeatures[fName];
						}
			    		if (Ext.getCmp("fid-panel-"+sf.fid)) Ext.getCmp("fid-panel-"+sf.fid).destroy();
					    gestSelected(sf);
					    Ext.getCmp("featDiv2").doLayout();
			    	});
			    }
			});
			addItemToFieldset("featDiv2", addMedia);
			if (json!=null){
				if (json.images!=null){
					images=json.images;
					var img_str="<ul class='img_slider'>";
					for (i=0;i<images.length;i++){
						img_str+="<li><img height=\"140px\" src='"+images[i].thumb+"' title='"+images[i].name+"' onclick=\"viewImage('"+images[i].path+"');\"><br/>" +
								"<a href='#' onclick=\"deleteImage("+images[i].id+");return false;\"><i class='fa fa-trash-o'> </i> Elimina</a></li>";
					}
					img_str+="</ul><hr class='separator'/>";
					imgSlider={
						id:'img-slider',
						html: img_str,
						flex:1
					}
					addItemToFieldset("featDiv2", imgSlider);
				}
				if (json.videos!=null){
					videos=json.videos;
					for (i=0;i<videos.length;i++){
						v={
							html: "<li><a href='"+videos[i].path+"' target='about:blank'>"+videos[i].name+"</a> &nbsp; <a href='#' onclick=\"deleteImage("+videos[i].id+");return false;\"><i class='fa fa-trash-o'> </i> Elimina</a></li>", 
							flex:1
						}
						addItemToFieldset("featDiv2", v);
					}
				}
				Ext.getCmp("featDiv2").doLayout();
			}
		}
		});
}

function gestSelected(feature){
	if (Ext.getCmp('featInfo').items.items[0]!=undefined) Ext.getCmp('featInfo').items.items[0].destroy();
	var item={
			id: 'fid-panel-'+feature.fid,
			xtype: 'panel',
			height: 300,
			layout: 'hbox',
			autoScroll: true,
			padding: 10,
			items: [
				{
					id:'featDiv1',
					html: riempiDiv1(feature),
					autoScroll: true,
					flex:1
				},{
					id:'featDiv2',
					padding: 5,
					autoScroll: true,
					html: riempiDiv2(feature),
					flex:1
				}
				]
		};
	addItemToFieldset("featInfo", item);
	
}


function addLayerToMap(layer, map){
	if (Ext.getCmp('fase1-button-poly')){
		Ext.getCmp('fase1-button-poly').disabled=true;
	}
	layersLoaded[layer.name]=false;
	layers[layer.name]=layer;
	layer.events.register("loadend", layer, function(e, layer){
		layerAddedEvent(this);
      });
	layer.events.register("added", layer, function(e, layer){
		layerAddedEvent(this);
	});
    map.addLayer(layer);
    
}
var layerStore;
var map;
var saveStrategy = new OpenLayers.Strategy.Save();
var infoBtn;

function layerAddedEvent(layer){
	layersLoaded[layer.name]=true;
	if (checkAllLayersLoaded()){
	   	if (buttonsDrawable) drawButtons();
	}
	if (Ext.getCmp('layers-div')!=undefined) Ext.getCmp('layers-div').doLayout();
}

function checkAllLayersLoaded(){
	loaded=true;
	for (var k in layersLoaded) {
		if (!layersLoaded[k]) {
			loaded=false;
		}
	};
	return loaded;
}

Ext.define('PM.view.Map', {
    extend: 'GeoExt.panel.Map',
    alias : 'widget.pm_mappanel',
    id: "mapPanel",
    requires: [
        'Ext.window.MessageBox',
        'GeoExt.Action',
		'GeoExt.tree.Panel',
		'gxp.plugins.Styler'
    ],
    border: 'false',
    layout: 'fit',
    region: 'east',
    width: 400,
		
    initComponent: function() {
        var me = this,
            items = [],
            ctrl;
		// proiezioni
		var WGS84 = new OpenLayers.Projection("EPSG:4326");
		var SphericMercator = new OpenLayers.Projection("EPSG:3857");
		
        map = new OpenLayers.Map({
					projection: SphericMercator,
					units: "m",
					maxResolution: 1000,
					maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
			});

		mqosm = new OpenLayers.Layer.XYZ("MapQuest OpenStreetMap",
        ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
         "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
         "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
         "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png"], {sphericalMercator: true, isBaseLayer:true});
		 
        mqsat = new OpenLayers.Layer.XYZ("MapQuest Imagery",
         ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
         "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
         "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
         "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"], {sphericalMercator: true});
		 
        osm = new OpenLayers.Layer.XYZ("OpenStreetMap",
         ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
         "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
         "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png",
         "http://d.tile.openstreetmap.org/${z}/${x}/${y}.png"], {sphericalMercator: true});
		
		gphy = new OpenLayers.Layer.Google("Google Physical",{type: google.maps.MapTypeId.TERRAIN});
        
		gmap = new OpenLayers.Layer.Google("Google Streets", {numZoomLevels: 20});

        ghyb = new OpenLayers.Layer.Google("Google Hybrid", {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20});
            
		gsat = new OpenLayers.Layer.Google("Google Satellite", {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22});
		
		var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

		pmLayer = new OpenLayers.Layer.WMS(
                    "Placemaker", "http://89.31.77.165/geoserver/divater/wms",
                    {
                        LAYERS: 'divater:pm_phase1',
                        STYLES: '',
                        format: 'image/png',
                        tiled: true,
                        transparent: true,
                        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom
                    },
                    {
                        buffer: 0,
                        displayOutsideMaxExtent: true,
                        isBaseLayer: false,
                        yx : {'EPSG:4326' : true}
                    } 
                );
      		
		vector = new OpenLayers.Layer.Vector("Elementi aggiunti");
		 var protocol = new OpenLayers.Protocol.WFS({
		        version: "1.0.0",
		        srsName: "EPSG:4326",
		        url:  "http://www.geovolution.it/placemaker/wfsProxy.php",
		        featureType: "pm_phase1",
		        featureNS: "http://89.31.77.165/",
		        geometry: "the_geom"
		    });
		    
		 wfsProtocol=new OpenLayers.Protocol.WFS({
	            url: "http://89.31.77.165/geoserver/wfs",
	            featureNS :  "http://89.31.77.165/",
	            featureType: "pm_phase1"
	        });
		 
		 
		var defStyle = {strokeColor: "blue", strokeOpacity: "0", strokeWidth: 1,fillColor: "blue", fillOpacity: "0", cursor: "pointer"};
		var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
		var sm = new OpenLayers.StyleMap({
	            'default': sty,
	            'select': {strokeColor: "red", fillColor: "red", fillOpacity: "0.7", strokeOpacity: "0.7"}
	        });
		 
		wfs = new OpenLayers.Layer.Vector("Selectable", {
		        strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
		        styleMap: sm,
		        projection: new OpenLayers.Projection("EPSG:4326"),
		        protocol: wfsProtocol
		    });

		layersLoaded['MapQuest OpenStreetMap']=false;
		layersLoaded['MapQuest Imagery']=false;
		layersLoaded['Google Physical']=false;
		layersLoaded['Google Streets']=false;
		layersLoaded['Google Hybrid']=false;
		layersLoaded['Google Satellite']=false;
		layersLoaded[vector.name]=false;
		addLayerToMap(mqosm, map);
		addLayerToMap(mqsat, map);
		addLayerToMap(osm, map);
		addLayerToMap(gmap, map);
		addLayerToMap(gphy, map);
		addLayerToMap(ghyb, map);
		addLayerToMap(gsat, map);
		addLayerToMap(vector, map);
		addLayerToMap(pmLayer, map);
		addLayerToMap(wfs, map);
		map.addControl(new OpenLayers.Control.MousePosition());
		
		map.setCenter(new OpenLayers.LonLat('12.5', '41.88').transform(WGS84, SphericMercator),11);

		selectControl=new OpenLayers.Control.SelectFeature(wfs, {
		   	 clickout: false, toggle: false,
		     multiple: false, hover: false,
		     toggleKey: "ctrlKey",
		     box: false
		    });
		 
		 
		 
		 	selectControl.events.register("featureunhighlighted", selectControl, function(e){
		 	});

		    wfs.events.on({
		        "featureselected": function(e) {
		        	selectedFeatures[e.feature.id]=e.feature;
		            gestSelected(e.feature);
		        }
		    });
		    
		    wfs.events.on({
		        "featureunselected": function(e) {
		            gestDeSelected(e.feature);
		        }
		    });
		    
		    vector.events.on({
		        "featureadded": function(e) {
		        	saveFeature(e.feature);
		        	 
		        }
		    });
		   	
		
		   
		
		actionSelect = Ext.create('GeoExt.Action', {
	        text: "<i class=\"fa fa-magic\"></i> select",
	        control:  selectControl,
	        map: map,
	        toggleGroup: "draw",
	        enableToggle: false,
	        group: "draw",
	        tooltip: "select feature"
	    });
		
		actionNav = Ext.create('GeoExt.Action', {
	        text: "<i class=\"fa fa-arrows\"></i> nav",
	        control: new OpenLayers.Control.Navigation(),
	        map: map,
	        toggleGroup: "draw",
	        allowDepress: false,
	        pressed: true,
	        tooltip: "navigate",
	        group: "draw",
	        checked: true
	    });
		
		 actionMaxExtent = Ext.create('GeoExt.Action', {
	         control: new OpenLayers.Control.ZoomToMaxExtent(),
	         map: map,
	         text: "<i class=\"fa  fa-arrows-alt \"></i> max extent",
	         tooltip: "zoom to max extent"
	     });
		 /*
		 actionDelete=Ext.create('Ext.Button', {
			    text: '<i class="fa fa-trash-o"></i> Elimina elementi selezionati',
			    tooltip: "Elimina gli elementi selezionati",
			    handler: function() {
			    	if (getSelectedFeaturesCount()==0) {
			    		alert("Nessun elemento selezionato!");
			    	}
			    	else deleteSelectedFeatures();
			    }
			});
		*/
		 
		 
		 var ctrl, toolbarItems = [], action, actions = {};

	     toolbarItems.push(Ext.create('Ext.button.Button', actionMaxExtent));
	     
	     toolbarItems.push(Ext.create('Ext.button.Button', actionNav));
	     
	     
	     toolbarItems.push(Ext.create('Ext.button.Button', actionSelect));
	     
	     infoBtn=Ext.create('Ext.Button', {
			    text: '<i class="fa fa-info"> </i> Open info panel',
			    renderTo: Ext.getBody(),
			    handler: function() {
			    	fs=false;
			    	for (var f in selectedFeatures) fs=true;
			    	if (fs) {
			    		if (Ext.getCmp("featInfo").collapsed) Ext.getCmp("featInfo").expand();
			    		else Ext.getCmp("featInfo").collapse();
			    	}else alert('Nessuna feature selezionata');
			    }
	     });
	     toolbarItems.push(infoBtn);
	     toolbarItems.push("-");
	     
	     
	     //toolbarItems.push(Ext.create('Ext.button.Button', actionDelete));
	     toolbarItems.push("-");
	     ctrl = new OpenLayers.Control.NavigationHistory();
	     map.addControl(ctrl);
	     actionPrev = Ext.create('GeoExt.Action', {
	            text: "previous",
	            control: ctrl.previous,
	            disabled: true,
	            tooltip: "previous in history"
	     });
	     actionNext = Ext.create('GeoExt.Action', {
	            text: "next",
	            control: ctrl.next,
	            disabled: true,
	            tooltip: "next in history"
	     });
		
	     toolbarItems.push(Ext.create('Ext.button.Button', actionPrev));
	     toolbarItems.push(Ext.create('Ext.button.Button', actionNext));
		 
	     toolbarItems.push("-");
		 //toolbarItems.push(btnMenu); 
	     
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
	     
	     drawMenu={
	                text: '<i class="fa fa-pencil"></i> Disegna',
	                menu: {
	                    xtype: 'menu',
	                    items: [
	                            Ext.create('Ext.button.Button', actionDrawPoint),
	                            Ext.create('Ext.button.Button', actionDrawLine),
	                            Ext.create('Ext.button.Button', actionDrawPoly)]
	                }
	     };
	     toolbarItems.push(drawMenu);
	     /*
	     edit = new OpenLayers.Control.ModifyFeature(wfs);
         map.addControl(edit);
	     
	     actionModify = Ext.create('GeoExt.Action', {
	         text: "<i class=\"fa fa-map-marker\"></i> point",
	         control: edit,
	         id: 'fase1-button-edit',
	         map: map,
	         tooltip: "Modify",
	         group: "Modify"
	     });
	     
	     toolbarItems.push(actionModify);
         */
         Ext.apply(me, {
            map: map,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: toolbarItems
            }]
        });
                
        me.callParent(arguments);
        
    }
});

