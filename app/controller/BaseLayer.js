Ext.define('PM.controller.BaseLayer', {
	extend:'Ext.app.Controller',
	//requires:['PM.view.Map'],
	init:function(){
          this.control({
               'panelFase1 > radiogroup': {
					'change':this.onRadioChange
				}
          });
    },
	
	onRadioChange:function(obj,value){
				map.layers.forEach(function(i){map.removeLayer(i)});
				console.log(map.projection);
				console.log(map.getExtent());
				switch (value.lb){
					case 'osm': map.addLayer(osm); break;
					case 'mqosm': map.addLayer(mqosm); break;
					case 'mqsat': map.addLayer(mqsat); break;
					case 'gsat': map.addLayer(gsat); break;
					case 'gmap': map.addLayer(gmap); break;
					case 'gphy': map.addLayer(gphy); break;
					case 'ghyb': map.addLayer(ghyb); break;
				
				}
		}
});