/**
 * The GeoExt.panel.Map used in the application.  Useful to define map options
 * and stuff.
 * @extends GeoExt.panel.Map
 */

OpenLayers.ProxyHost = "wfsProxy.php?url=";

var layersLoaded = new Object();
var map;
var selectControl;
var layers = new Object();
var wfs;
var wfsProtocol;

var actionDrawPoly;
var actionDrawPoint;
var actionDrawLine;


var pmLayer = null;
var selectedFeatures = new Object();

var feature = null;
var drawedFeature = null;
var savedFeature = null;

function saveFeature(f) {
    formReport = Ext.create('Ext.window.Window', {
        title: 'Salva',
        id: 'map-form-selected-window',
        height: 400,
        width: 600,
        padding: 15,
        autoScroll: true,
        layout: 'fit',
        items: [{
            xtype: 'form',
            id: 'map-submitForm',
            autoScroll: true,
            items: [{
                xtype: 'textfield',
                id: 'name',
                name: 'name',
                fieldLabel: 'Name'
            }, {
                xtype: 'textfield',
                id: 'description',
                name: 'description',
                fieldLabel: 'Descrizione'
            }, {
                xtype: 'textfield',
                id: 'maplabel',
                name: 'maplabel',
                fieldLabel: 'Label'
            }, {
                xtype: 'textfield',
                id: 'style',
                name: 'style',
                fieldLabel: 'style'
            }, {
                xtype: 'textfield',
                id: 'symbol_size',
                name: 'symbol_size',
                fieldLabel: 'Symbol Size'
            }, {
                xtype: 'textfield',
                id: 'title',
                name: 'title',
                fieldLabel: 'Title'
            }, {
                xtype: 'textfield',
                id: 'link',
                name: 'link',
                fieldLabel: 'Link'
            }]
        }],
        buttons: [{
            text: 'Annulla',
            handler: function() {
                Ext.getCmp('map-submitForm').getForm().reset();
                Ext.getCmp('map-form-selected-window').hide();
                f.destroy();
            }
        }, {
            text: 'Salva',
            disabled: false,
            handler: function() {
                var form = Ext.getCmp('map-submitForm').getForm();
                items = form.getFields().items;
                addLayerToMap(wfs, map);
                console.log("Aggiunta feature" + f.id + " on Vector Layer");
                feature = f.clone();

                for (i = 0; i < items.length; i++) {
                    if (items[i].name == 'name') {
                        feature.attributes.name = items[i].getValue();
                        feature.data.name = items[i].getValue();
                    }
                    if (items[i].name == 'description') {
                        feature.attributes.description = items[i].getValue();
                        feature.data.description = items[i].getValue();
                    }
                    if (items[i].name == 'maplabel') {
                        feature.attributes.maplabel = items[i].getValue();
                        feature.data.maplabel = items[i].getValue();
                    }
                    if (items[i].name == 'style') {
                        feature.attributes.style = items[i].getValue();
                        feature.data.style = items[i].getValue();
                    }
                    if (items[i].name == 'symbol_size') {
                        feature.attributes.symbol_size = items[i].getValue();
                        feature.data.symbol_size = items[i].getValue();
                    }
                    if (items[i].name == 'title') {
                        feature.attributes.title = items[i].getValue();
                        feature.data.title = items[i].getValue();
                    }
                    if (items[i].name == 'link') {
                        feature.attributes.link = items[i].getValue();
                        feature.data.link = items[i].getValue();
                    }
                }

                feature.state = OpenLayers.State.INSERT;
                //selectControl.select(feature);
                wfs.addFeatures([feature]);
                saveStrategy.save();
                //setTimeout("map.removeLayer(wfs);",500);
                savedFeature = feature;
                drawedFeature = f;
                setTimeout("uploadImages();", 500);
                console.log("Inviato!!!");
                Ext.getCmp('map-form-selected-window').hide();


            },
            success: function(data) {


            }
        }]
    }).show();
}

function deleteSelectedFeatures() {

    for (var f in selectedFeatures) {
        deleteFeature(selectedFeatures[f]);
    }
}

function uploadImages() {
    pmLayer.redraw(true);
    wfs.redraw();
    drawedFeature.fid = savedFeature.fid;
    new Ext.Window({
        title: "Upload images/video",
        width: 500,
        height: 300,
        layout: 'fit',
        items: [{
            xtype: "component",
            autoEl: {
                tag: "iframe",
                src: "fileUpload.php?fid=" + feature.fid
            }
        }]
    }).show();
}

