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

	var HV = {
		version: 2.0,
		options:{
			novalidate: true,
			allRequired:false,
			cls:'hv',
			clsValid:'hv-valid',
			clsInvalid:'hv-invalid',
			online:false,
			event:'submit',
			addClsRequired:true,
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
			onError:(el,text)=>{}
		},
		optionsInputs:{
			typeValid:null,
			online:false,
			message:'',
			required:false
		},
		init:function(){
			this.widgets = $('[data-role*="html5valid"]');
			this.observer();

			this.loadElement();
			return this;
		},
		observer:function(){
			var observer, observerOptions, fnobserver;

			observerOptions = {
				'childList': true,
				'subtree': true
			};
			fnobserver = function(mutations){
				mutations.map(function(record){

					if (record.addedNodes) {

						var obj, widgets, plugins;

						for(var i = 0, l = record.addedNodes.length; i < l; i++) {
							obj = $(record.addedNodes[i]);

							plugins = obj.find('[data-role*="html5valid"]');
							console.log('observer',obj,plugins);
							/*if (obj.data('role') !== undefined) {
								widgets = $.merge(plugins, obj);
							} else {
								widgets = plugins;
							}

							if (widgets.length) {
								$.hv.loadwidget(widgets);
							}*/
						}
					}
				});
			};
			observer = new MutationObserver(fnobserver);
			observer.observe(document, observerOptions); 
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
			var o = {};
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
						o[key] = $.parseJSON(value);
					}
				} catch (e) {
					o[key] = value;
				}
			});
			if(inputs){
				this.optionsInputs = $.extend({}, this.optionsInputs, o);
			}else{
				this.options = $.extend({}, this.options, o);
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
			this.novalidate(o.novalidate);
			this.allRequired(o.allRequired);
			this.element.addClass(o.cls).addClass(o.clsValid).addClass(o.clsInvalid);
			if(o.addClsRequired){
				this.element.addClass('required');
			}
			this._manager();
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
					let d = $(el).data('hv-options');
					if(!$.isUndefined(d) && !$.isNull(d)){
						if(d.online){
							this._online($(el));
						}
					}
				});
				if(o.event != "submit"){
					e.find('[data-event="'+o.event+'"]').on(event, function(ev){
						ev.preventDefault();
						that.send(ev);
					})
				}
				else{
					e.on(o.event,function(ev){ ev.preventDefault(); that.send(ev); })
					 .on('invalid', function(ev){
					 	$(this).addClass(o.clsInvalid);
					 	o.onError.call(this,ev.target,o.rule.invalid);
					 })
				}
		},
		__showMsj:function(e){
			console.log("INVALID",e);
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
				el.on("input click",function(e){
					if(this.required){
						let valid = self.funcs.required("",$(this));
						if(!valid){ self._showMsj($(this)) }
					}
				})
			}else{
				el.on("input",function(e){
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

		send:function(ev){
			var that = this, e = this.element, op = this.options, valid = false,
				inputs = e.find(":input").not(":submit"),
				submit = e.find(':submit'),
				result = 0, i = 0, l = inputs.length,
				funcs = this.funcs;
				do{
					let elem = inputs[i],
						el = $(elem),
						o = el.data('hv-options'),
						msj = (o.msj == "")? op.rule[ el.attr('type') ]: o.msj,
						fn = [], arg = [];

					if(msj != "" && !$.isNull(o.msj) && !$.isUndefined(o.msj)){
						elem.setCustomValidity = msj;
					}
					if(el.attr("required") || o.required){
						valid = funcs.required(el.val(), el);
						msj = (!valid)? op.rule.required: msj;
					}
					if(!$.isNull(o.typeValid)){
						let fns = ($.isString(o.typeValid))?String(o.typeValid).split(','):o.typeValid,
							e = 0;
							fns = ($.isArray(fn))?fn:[fn];
							
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
					if(!valid){
						if($.isFunction(o.onError)){
							o.onError.call(e,el,msj);
						}
						that.__showMsj(el);
						el.focus();
						return false;
					}
					//result += !valid ? 1 : 0;
					i++;
				}while(i < l);
		},

		novalidate:function(nv){
			if(nv){ this.element.attr('novalidate','novalidate'); }
		},

		allRequired:function(ar){
			this.element.find(":input").not(":submit").each(function() {
				if(ar){
					this.required = true;
				}
				else if($(this).data('required') == "true"){
					this.required = true;
				}
			});
		}

	};

	window.HV = HV;
	return HV.init();
})(jQuery);

