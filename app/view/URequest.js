Ext.Ajax.request({
    url: 'proxy.php?url=http://89.31.77.165/ushahidi-v2/api',
	params: {task:'customforms',
			by:'meta',
			formid:'2'},
    success: function(response){
        var text = response.responseText;
        console.log(text)
    }
});