function deleteFeature(feature) {

    delete selectedFeatures[feature.id];
    vector.removeFeatures(feature);
}


function getSelectedFeaturesCount() {
    var c = 0;
    for (var f in selectedFeatures) {
        c++;
    }
    return c;
}

var featurePanelOpened = false;

function clearSelectedFeatures() {
    featurePanelOpened = false;
    selectedFeatures = new Object();
}

function gestDeSelected(feature) {
    if (Ext.getCmp("fid-panel-" + feature.fid)) Ext.getCmp("fid-panel-" + feature.fid).destroy();
    for (var f in selectedFeatures) {
        if (f == feature.name) {
            delete selectedFeature[f];
        }
    }
}

function gestSelected(feature) {
    if (!featurePanelOpened) {
        Ext.getCmp("featInfo").expand();
        featurePanelOpened = true;
    }
    item = {
        id: 'fid-panel-' + feature.fid,
        xtype: 'panel',
        title: '<i class="fa fa-folder-open"></i>' + feature.data.title
    };

    addItemToFieldset("featInfo", item);
    Ext.Ajax.request({
        url: 'getMedia.php',
        params: {
            fid: feature.fid
        },
        callback: function(options, success, response) {
            console.log("sono qui!");
            var json = Ext.decode(response.responseText);
            images = json.images;
            videos = json.videos;
            for (i = 0; i < images.length; i++) {
                var img = Ext.create('Ext.Img', {
                    src: images[i].thumb,
                    title: images[i].name,
                    listeners: {
                        el: {
                            click: function(a, b, c) {
                                if (Ext.getCmp("photo-view")) {
                                    Ext.getCmp("photo-view").destroy();
                                }
                                var imgGreat = Ext.create('Ext.Img', {
                                    src: 'images/' + feature.fid + "/" + b.title
                                });
                                formReport = Ext.create('Ext.window.Window', {
                                    title: 'Image',
                                    id: 'photo-view',
                                    height: 400,
                                    width: 600,
                                    padding: 15,
                                    autoScroll: true,
                                    layout: 'fit',
                                    items: [imgGreat]
                                }).show();
                            }
                        }
                    }
                });
                addItemToFieldset("fid-panel-" + feature.fid, img);
            }
        }
    });
}


function addLayerToMap(layer, map) {
    if (Ext.getCmp('fase1-button-poly')) {
        Ext.getCmp('fase1-button-poly').disabled = true;
    }
    layersLoaded[layer.name] = false;
    layers[layer.name] = layer;
    layer.events.register("loadend", layer, function(e, layer) {
        layerAddedEvent(this);
    });
    layer.events.register("added", layer, function(e, layer) {
        layerAddedEvent(this);
    });
    map.addLayer(layer);

}
var layerStore;
var map;
var saveStrategy = new OpenLayers.Strategy.Save();


function layerAddedEvent(layer) {
    layersLoaded[layer.name] = true;
    if (checkAllLayersLoaded()) {
        if (buttonsDrawable) drawButtons();
    }
}

function checkAllLayersLoaded() {
    loaded = true;
    for (var k in layersLoaded) {
        if (!layersLoaded[k]) {

            loaded = false;
        }
    };
    return loaded;
}


