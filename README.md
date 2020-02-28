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
* [Ejemplo](#example)

<a id="intro"></a>
## Instalación

Solo debe ingresar la siguiente linea a su proyecto y listo, facil rapido y compatible con otros frameword
`<script src="html5valid.js"></script>`
Apartir de esto `HTML5 VALID` toma control y queda a la espera para su ejecuci&oacute;n

<a id="use"></a>
## Uso
Es sencillo de usar solo debemos agregar el atributo `data-role="html5valid` al elemento `Form`
y listo.

<a id="example"></a>
## Ejemplo

Uso basico.

```html
<form data-role="html5valid" data-online="true" data-on-success="success" data-on-error="error">
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

Para ver mas ejemplos y una documentación mas detallata descargela y acedata a la carpeta docs desde cualquier navegador web.
