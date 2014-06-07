Ext.define('PM.controller.MySecondController', {
    extend:'Ext.app.Controller',
    
    init:function(){
    
        /*this.control({
        
        });*/
    
        this.application.on({
			sendTheClick:this.caughtTheClick,
			scope:this
        });
    },
	
	caughtTheClick:function(button, event, eOpts){
     console.log(button);
	 console.log(this);
	}

});