Ext.define('PM.view.Map', {
    // Ext.panel.Panel-specific options:
    extend: 'GeoExt.panel.Map',
    alias: 'widget.pm_mappanel',
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

        mqosm = new OpenLayers.Layer.XYZ("MapQuest OpenStreetMap", ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
            "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
            "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
            "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png"
        ], {
            sphericalMercator: true,
            isBaseLayer: true
        });

        mqsat = new OpenLayers.Layer.XYZ("MapQuest Imagery", ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
            "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
            "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
            "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"
        ], {
            sphericalMercator: true
        });

        osm = new OpenLayers.Layer.XYZ("OpenStreetMap", ["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png",
            "http://d.tile.openstreetmap.org/${z}/${x}/${y}.png"
        ], {
            sphericalMercator: true
        });

        gphy = new OpenLayers.Layer.Google("Google Physical", {
            type: google.maps.MapTypeId.TERRAIN
        });

        gmap = new OpenLayers.Layer.Google("Google Streets", {
            numZoomLevels: 20
        });

        ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
            type: google.maps.MapTypeId.HYBRID,
            numZoomLevels: 20
        });

        gsat = new OpenLayers.Layer.Google("Google Satellite", {
            type: google.maps.MapTypeId.SATELLITE,
            numZoomLevels: 22
        });

        var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

        pmLayer = new OpenLayers.Layer.WMS(
            "Placemaker", "http://89.31.77.165/geoserver/divater/wms", {
                LAYERS: 'divater:pm_phase1',
                STYLES: '',
                format: 'image/png',
                tiled: true,
                transparent: true,
                tilesOrigin: map.maxExtent.left + ',' + map.maxExtent.bottom
            }, {
                buffer: 0,
                displayOutsideMaxExtent: true,
                isBaseLayer: false,
                yx: {
                    'EPSG:4326': true
                }
            }
        );

        vector = new OpenLayers.Layer.Vector("Elementi aggiunti");
        var protocol = new OpenLayers.Protocol.WFS({
            version: "1.0.0",
            srsName: "EPSG:4326",
            url: "wfsProxy.php",
            featureType: "pm_phase1",
            featureNS: "http://89.31.77.165/",
            geometry: "the_geom"
        });

        wfsProtocol = new OpenLayers.Protocol.WFS({
            url: "http://89.31.77.165/geoserver/wfs",
            featureNS: "http://89.31.77.165/",
            featureType: "pm_phase1"
        });


        var defStyle = {
            strokeColor: "blue",
            strokeOpacity: "0",
            strokeWidth: 1,
            fillColor: "blue",
            fillOpacity: "0",
            cursor: "pointer"
        };
        var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
        var sm = new OpenLayers.StyleMap({
            'default': sty,
            'select': {
                strokeColor: "red",
                fillColor: "red",
                fillOpacity: "0.7",
                strokeOpacity: "0.7"
            }
        });

        wfs = new OpenLayers.Layer.Vector("Selectable", {
            strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
            styleMap: sm,
            projection: new OpenLayers.Projection("EPSG:4326"),
            protocol: wfsProtocol
        });

        //addLayerToMap(wfs, map);

        layersLoaded['MapQuest OpenStreetMap'] = false;
        layersLoaded['MapQuest Imagery'] = false;
        layersLoaded['Google Physical'] = false;
        layersLoaded['Google Streets'] = false;
        layersLoaded['Google Hybrid'] = false;
        layersLoaded['Google Satellite'] = false;
        layersLoaded[vector.name] = false;
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

        map.setCenter(new OpenLayers.LonLat('12.5', '41.88').transform(WGS84, SphericMercator), 11);

        selectControl = new OpenLayers.Control.SelectFeature(wfs, {
            clickout: false,
            toggle: false,
            multiple: false,
            hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey", // shift key adds to selection
            box: true
        });



        selectControl.events.register("featureunhighlighted", selectControl, function(e) {
            console.log("featureunhighlighted");
            console.log(e);
        });

        selectControl.events.register("boxselectionend", selectControl, function(e) {
            console.log("boxselectionend");
        });
        selectControl.events.register("boxselectionstart", selectControl, function(e) {
            console.log("boxselectionend");
            clearSelectedFeatures();
        });
        wfs.events.on({
            "featureselected": function(e) {
                selectedFeatures[e.feature.id] = e.feature;
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
            control: selectControl,
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

        actionDelete = Ext.create('Ext.Button', {
            text: '<i class="fa fa-trash-o"></i> Elimina elementi selezionati',
            tooltip: "Elimina gli elementi selezionati",
            handler: function() {
                if (getSelectedFeaturesCount() == 0) {
                    alert("Nessun elemento selezionato!");
                } else deleteSelectedFeatures();
            }
        });



        var ctrl, toolbarItems = [],
            action, actions = {};

        toolbarItems.push(Ext.create('Ext.button.Button', actionMaxExtent));

        toolbarItems.push(Ext.create('Ext.button.Button', actionNav));


        toolbarItems.push(Ext.create('Ext.button.Button', actionSelect));
        toolbarItems.push("-");


        toolbarItems.push(Ext.create('Ext.button.Button', actionDelete));
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

        drawMenu = {
            text: '<i class="fa fa-pencil"></i> Disegna',
            menu: {
                xtype: 'menu',
                items: [
                    Ext.create('Ext.button.Button', actionDrawPoint),
                    Ext.create('Ext.button.Button', actionDrawLine),
                    Ext.create('Ext.button.Button', actionDrawPoly)
                ]
            }
        };
        toolbarItems.push(drawMenu);

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