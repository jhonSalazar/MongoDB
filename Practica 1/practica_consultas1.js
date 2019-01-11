/*


*/

a. Consultar la cantidad de documentos insertados.

>db.facturas.find().count()

b. Obtener 1 sólo documento para ver el esquema y los nombres de los campos. Sin
mostrar el _id.

> db.facturas.findOne({},{_id:0})


c. Obtener las facturas con fecha de emisión posterior al 23/02/2014 y número menor
a 1500. Ordenar por región y cuit del cliente


> db.facturas.find(
	{
	 fechaEmision:{$gt:ISODate("2014-02-23T00:00:00Z")},
	 nroFactura:{$lt:1500}	
	}
	)



d. Obtener sólo los datos de cliente de las facturas donde se haya comprado
“CORREA 10mm”. Ordenar por apellido del cliente.



>db.facturas.find(
	{ "item.producto": "CORREA 10mm"},
	{_id:0,cliente:1}
	).sort({"cliente.apellido":1})



e. Obtener sólo nombre y apellido de cliente, de las facturas con número entre 2500
y 3000.
,{$lt:3000} {$gt:2500}


>db.facturas.find(
	{nroFactura:{$gt:2500,$lt:3000}} // no debería ir [] en lugar de {}? ya que son mas de una comparacion...
			,
	{"cliente.nombre":1,"cliente.apellido":1}
	)


f. Obtener sólo la fecha de vencimiento de las facturas 5000, 6000, 7000 y 8000.

> db.facturas.find(
	{nroFactura: {$in:[5000,6000,7000,8000]} },
	{fechaVencimiento:1}
	)


g. Obtener las facturas de los clientes cuyo apellido comience con Z. Ordenar por
número de factura y devolver solo las primeras 5.

> db.facturas.find(
	{"cliente.apellido": {$regex:"^z",$options:"i"}}
	).sort({nroFactura:1}).limit(5)

>db.facturas.find(
	{"cliente.apellido": /^z/i}
	).sort({nroFactura:1}).limit(5)




h. Obtener sólo los números de factura en las que la región sea “CENTRO” o la
condición de pago sea “CONTADO”. Ordenar descendentemente por número de
factura y devolver de la 5 a la 10.

db.facturas.find(
	{ $or:[ {"cliente.región":"CENTRO"},{condPago:"CONTADO"}] },
	{nroFactura:1}
	).sort({nroFactura:-1}).limit(10).skip(4).pretty()



i. Obtener las facturas de todos los clientes que no sean de apellido “Zavasi” ni
“Malinez”.

db.facturas.find(
	{ $and:[{"cliente.apellido":{$ne:"Zavasi"}},{"cliente.apellido":{$ne:"Malinez"}}]} 
	)



j. Obtener sólo el nombre del producto de las facturas donde se haya comprado 15
unidades de dicho producto.

// --> me dice que item no esta definido...
{
var facturas = db.facturas.find({"item.cantidad":15, item:{$exists:true}})
while(facturas.hasNext()){
		
		facturas.item.forEach(producto => {print("Producto "+ producto.producto);});
		facturas.next();
}
}


k. Obtener sólo una factura del cliente de cuit 2038373771, condición de pago “30 Ds
FF” y fecha de vencimiento entre el 20/03/2014 y 24/03/2014.

db.facturas.find(
	{"cliente.cuit":2038373771,
	  condPago:"30 DsFF",
	  fechaVencimiento:{$gt:ISODate("2014-03-20T00:00:00Z"),$lt:ISODate("2014-03-24T00:00:00Z")}
	}

	)
