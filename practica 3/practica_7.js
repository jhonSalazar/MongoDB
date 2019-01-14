a. Hacer una función que, dado un array, imprima el atributo “producto” de cada
elemento. Probarlo con el array:
[{producto:"Destornillador"},{producto:"Tornillo"},{producto:
"Arandela"}]

{
function imprimir( productos ){
	
	productos.forEach(function(producto){

		print("Producto:" + producto.producto);
	});

};

var productos = [{producto:"Destornillador"},{producto:"Tornillo"},{producto:"Arandela"}];

imprimir(productos);

}


b. Obtener el documento de la factura 5000 y aplicarle la función del ejercicio anterior
a su array de items.

{
function imprimir( productos ){
	productos.forEach(function(producto){
		print("Producto:" + producto.producto);
	});
};
var productos = db.facturas.find({nroFactura:5000});
	productos.forEach(function(producto){
				imprimir(producto.item);
	})	
}


c. Obtener la factura 1330 e insertar su ítem cambiando el precio a 15 en la
colección “items”.

{
	var facturas = db.facturas.find({nroFactura:1330}).limit(1);
	facturas.forEach(function(factura){
			factura.item.forEach(function(producto){
					producto.precio= 15;
					db.items.insert(producto);
			});
	});
}


d. Obtener el documento de la factura 1144, sumarle 10 a la cantidad de cada ítem y
hacer update.

{
	var facturas = db.facturas.find({nroFactura:1144});
	facturas.forEach(function(factura){
			factura.item.forEach(function(producto){
					producto.cantidad += 10;
			});
			db.facturas.update(  {_id:factura._id},factura)
	});
}

e. Obtener la factura de número mayor del cliente “Manoni” e imprimir en pantalla
todos los datos de la factura (pueden usar la función del ejercicio “a” para mostrar
los ítems, sin mostrar cantidad y precio).


{

	function imprimir( productos ){
	productos.forEach(function(producto){
		print("Producto:" + producto.producto);
		});
	};

	var facturas = db.facturas.find({"cliente.apellido":"Manoni"}).sort({nroFactura:-1});
	facturas.forEach(function(factura){
			 imprimir(factura.item);
			
	});
}




f. Obtener la factura 2345, eliminarla de esta colección e insertarla sin condición de
pago ni fecha de vencimiento en la colección “facturasErroneas”.


{
	var facturas = db.facturas.find({nroFactura:2345});
	facturas.forEach(function(factura){
			delete factura["condPago"];
			delete factura["fechaVencimiento"];
			db.facturasErroneas.insert(factura);
			db.facturas.remove({_id:factura._id});
	});
}


g. Obtener la factura 1020, si su condición de pago es “CONTADO” hacer un update
agregando el atributo “porcDescuento” con el valor 10.

{
	var facturas = db.facturas.find({nroFactura:1020});
	facturas.forEach(function(factura){
				if(factura.condPago == "CONTADO"){
					factura.porcDescuenti = 10;
					db.facturas.update({_id:factura._id},factura);
				}
	});
}







h. En base a los ítems de todas las facturas, insertarlos junto con su precio actual en
la colección “items”. Tener en cuenta que cada ítem debe estar sólo una vez.



{
	var facturas = db.facturas.find();
	facturas.forEach(function(factura){
		var sinDuplicados = Array.from(new Set(factura.item));
			  sinDuplicados.forEach(function(producto){
						 delete producto["cantidad"];
						 db.items.insert(producto);
					});
	});
}



i. En base a los clientes de todas las facturas, insertarlos en otra colección
“clientes”. Cada cliente debe tener nombre, apellido, cuit, región, la fecha de hoy y
la cantidad de facturas.



{
	var clientes =	db.facturas.aggregate([
				{$group:
						{
							_id:"$cliente",
							cantidad_factura:{$sum:1}
						}
				}
		]);
	clientes.forEach(function(cliente){
		cliente.fecha = new Date();	
		db.clientes.insert(cliente);
	});
}




j. Ver en la colección de clientes el que tenga menos facturas, eliminarlo y eliminar
todas sus facturas.

{
		var clientes = db.clientes.find().sort({cantidad_factura:1})
		clientes.forEach(function(cliente){
				db.clientes.remove({"_id.cuit":cliente.cuit});
				db.facturas.remove({"cliente.cuit":cliente.cuit});
		});
}


k. Obtener un cursor con las facturas de clientes de CABA, si tiene más de 2 items,
sacarle el atributo precio a los ítems y hacer update.

			var facturas = db.facturas.find({"cliente.region":"CABA"});
			facturas.forEach(function(factura){
					if(factura.item.length > 2){
						factura.item.forEach(function(producto){ delete producto.precio });
						db.facturas.update({_id:factura._id},factura);
					}

			});

l. Insertar la función del ejercicio “a” en la base con el nombre listarItemsDeFactura.
m. Crear una función que reciba 2 nombres de colecciones, de la colección de
facturas y la de clientes, y que luego imprima en pantalla los números de las
facturas de clientes que no existen en el sistema. Insertarla en la base con el
nombre facturasDeClienteNuevo.

db.system.js.save(
   {
     _id : "listarItemsDeFactura" ,
     value : function( productos ){
	
	productos.forEach(function(producto){

		print("Producto:" + producto.producto);
	});

}
   }
);

//  no entendí la segunda parte...


n. Insertar una factura número 9 con usted como cliente. Luego obtener la función
del ejercicio anterior y ejecutarla.


 db.facturas.insert(
	{
		"cliente":
		{"apellido": "Salazar",
		  "cuit" :"20948004306",
		  "nombre" :"Jhon",
		  "region": "CABA"

		},
		"condPago" : "30 Ds FF",
		"fechaEmision" : ISODate("2019-01-12T00:00:00Z"),
		"fechaVencimiento" : ISODate("2022-01-12T00:00:00Z"),
	 	"item" : [{ "cantidad": 2,"precio": 134,"producto": "Destornillador"}]
	 	,
	 	"nroFactura" : 999
	 }

	)



o. Crear una secuencia para usar de ahora en adelante con la colección facturas.
Insertar una nueva factura haciendo uso de la secuencia.

db.system.js.save(
   {
     _id : "siguienteValor" ,
     value : function (secuenciaId){
   var sequenceDocument = db.counters.findAndModify(
      {
         query:{_id: secuenciaId },
         update: {$inc:{secuenciaId_Valor:1}},
         new:true
      });
   return sequenceDocument.secuenciaId_Valor;
}
   }
);

db.facturas.insert({ _id:siguienteValor("facturaid"),
					nroFactura:1234}
)
