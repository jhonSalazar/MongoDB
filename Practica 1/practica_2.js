
a. Obtener los números de factura de los clientes que contengan una i (minúscula o
mayúscula) pero que no sea Manoni.

>db.facturas.find(
	{  $and:[ {"cliente.apellido":{$regex:"$i",$options:"i"}} , {"cliente.apellido":{$ne:"Manoni"}}]},
	{nroFactura:1}
	)


b. Obtener las facturas de clientes con apellido terminado en i, cuya región sea
CABA y donde hayan comprado una TUERCA, sin importar su medida.

>db.facturas.find(
		{$and:[
				{"cliente.apellido":{$regex:"i$"}},
				{"cliente.region":"CABA"},
				{"item.producto": { $regex:"^TUERCA"}}
			  ]

		},
	{}
	)


c. Obtener las facturas donde se haya comprado una correa, sin importar la medida.

>db.facturas.find(
	{"item.producto":{$regex:"^CORREA"}},
	{}
	)


// muy poco performante
d. Obtener los datos de cliente de las facturas donde se haya comprado 12 o más de
cualquier ítem.

>db.facturas.find(
	 {item : {$exists:true}, $where:'this.item.length>=12'}, 
	 {cliente:1}
	)



e. Obtener las facturas donde no se hayan comprado "SET HERRAMIENTAS"

> db.facturas.find(
	{"item.producto": { $ne: "SET HERRAMIENTAS"}}
	)




f. Armar una función en javascript que recorra un cursor con todos las facturas
imprimiendo “Factura <nroFactura>: <cliente.apellido> compró <n> items”

{
var cursor = db.facturas.find()

cursor.forEach( function(factura) {
			    print( "Factura: " + factura.nroFactura +":"
			    	   +factura.cliente.apellido+" compro " 
			    	   + factura.item.length + " items"  );
			     }
			     );

}


g. Insertar una factura número 999 con usted como cliente, habiendo comprado un
Destornillador.

> db.facturas.insert(
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

> db.facturas.find({"cliente.apellido":"Salazar"}).pretty()






h. ¿De qué forma insertará el siguiente array de documentos para que, sin importar
si alguno de ellos falla, el resto igualmente se inserte?
[{_id:1},{_id:1},{_id:2}]

- Utilizando Unordered  Bulk writes 


i. Mediante un Bulk agregarle a cada factura del cliente Lavagno agregarle el campo
“tipo” con el valor “VIP”. Este deberá estar dentro del campo cliente.
(cliente:{nombre:..., apellido:..., tipo:..., ...}).
Junto con esto, eliminar las facturas entre 2000 y 2222.

// segui el ejemplo de la presentación pero no me reconoce el metodo update....
{
var bulk = db.facturas.initializeOrderedBulkOp();
bulk.update({"cliente.apellido": "Lavagno" },{$set:{"cliente.tipo":"VIP"}},{multi:true});
bulk.remove({nroFactura:{$gt:2000,$lt:2222}})
bull.execute();
}




j. Eliminar todas las facturas de los clientes del CENTRO.

> db.facturas.remove(
	{"cliente.region":"CENTRO"}
	)



k. Obtener la factura con el mayor nroFactura del cliente de apellido Lavagno donde
haya comprado “SET HERRAMIENTAS” y luego asegurarse de borrar únicamente
esa factura.

//supuestamente con -1 debería devolver como primer documento el mayor de todos, sin embargo no lo estaría asciendo,
//me trae el mismo resultado con 1 o -1, hay algo que estoy haciendo mal?
{
var facturaAeliminar = 
	db.facturas.find({"cliente.apellido":"Lavagno","item.producto":"SET HERRAMIENTAS"}).sort( {$nroFactura:-1}).limit(1).toArray();
db.facturas.remove({nroFactura: facturaAeliminar[0].nroFactura})
}
			



l. Incrementar el número de factura de la 1501.

>db.facturas.update({nroFactura:1501},{$inc:{nroFactura:1}})


m. A la factura número 1500 cambiarle la condición de pago a “30 Ds FF”

>db.facturas.update({nroFactura:1500},{$set:{condPago:"30 Ds FF"}})


n. Restarle 9 al número de factura de la 1510.

> db.facturas.update({nroFactura:1510},{$inc:{nroFactura:9}})


o. A la factura número 1515 incrementarle el campo “vistas” y decrementarle el
campo “contador”.

> db.facturas.update({nroFactura:1515},{$inc:{visitas:1,contador:-1}})

p. A los ítems de la factura 1000 agregarle 2 destornilladores con un precio de 20.

>db.facturas.update({nroFactura:1000},{$push:{item:{"cantidad":2 ,"precio":20,"producto":"destornilladores"}}})



q. Sacarle el primer item a la factura número 1000.

> db.facturas.update({nroFactura:1000},{$pop:{item:-1}})



r. Sacarle el ítem "CORREA 10mm" a la factura número 1000.

> db.facturas.update({nroFactura:1000},{$pull:{item:{producto:"CORREA 10mm"}}})



s. Hacerle un update total a la factura número 1000 sacandole el array de items.

>db.facturas.update({nroFactura:1000},{$unset:{item:""}},{multi:true})



t. Realizar lo mismo que en el ejercicio anterior pero con update parcial para la
factura 1001

>db.facturas.update({nroFactura:1001},{$unset:{item:""}})



u. Agregar los ítems de la factura 1002 a las facturas 1000 y 1001.

{
var items = db.facturas.find({nroFactura:1002},{_id:0,item:1}).toArray();
	items.forEach(function(unItem) {
  					db.facturas.update({nroFactura:1000},{$push:{item:{unitem.item}}}});
  					db.facturas.update({nroFactura:1001},{$push:{item:{unitem.item }}}) ;
				 }
				 );
}

v. A cada factura del cliente Lavagno agregarle el campo “tipo” con el valor “VIP”.
Este deberá estar dentro del campo cliente. (cliente:{nombre:...,
apellido:..., tipo:..., ...}).


>db.facturas.update({"cliente.apellido": "Lavagno" },{$set:{"cliente.tipo":"VIP"}},{multi:true});

w. A las facturas de los clientes que tienen un tipo cargado agregarle un producto
regalo.

> db.facturas.update({tipo:{$exists:true}},{$push:{item:{"producto":"regalo"}}})


x. Actualizar la factura 900 poniéndole el cliente de nombre Julio Gonzales. Tener en
cuenta que esta factura no existe.

> db.facturas.update({nroFactura:900},{$set:{"cliente.nombre":"Julio Gonzales"}},{upsert:true})



y. A las facturas del cliente Julio Gonzales agregarle un array de intereses con los
valores “Plomeria” y “Electronica”. Tener en cuenta que los intereses no deberán
estar repetidos.

>db.facturas.update({"cliente.nombre":"Julio Gonzales"},{$push:{intereses:{$each:["Plomeria","Electronica"]}}})



z. Guarde el documento de la factura número 9000 en una variable. Luego haga un
update total de la factura 9000 reemplazándola por el documento
{x:Math.random()} (generará un número aleatorio para el campo x).
¿Hay forma de consultar el documento modificado? ¿De qué forma?

No entedí 

