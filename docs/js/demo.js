(function(){
	var Demo = {
		 cleanPreCode: function(selector){
		 	var selector = (typeof selector === 'string')?document.querySelectorAll(selector):selector;
	        var els = Array.prototype.slice.call(selector, 0);
	        if(els.length > 0){
		        els.forEach(function(el){
		            var txt = el.textContent
		                .replace(/^[\r\n]+/, "")	// strip leading newline
		                .replace(/\s+$/g, "");
		            if (/^\S/gm.test(txt)) {
		                el.textContent = txt;
		               // return;
		            }

		            var mat, str, re = /^[\t ]+/gm, len, min = 1e3;

		            while (mat = re.exec(txt)) {
		                len = mat[0].length;

		                if (len < min) {
		                    min = len;
		                    str = mat[0];
		                }
		            }

		            if (min === 1e3)
		                return;

		            el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "");
		        });
			}
	    },
	    htmlPre:function(code,pre){
	    	var code = (typeof code === 'string')?document.querySelector(code):code;
	    	var pre = (typeof pre === 'string')?document.querySelector(pre): pre;
	    	var string = code.outerHTML;
	    		string = string.replace(new RegExp("<", 'gm'), "&lt;");
	    		string = string.replace(new RegExp(">", 'gm'), "&gt;");
	    	pre.innerHTML = '<code>'+string+'</code>';
	    	setTimeout(function(){
	    		Demo.cleanPreCode(pre);
	    	}, 50);
	    }
	};

	window.Demo = Demo;
	//Demo.cleanPreCode('pre code');

	return Demo;

})()
$(function(){
	$("#help-example").click(function(event) {
		$(this).help({
			text:'Soy un msj de Ayuda',
			cls:'alert alert-primary',
			icons:'fa fa-info-circle'
		})
	});
	$("#notice-example").click(function(event) {
		$.notice({
			text:'Soy una noticificación',
			cls:'primary',
			icons:'fa fa-flag'
		})
	});

	$('pre').each(function() {
		let d = $(this).data('content');
		if(d !== null && d != undefined){
			Demo.htmlPre(d,this);
			$(this).find('code').addClass('language-'+$(this).data('lang'))
		}
	});

	Demo.cleanPreCode('pre code');
})