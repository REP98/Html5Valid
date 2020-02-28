/*!
 * Html5 Validacion  de Formulario
 * version: 2
 * Copyright 2018
 * Licensed MIT
 */
( (jQuery) => {
	'use strict';
	var $ = jQuery;

	if (typeof jQuery === 'undefined') {
		throw new Error('Html5Valid JavaScript requires jQuery');
	}
	$.isString = function (value){
		return value !== undefined && typeof value === 'string';
	}
	$.isUndefined = function (r){
		return (r === undefined || typeof r === undefined || r === 'undefined'); 
	}
	$.isNull = function (r){
		return (r === null || typeof r === null || r === 'null'); 
	}
	$.isBool = function (value){
		return value !== undefined && typeof value === 'boolean';
	}
	$.uniqId = function (prefix) {
		var d = new Date().getTime();
        var uuid = '6xx-yxx-4xxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return prefix+"-"+uuid;
    }

	$.cleanData = (function (orig) {
		return function (elems) {
			var events, elem, i;
			for (i = 0; (elem = elems[i]) != null; i++) {
				try {

					// Only trigger remove when necessary to save time
					events = $._data(elem, "events");
					if (events && events.remove) {
						$(elem).triggerHandler("remove");
					}

					// http://bugs.$.com/ticket/8235
				} catch (e) {
				}
			}
			orig(elems);
		};
	})($.cleanData);

	var die = (msj) => {
		throw new Error(msj);
		return false;
	}

	var Help = {
		options:{
			cls:'',
			text:'',
			icons:''
		},
		init:function(el,options){
			this.elem = el;
			this.element = $(this.elem);
			this.options = $.extend({}, this.options, options);
			this._create();
			
			return this;
		},
		_create:function(){
			var e = this.element, o = this.options,
			help = $('<span>').addClass('help');
			help.addClass(o.cls);
			let text = (o.text.indexOf('<') > -1)?$(text):$('<span>'), icons = "";
				text.addClass('help-text');
				text.html(o.text);
			if(o.icons != ""){
				if(o.icons.indexOf('<') > -1){
					icons = $(o.icons);
				}else{
					icons = $('<i>');
					icons.addClass(o.icons);
				}
				icons.addClass('help-icons');
				icons.appendTo(help);
				text.appendTo(help);
			}else{
				help.appendTo(text);
			}
			help.insertAfter(e);
			this.help = help;
			this.help.fadeIn();
			e.blur(function(event) {
				if(this.validity.valid){
					help.fadeOut(function(){
						help.remove();
					})
				}
			});
		},
		setText:function(newText = "", icons = ""){
			var d = this.element.data('help');
			if($.isNull(d) && $.isUndefined(d)){
				let help = d.help, text = help.find('help-text'),
				icon = help.find('help-icons');
				if(newText != true && newText != ""){
					text.html(newText);
				}
				if(icon.length > 0 && icons != true && icons != ""){
					var clsOld = icon.attr('class');
					icon.removeClass(clsOld).addClass('help-icons').addClass(icons);
				}
				this.element.data('help', $.extend({}, d, {help:help}) );
				return d;
			}
		},
		setStyle:function(cls){
			var d = this.element.data('help');
			if($.isNull(d) && $.isUndefined(d)){
				var clsOld = d.help.attr('class');
				d.help.removeClass(clsOld).addClass('help');
				if($.isString(cls)){
					d.help.addClass(cls);
				}else{
					let help = d.help, text = help.find('help-text'),
					icon = help.find('help-icons');
					help.addClass(cls.help);
					text.removeClass( text.attr('class') ).addClass('help-text').addClass(cls.text);
					if(icon.length > 0){
						icon.removeClass( icon.attr('class') ).addClass('help-icons').addClass(cls.icons);
					}
					d.help = help;
				}

				this.element.data('help', $.extend({}, d, {help:help}) );
				return d;
			}
		}
	};

	var Notice = {
		options:{
			text:'',
			cls:'',
			icons:'',
			duration:5000,
			onEscClickClose:true,
		},
		isMovil:function(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ?
					   true: false;
		},
		init:function(options){
			this.options = $.extend({}, this.options, options);
			this._create();
			return this;
		},
		_media:function(){
			var nt = this.notice, that = this;
			var mql = function(m){
				if(m <= 768){
					nt.removeClass('notice').addClass('toasts');
				}else{
					nt.removeClass('toasts').addClass('notice');
				}
				that.open();
			};
			$(window).on('resize.notice',function(){
				var w = $(window).outerWidth();
				mql(w)
			})
		},
		_createIcons: function(){
			var ico = this.options.icons, icons;
			if(ico.indexOf('<') > -1){
				icons = ico;
			}else if(ico != ''){
				icons = $('<i>').addClass(ico);
			}
			return icons;
		},
		_create:function(){
			var that = this, o = this.options;
			this._createNotice();
			if(this.isMovil()){
				this.notice.on('touchstart.notice mouseenter.notice',function(){
					that.close($(this));
				})
			}else{
				$(document).on('keydown.noctice',(ev) => {
					console.log(ev)
					if(ev.keyCode == 27){
						this.close()
					}
				});
			}
			this.notice.data('notice', this);
			this._media();
			this.open(this.notice);
		},
		_createNotice:function(){
			var o = this.options, notice = $('<div>'),
				that = this,
				icons = $('<i>'),
				text = $('<span>'),
				x = $('<span>');

			if(this.isMovil()){
				notice.attr('id', $.uniqId('toasts')).addClass('toasts').addClass(o.cls);
			}else{
				notice.attr('id', $.uniqId('notice')).addClass('notice').addClass(o.cls);
			}
			x.addClass('notice-btn-close');
			x.html('&times;')
			x.appendTo(notice);
			icons = this._createIcons();
			if(!$.isUndefined(icons)){
				icons.addClass('notice-icons');
				icons.appendTo(notice);
			}
			text.addClass('notice-text');
			text.html(o.text);
			text.appendTo(notice);

			x.on('click',function(e){
				let notice = $(this).parent();
				that.close(notice);
			})
			notice.appendTo('body');
			this.notice = notice;

		},
		close:function(nt){
			var notice = nt || this.notice, d = notice.data('notice'),
			duration = d.options.duration || this.options.duration; 
			if(this.isMovil()){
				notice.fadeOut(function() {
					notice.remove();
				});
			}else{
				notice.css('display','block');
				notice.animate({
					top:'100%',
					opacity:0,
				},function(){
					notice.remove();
				})
			}
		},
		open:function(nt){
			var notice = nt || this.notice, d = notice.data('notice'),
			duration = d.options.duration || this.options.duration; 
			if(this.isMovil()){
				notice.fadeIn();
			}else{
				notice.css('display','block');
				notice.animate({
					top:'0px',
					opacity:1,
				});
				setTimeout(()=>{ this.close(notice); },duration);
			}
		}
	};
	var HV = {
		version: 2.0,
		option:{
			novalidate: true,
			allRequired:false,
			cls:'',
			clsValid:'',
			clsInvalid:'',
			online:false,
			event:'submit',
			addClsRequired:true,
			xhr:{},
			showTypeError:'help',//notice || help
			rule:{
				valido:'Formulario Valido',
				invalido:'Formulario Invalido',
				xhrError:'Error al enviar formulario',
				text:"Por favor ingrese un texto valido",
				email:'Ingrese una direccion de Correo valido',
				url:'Ingrese una Url valida',
				tel:'Ingrese un n&uacute;mero de tel&eacute;fono validos',
				number:'Este campo solo acepta numeros',
				color:'Campo de para colores',
				date:'Ingrese una fecha valida',
				datetime:'Ingrese una fecha y hora validas',
				time:'Ingrese una hora valida',
				seach:'Ingrese un texto valido',
				password:'Ingrese una Contraseña valida',
				equalTo:'No concuerdan las contraseñas',
				different:'Son identicas',
				ip:'IP invalida',
				decimal:'No es un decimal Valido',
				required:'Elemento Requerido'
			},
			onError:(jqXHR, textStatus, error)=>{},
			onSuccess:(data,textStatus, jqXHR)=>{},
			//Options Plugis exta
			help:{
				text:'',
				icons:'fa fa-times',
				cls:'help-invalid'
			},
			notice:{
				text:'',
				cls:'dange',
				icons:'fa fa-times',
				duration:5000,
				onEscClickClose:true,
			}
		},
		optionsInput:{
			typeValid:null,
			online:false,
			message:'',
			required:false
		},
		init:function(){
			this.widgets = $('[data-role*="html5valid"]');
			this.observer();
			this.element = null;
			this.xhrs = {};
			this.options = {};
			this.loadElement();
			return this;
		},
		observer:function(){
			var observer, observerCallback,
				observerConfig = {
				childList: true,
				attributes: true,
				subtree: true,
				characterData: false,
				attributeOldValue: false,
				characterDataOldValue: false
			};
			observerCallback = function(mutations){
				mutations.map(function(mutation){
					
					if (mutation.type === 'attributes' && mutation.attributeName !== "data-role") {
						let element = $(mutation.target);
						let attr = mutation.attributeName;
						let data = element.data();
						if(data.hasOwnProperty('hv')){
						 	let hv = data.hv,
						 		observerAtt = {
						 		'data-novalidate':hv.novalidate,
						 		'data-all-required':hv.allRequired,
						 		'data-xhr':hv.xhr
						 	};
						 	if(observerAtt.hasOwnProperty(attr)){
						 		observerAtt[attr].call(hv, element.attr(attr) );
						 	}
						}
					} else  {
						//console.log("Mutation",mutation);
					}
				});
			};
			observer = new MutationObserver(observerCallback);
			observer.observe($("html")[0], observerConfig);
		},
		loadElement:function(o){
			this.widgets.each((i,el)=> {
				let d = $(el).data("hv");
				if( !$.isNull(d) && !$.isUndefined(d) && !$.isUndefined(o)  ){
					let key = Object.keys(o);
					$.each(key, function(index, k) {
						if(d.hasOwnProperty(k)){
							d[k] = o[k];
						}
					});
				}else{
					this._create($(el));
					$(el).data("hv", this);
				}
			});
		},
		_setFromData:function(op, inputs = false){
			var o = {}, obj = ['xhr','rule','help','notice'], fn = ['onError', 'onSuccess'];
			$.each(op, function(key, value){
				try {
					if($.inArray(key,obj) != -1){
						o[key]= eval("("+value+")");
					}
					else if($.inArray(key,fn) != -1){
						if (typeof window[value] === 'function') {
							o[key] = window[value];
						} else {
							var result = eval("(function(){"+value+"})");
							o[key] = result
						}
					}
					else{
						o[key] = JSON.parse(value);
					}
				} catch (e) {
					o[key] = value;
				}
			});
			if(inputs){
				this.optionsInputs = $.extend({}, this.optionsInput, o);
			}else{
				this.options = $.extend({}, this.option, o);
			}
		},
		funcs: { 
			//Atributos
			required: function(val,el){
				var t = el.attr('type');
				switch(t){
					case 'checkbox' : return el.is(":checked"); break;
					case 'radio':
						var n = el.attr('name');
						var f = el.parents("form");
						var c = f.find('input[type=radio][name="'+ n +'"]:checked').length;
						return c === 1;
					break;
					case 'select-multiple': return val.trim() != null; break;
					default :return val.trim() !== ""; 
				}
			},
			minlength: function(val, len){
				if (len == undefined || isNaN(len) || len <= 0) {
					return false;
				}
				return val.trim().length >= len;
			},
			maxlength: function(val, len){
				if (len == undefined || isNaN(len) || len <= 0) {
					return false;
				}
				return val.trim().length <= len;
			},
			min: function(val, min_value){

				if (min_value == undefined || isNaN(min_value)) {
					return false;
				}
				if (!this.number(val)) {
					return false;
				}
				if (isNaN(val)) {
					return false;
				}
				return Number(val) >= Number(min_value);
			},
			max: function(val, max_value){
				if (max_value == undefined || isNaN(max_value)) {
					return false;
				}
				if (!this.number(val)) {
					return false;
				}
				if (isNaN(val)) {
					return false;
				}
				return Number(val) <= Number(max_value);
			},
			pattern: function(val, pat){
				if (pat == undefined) {
					return false;
				}
				var reg = new RegExp(pat);
				return reg.test(val);
			},
			//Tipos
			email: function(val){
				return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(val);
			},
			url: function(val){
				return /^(?:[a-z]+:)?\/\//i.test(val);
			},
			date: function(val){
				return !!(new Date(val) !== "Invalid Date" && !isNaN(new Date(val)));
			},
			number: function(val){
				return (val - 0) == val && (''+val).trim().length > 0;
			},
			number: function(val){
				return /^\d+$/.test(val);
			},
			color: function(val){
				return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
			},
			date: function(val){
				return /^\d{4}-(0[0-9]|1[0,1,2])-([0,1,2][0-9]|3[0,1])$/i.test(val);
			},
			time: function(val){
				return /^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/i.test(val);
			},
			tel: function(val){
				return /^\d+$/.test(val);
			},
			//Otros
			decimal:function(val){
				return /^([0-9]{0,3}(\,|\.){0,1}){0,2}[0-9]{1,3}(\,[0-9]{2}|\.[0-9]{2}){0,1}$/.test(val);
			},
			ip:function(val){
				return /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/i.test(val);
			},
			equalTo:function(val,el){
				var n = el.attr("name");
				var f = el.parents("form")
				return $(f+'input[name="'+ n +'"]').val() === val;
			},
			different: function(val, otro){
				var n = el.attr("name");
				var f = el.parents("form")
				return $(f+'input[name="'+ n +'"]').val() !== val;
			}
		},
		_create:function(w){
			this.element = w;
			this._setFromData(w.data());
			var o = this.options;
			this._manager();
			this.novalidate(o.novalidate);
			this.allRequired(o.allRequired);
			this.element.addClass('hv').addClass(o.cls);
			if(o.addClsRequired){
				this.element.addClass('required');
			}
			
			if(o.online == true){
				this.element.find(':input').not(':submit').each((index, el)=> {
					this._online($(el));
				});
			}
		},

		_manager:function(){
			var e = this.element, o = this.options, input = e.find(":input").not(":submit"),
				oi = {};
				input.each((index, el)=> {
					let d = $(el).data();
					if(!$.isNull(d) && !$.isUndefined(d)){
						this._setFromData(d, true);
						$(el).data('hv-options', this.optionsInputs);
					}
				});
				var typeValid = e.find('[data-type-valid]'), that = this;
				typeValid.on('focus',function(){});

				input.each((index, el)=> {
					let d = $(el).data('hv-options'),
						required = $(el).data('required') || $(el).attr('required')

					if(!$.isUndefined(d) && !$.isNull(d)){
						if(d.online){
							this._online($(el));
						}
					}
					if(d.required){el.required = true; }
				});
				if(o.event != "submit"){
					e.find('[data-event="'+o.event+'"]').on(o.event, 
						function(ev){ ev.preventDefault(); that.send(ev,$(this)); })
				}
				else{
					e.on(o.event,function(ev){ ev.preventDefault(); that.send(ev,$(this)); })
					 .on('invalid', function(ev){
					 	$(this).addClass(o.clsInvalid);
					 	o.onError.call(this,ev.target,o.rule.invalid);
					 })
				}
		},
		__showMsj:function(e){
			var o = e.data('hv-options'), op = this.options,
			msj = e.data('message') || o.message, rule = op.rule;
			if(msj == ""){ msj = rule[e.attr('type')]; }
			e.focus();
			switch (op.showTypeError) {
				case 'help':
					let help = {
						text:msj
					};
					e.help( $.extend({}, op.help, help) );
				break;
				case 'notice':
					let notice = {
						text:msj
					};
					$.notice($.extend({}, op.notice, notice))
				break;
			}

		},
		_online:function(e){
			var that = this, d = e.data('hv-options'), type = e.attr('type'), select = e.is('select');
			if(select){
				e.on('input change',function(ev){
					if(this.required){
						let valid = that.funcs.required($(this).val(),$(this));
						if(!valid){ that._showMsj($(this)); }
					}
				})
			}else if(type == 'radio' || type == 'checkbox'){
				e.on("input click",function(e){
					if(this.required){
						let valid = self.funcs.required("",$(this));
						if(!valid){ self._showMsj($(this)) }
					}
				})
			}else{
				e.on("input",function(e){
					let yo = $(this);
					let v = yo.val();
					let t = yo.attr("type");
					let f = that.funcs;
					let valid = true;
					if(t in f){	f[t](v,yo); }
					$.each(f,function(fn,n){
						if(yo.attr(fn) && fn != "required"){
							valid = f[fn](v,yo.attr(fn));
						}
					})
					if(this.required){
						valid = f.required(v,yo);
					}
					if(!valid){
						self._showMsj(yo);
					}
					return valid;
				})
			}
		},

		send:function(ev, e){
			var that = this, op = this.options, valid = true,
				inputs = e.find(":input").not(":submit"),
				submit = e.find(':submit'),
				result = 0, i = 0, l = inputs.length,
				funcs = this.funcs;
			do{
				let elem = inputs[i],
					el = $(elem),
					o = el.data('hv-options'),
					msj = (o.message == "")? op.rule[ el.attr('type') ]: o.message,
					fn = [], arg = [];
				if(el.attr("required") || o.required){
					valid = funcs.required(el.val(), el);
					msj = (!valid)? op.rule.required: msj;
				}
				if(!$.isNull(o.typeValid)){
					let fns = ($.isString(o.typeValid))?String(o.typeValid).split(','):o.typeValid,
						e = 0;
						fns = ($.isArray(fns))?fns:[fns];
					
					$.each(fns, function(i, val) {
						let fn_name = $.trim(fns[i]);
						let value = el.attr(fn_name);
						fn[i] = fn_name;
						arg[i] = value;
					});
					for(let j in fn){
						if(!valid) break;
						let fname = fn[j],
							im = ['require','equalTo', 'different'];
							e = j;
						let _arg = (!$.isUndefined(arg[e]))?arg[e]:false;
						if($.inArray(fname, im) > -1){ _arg = el; }
						valid = funcs[fname.trim()](el.val(), _arg);
						msj =  op.rule[fname] || msj;
					}
				}else{
					for(let f in funcs){
						if(!valid) break;
						let t = el.attr('type'),
							dos = ['minlength','maxlength', 'min', 'max','pattern'],
							im = ['required','equalTo', 'different'], sv,
							v = el.val();
						if($.inArray(f, dos) > -1){	sv = el.attr(f); }
						else if($.inArray(f, im) > -1) {	sv = el; }
						if(!$.isNull(el.attr(f)) && !$.isUndefined(el.attr(f))){
							valid = funcs[f.trim()](v,sv);
						}
						if(t == f){ valid = funcs[t.trim()](v,sv); }
						msj = (!valid)? op.rule[f] : msj;
					}
				}
				if(msj != ""){
					elem.setCustomValidity = msj;
				}
				el.data('hv-options', $.extend({}, o, {message:msj}));
				if(!valid){
					if($.isFunction(o.onError)){
						o.onError.call(e,el,msj);
					}
					that.__showMsj(el);
					e.addClass(o.clsInvalid);
					el.focus();
					return false;
				}
				result += !valid ? 1 : 0;
				i++;
			}while(i < l);
			if(valid){
				e.removeClass(op.clsInvalid).addClass(op.clsValid);
				this.xhr(op.xhr);
				if(op.xhr && !$.isUndefined(op.xhr)){ $.ajax(this.xhrs); }
				else{ op.onSuccess.call(this, e, op.rule.valido); }
			}
			if(result !== 0){ return false }
			return valid;
		},

		novalidate:function(nv){
			if(nv){ this.element.attr('novalidate','novalidate'); }
			else{ this.element.removeAttr('novalidate'); }
		},

		allRequired:function(ar){
			this.element.find(":input").not(":submit").each(function() {
				let d = $(this).data('hv-options');
				if(ar){
					this.required = true;
				}
				else if($(this).data('required') == "true" || d.required == true){
					this.required = true;
				}else{
					this.required = false;
				}
			});
		},
		xhr:function(options){
			if(options != false){
				var e = this.element;
				this.xhrs = $.extend({}, this.options.xhr, options);
				this.xhrs.type = e.attr("method") || "GET";
				this.xhrs.url = e.attr("action") || location.href;
				this.xhrs.error = (jqXHR, textStatus, error)=>{
					this.options.onError.call(this,e,this.options.rule.xhrError, {
						jqXHR:jqXHR,
						code:textStatus,
						error: error
					});
				}
				this.xhrs.success = (data,textStatus, jqXHR) => {
					this.options.onSuccess.call(this,data,textStatus,jqXHR);
				}
				this.xhrs.data = e.formval();
				return this.xhrs;
			}else{
				return {};
			}
		}

	};
	$.fn.formval = function(){
		var forms = this, elemvalue = {};
		this.getatt = function(el){
			if($.isUndefined(el.attr('id')) && $.isUndefined(el.attr("name"))){
				let newid = $.uniqId('fv');
				el.attr('id',newid);
				return newid;				
			}else{
				return el.attr("name") || el.attr('id');
			}
		}
		forms.each(function(){
			let form = $(this);
			let item = form.find(":input").not(":submit");
			let elements = {};
			$.each(item,function(){
				let el = $(this);
				let e = forms.getatt(el);
				let v = el.val();
				if(this.type == "checkbox" || this.type == 'radio'){
					if(this.checked){
						elements[e] = v;
					}
				}else{
					elements[e] = v;
				}
			})
			elemvalue[forms.getatt(form)] = elements;
		});
		return elemvalue;
	};

	$.fn.help = function(options, value, icons){
		return this.each(function() {
			var d = $(this).data('help');
			if($.isUndefined(d) || $.isNull(d)){
				$(this).data('help', Help.init(this,options) );
			}else{
				if(d.hasOwnProperty(options) && options.indexOf("_") == -1){
					d[options](value, icons);
				}
			}
		});
	}

	$.notice = function(options){
		return Notice.init(options);
	}
	window.HV = HV;
	return HV.init();
})(jQuery);

