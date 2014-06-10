var json_customforms;

Ext.Ajax.request({
    url: 'proxy.php?url=http://89.31.77.165/ushahidi-v2/api',
	params: {task:'customforms',
			by:'all'},
    success: function(response){
        json_customforms = JSON.parse(response.responseText);
        num_customforms=json_customforms.contents.payload.customforms.length
    }
});