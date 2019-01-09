db.facturas.fin().limit(1).toArray()

db.facturas.find().limit(2).skip(2).pretty()

db.facturas.find(
	{ condPago: "CONTADO"},
	{}
	)


db.facturas.find(
	{"item.precio":490},
	{nroFactura:1,item:1}
	)


db.facturas.find(
	{"item.precio":490},
	{_id:0,nroFactura:1,fechaEmision:1}
	)


db.facturas.find(
	{nroFactura:1450,condPago:"CONTADO"},
	{}
	).limit(1).pretty()


// resultado
{
	"_id" : ObjectId("55e4a6fcbfc68c676a041225"),
	"cliente" : {
		"apellido" : "Manoni",
		"cuit" : 2029889382,
		"nombre" : "Juan Manuel",
		"region" : "NEA"
	},
	"condPago" : "CONTADO",
	"fechaEmision" : ISODate("2014-02-25T00:00:00Z"),
	"fechaVencimiento" : ISODate("2014-02-25T00:00:00Z"),
	"item" : [
		{
			"cantidad" : 10,
			"precio" : 90,
			"producto" : "TUERCA 5mm"
		}
	],
	"nroFactura" : 1450
}


db.facturas.find(
	{"item.producto": "CORREA 10mm"}
	).limit(1).pretty()

//resultado 
{
	"_id" : ObjectId("55e4a6fbbfc68c676a041064"),
	"cliente" : {
		"apellido" : "Zavasi",
		"cuit" : 2038373771,
		"nombre" : "Martin",
		"region" : "CABA"
	},
	"condPago" : "30 Ds FF",
	"fechaEmision" : ISODate("2014-02-20T00:00:00Z"),
	"fechaVencimiento" : ISODate("2014-03-22T00:00:00Z"),
	"item" : [
		{
			"cantidad" : 2,
			"precio" : 134,
			"producto" : "CORREA 10mm"
		}
	],
	"nroFactura" : 1001
}

db.facturas.find(
	{ nroFactura: {$gt:1465}}
	).count()
//resultado 
30404

db.facturas.find(
	{fechaEmision:{$gte:ISODate("2014-02-24T00:00:00Z")}}
	).limit(1).pretty(1)

//resultado

{
	"_id" : ObjectId("55e4a6fbbfc68c676a041066"),
	"cliente" : {
		"apellido" : "Manoni",
		"cuit" : 2029889382,
		"nombre" : "Juan Manuel",
		"region" : "NEA"
	},
	"condPago" : "CONTADO",
	"fechaEmision" : ISODate("2014-02-24T00:00:00Z"),
	"fechaVencimiento" : ISODate("2014-02-24T00:00:00Z"),
	"item" : [
		{
			"cantidad" : 2,
			"precio" : 60,
			"producto" : "TUERCA 2mm"
		},
		{
			"cantidad" : 1,
			"precio" : 490,
			"producto" : "TALADRO 12mm"
		},
		{
			"cantidad" : 15,
			"precio" : 90,
			"producto" : "TUERCA 5mm"
		}
	],
	"nroFactura" : 1003
}


db.facturas.find(
	{"item.precio":{$gt:100}}
	).count()

/*Muestra los primeros dos productos de la consulta, cuyo Precio sea menor o igual a 20 pesos,
mostrándolo de una forma más legible.
*/
db.facturas.find(
	{"item.precio":{$lt:20}}
	).limit(2).pretty()

/*Cuenta las facturas cuyo número no sea mayor o igual 1500.
*/
db.facturas.find(
	{nroFactura:{$not:{$gte:1500}}}
	).count()


/*Busca las facturas cuya condPago sea “CONTADO” ó “30 Ds FF”, mostrando sólo los atributos
nroFactura y condPago. Explícitamente se debe pedir no mostrar el _id.
*/

db.facturas.find(
	{condPago:{$in:["CONTADO","30 Ds FF"]}},
	{_id:0,nroFactura:1,condPago:1}
	).pretty()

//resultado
{ "condPago" : "30 Ds FF", "nroFactura" : 1001 }
{ "condPago" : "CONTADO", "nroFactura" : 1002 }
{ "condPago" : "CONTADO", "nroFactura" : 1003 }
{ "condPago" : "CONTADO", "nroFactura" : 1000 }
{ "condPago" : "30 Ds FF", "nroFactura" : 1004 }
{ "condPago" : "CONTADO", "nroFactura" : 1006 }
{ "condPago" : "CONTADO", "nroFactura" : 1007 }
{ "condPago" : "30 Ds FF", "nroFactura" : 1008 }
{ "condPago" : "CONTADO", "nroFactura" : 1009 }
{ "condPago" : "30 Ds FF", "nroFactura" : 1011 }
{ "condPago" : "CONTADO", "nroFactura" : 1010 }
{ "condPago" : "CONTADO", "nroFactura" : 1013 }
{ "condPago" : "CONTADO", "nroFactura" : 1014 }
{ "condPago" : "CONTADO", "nroFactura" : 1016 }
{ "condPago" : "30 Ds FF", "nroFactura" : 1015 }
{ "condPago" : "CONTADO", "nroFactura" : 1017 }
{ "condPago" : "30 Ds FF", "nroFactura" : 1018 }
{ "condPago" : "CONTADO", "nroFactura" : 1020 }
{ "condPago" : "CONTADO", "nroFactura" : 1021 }
{ "condPago" : "30 Ds FF", "nroFactura" : 1022 }
Type "it" for more


db.facturas.find(
	{ $or:
	  [
	   {"cliente.apellido": "Manoni"},
	   {condPago:"60 Ds FF"}
	  ]
	},
	{nroFactura:1,cliente:1}
).limit(1).pretty()

//resultado
{
	"_id" : ObjectId("55e4a6fbbfc68c676a041066"),
	"cliente" : {
		"apellido" : "Manoni",
		"cuit" : 2029889382,
		"nombre" : "Juan Manuel",
		"region" : "NEA"
	},
	"nroFactura" : 1003
}

/*
Ejemplo - Busca las facturas en los que exista el campo indicador, listando los atributos _id, nombre del cliente e indicador.
*/

db.facturas.find(
	{indicador:{$exists:true}},
	{"cliente.nombre":1,indicador:1}
	).limit(1).pretty()


/*

Listar todas las facturas donde el apellido del cliente que comience con “Ma" y contenga el substring "ni" en cualquier
parte del texto, sin tener el cuenta el Case Sensitive (n=N).

*/

db.facturas.find(
	{"cliente.apellido": /^Ma.*ni/i	},
	{nroFactura:1,"cliente.apellido":1,_id:0	}

	).limit(1).pretty()

//resultado
{ "cliente" : { "apellido" : "Manoni" }, "nroFactura" : 1003 }


Ordenamiento de documentos.

db.facturas.find(
	{},
	{nroFactura:1,fechaEmision:1}
	).sort({fechaEmision:1}) //ascendente


db.facturas.find(
	{},
	{nroFactura:1,fechaEmision:-1}
	).sort({fechaEmision:1}) //descendente