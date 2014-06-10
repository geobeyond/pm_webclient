Ext.define('PM.controller.MyController', {
	extend:'Ext.app.Controller',
	
	init:function(){
          this.control({
               'panelFase1 > radiogroup': {
					change:this.onButtonClick
				}
          });
    },
	
	onButtonClick:function(button, event, eOpts){
				this.application.fireEvent('sendTheClick');
		}
});