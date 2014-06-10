/**
 * Ext.Loader
 */

Ext.require([ 
    // We need to require this class, even though it is used by Ext.EventObjectImpl
    // see: http://www.sencha.com/forum/showthread.php?262124-Missed-(-)-dependency-reference-to-a-Ext.util.Point-in-Ext.EventObjectImpl
    'Ext.data.TreeStore',
    'Ext.util.Point',
    'Ext.Ajax',
	'Ext.form.field.*',
	'gxp.plugins.Tool',
]);

/**
 * PM.app
 * A MVC application demo that uses GeoExt and Ext components to display
 * geospatial data.
 */
Ext.application({
    name: 'PM',
    appFolder: 'app',
    autoCreateViewport: true,
    controllers: []

	});

/**
 * For dev purpose only
 */
var map, mqosm, mqsat, osm, gphy, gmap, ghyb, gsat;
var vectorPoi;
var vectorPol;