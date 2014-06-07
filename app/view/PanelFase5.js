Ext.define('PM.view.PanelFase5', {
    
	extend: 'Ext.panel.Panel',
    alias : 'widget.panelFase5',
    requires: [],
	title: 'Fase 5',
	//title: '<i class="fa fa-gears"></i> Processo WFS',
	bodyPadding: 5,
	width: 200,
		items: [{
			html:'<li>Tale fase può essere anche non presente nella GUI ed implicitamente effettuata con i bottoni che abilitano la tematizzazione e gli stili della legenda nelle fasi precedenti</li><li>Nel caso sia presente allora andrà deciso se disabilitare i bottoni degli stili nelle toolbar delle fasi precedenti</li>'
		}]
	});