# <h1 style="font-size:4.5rem">HTML5 VALID</h1>

<p style="font-size: 1.25rem">Validador y manejador de formularios usuando las api de javascript,jQuery y HTML5.</p>

* Autor: Robert Pérez
* Email: delfinmundo@gmail.com
* Licencia: [MIT](LICENCE)

## Validaciones

* Validación
* Obtención de valores
* Validación en linea

## Soportes

Es soportado por todos los navegadores moderno, ya que para la fecha el 90% de los navegadores soportan las api form.

## Dependencias

jQuery >= 3

# Documentacion

## Tabla de Contenido

* [Instalaci&oacute;n](#intro)
* [Uso](#use)
* [Opciones](#option)
* [Ejemplo](#example)

<a id="intro"></a>
## Instalación

Solo debe ingresar la siguiente linea a su proyecto y listo, facil rapido y compatible con otros frameword
`<script src="html5valid.js"></script>`
Apartir de esto `HTML5 VALID` toma control y queda a la espera para su ejecuci&oacute;

<a id="use"></a>
## Uso
Es sencillo de usar solo debemos agregar el atributo `data-role="validate` al elemento `Form`
y listo.

<a id="option"></a>
## Opciones
`HTML5 VALID` posee un grupo de opciones que se pueden usar por medio de los atributo data o atravez de opciones de javascript.

Opciones del formulario.

* onError 	función 	data-on-error 	función a ejecutar cuando el formulario sea invalido.
* onSuccess 	función 	data-on-success 	función a ejecutar cuando el formulario sea valido.
* classForm 	string 	data-class-form 	nombre de la clase a agregar al formulario, en bootstrap suele ser was-validated.
* classMsjError 	string 	data-class-msj-error 	nombre de la clase a agregar al elemento que mostrara el mensaje de error, puede ser false y utilizar la función onError para personalizar el mensaje.
* novalidate 	boolean 	data-novalidate 	obligatorio para que el formulario no utilize los aspectos del navegador por defecto.
* allrequired 	boolean 	data-allrequired 	permite establecer que todos los elementos del formulario seran obligatorios.
* rule 	objeto 	data-rule 	mensaje personalizados para los elementos del formulario según su tipo.
* online 	boolean 	data-online 	indica si se valida los campos en linea.
* result 	string || elemento 	data-result 	indica el elemento que se usara para mostrar el mensaje de error siempre y cuando classMsjError sea distinto de false o null.
* event 	string 	data-event 	indica el evento a disparar el formulario.
* output 	string || elemento 	data-output 	indica el elemento que mostrara el mensaje del formulario al ser validado.
* showOp 	boolean 	data-show-op 	indica si se muestra o no un mensaje.
* classEout 	string 	data-class-eout 	indica la clase que se utilizara para el elemento de output en caso de error.
* classVout 	string 	data-class-vout 	indica la clase que se utilizara para el elemento de output en caso de validacion.
* xhr 	objeto 	data-xhr 	opciones para el envio de ajax.

Opciones de los elementos

* boolean 	data-required 	solo se usa atravez del atributo data en el elemento que se required obligatorio.
* string 	type-valid 	solo se usa atravez del atributo data en el elemento para validar un atributo especifico. Además puedes especificar multiples atributos separados por comas.
* string 	data-msj 	solo se usa atravez del atributo data en el elemento, es un mensaje personalizados para cada elemento.

<a id="example"></a>
## Ejemplo

Uso basico.

```html
<form data-role="validate" data-online="true" data-on-success="success" data-on-error="error">
	<div class="form-row">
		<div class="col-md-6 mb-3">
			 <input type="text" class="form-control" placeholder="Primer Nombre" data-required data-msj="Indique su primer nombre">
		</div>
		<div class="col-md-6 mb-3">
			 <input type="text" class="form-control" placeholder="Segundo Nombre">
		</div>
	</div>
	<div class="form-row">
		<div class="col-md-6 mb-3">
			 <input type="text" class="form-control" placeholder="Primer Apellido" data-required data-msj="Indique su primer apellido">
		</div>
		<div class="col-md-6 mb-3">
			 <input type="text" class="form-control" placeholder="Segundo Apellido">
		</div>
	</div>
	<div class="form-row">
		<div class="col-md-6 mb-3">
			 <input type="number"  min="18" max="45" step="1" data-type-valid="min,max" class="form-control" placeholder="Edad" data-required data-msj="Debe agregar una edad comprendida entre 18 y 45">
		</div>
		<div class="col-md-6 mb-3">
			<div class="form-group">
				<div class="form-check">
					<input class="form-check-input" type="checkbox" value="" data-required>
					<label class="form-check-label">
						Acepta los terminos y condiciones?
					</label>
				</div>
			</div>
		</div>
	</div>
	<button class="btn btn-primary" type="submit">Enviar</button>
</form>
```
Usando opciones con javascript

```html
<form id="javaform">
	<div class="input-group my-1">
		<div class="input-group-prepend">
			<div class="input-group-text"><i class="fa fa-user"></i></div>
		</div>
		<input type="text" class="form-control" placeholder="Usuario"/>
	</div>
	<div class="input-group my-1">
		<div class="input-group-prepend">
			<div class="input-group-text"><i class="fa fa-lock"></i></div>
		</div>
		<input type="password" class="form-control" placeholder="Clave"/>
	</div>
	<button class="btn btn-primary" type="submit">Enviar</button>
</form>
```

```javascript
$(function(){
	$("#javaform").validate({
		allrequired:true,
		onError:function(e,ms){
			console.error(e.target,ms);
		},
		onSuccess: function(f,ms){
			console.info(f,ms);
		},
		result:'<span class="alert"></span>',
		classMsjError:'alert-danger',
		showOp:false
	});
})
```
Para ver mas ejemplos y una documentación mas detallata descargela y acedata a la carpeta example desde cualquier navegador web.
