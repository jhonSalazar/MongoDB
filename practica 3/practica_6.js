
1. Realizar una consulta que devuelva la siguiente información: Región y cantidad total
de productos vendidos a clientes de esa Región.

> db.facturas.aggregate([ 
  {$unwind:"$item"},
  {$group: {
      _id: "$cliente.region", 
      count: {
        $sum: "$item.cantidad"
      }
  }
}
])

Resultado:
{ "_id" : "NOA", "count" : 4373 }
{ "_id" : "NEA", "count" : 131400 }
{ "_id" : "CABA", "count" : 87622 }






2. Basado en la consulta del punto 1, mostrar sólo la región que tenga el menor ingreso.

> db.facturas.aggregate([ 
  {$unwind:"$item"},
  {$group: {
      _id: "$cliente.region", 
      total: {
        $sum: "$item.cantidad"
      }
  }
},
{$sort:{total:1}},
{ $limit : 1 }
])

resultado:
{ "_id" : "NOA", "total" : 4373 }


3. Basado en la consulta del punto 1, mostrar sólo las regiones que tengan una cantidad
de productos vendidos superior a 10000.


>db.facturas.aggregate([ 
  {$unwind:"$item"},
  {$group: {
      _id: "$cliente.region", 
      total: {
        $sum: "$item.cantidad"
      }
  }
},
{$match:{total:{$gt:10000}}}
])

Resultado:

{ "_id" : "NEA", "total" : 131400 }
{ "_id" : "CABA", "total" : 87622 }





4. Se requiere obtener un reporte que contenga la siguiente información, nro. cuit,
apellido y nombre y región y cantidad de facturas, ordenado por apellido.

> db.facturas.aggregate([
			{$group:{
					_id:
						{cuit:"$cliente.cuit",apellido:"$cliente.apellido",nombre:"$cliente.nombre",region:"$cliente.region"}
					,
					total:{$sum:1}
			        }
			}
	])

resultado:
{ "_id" : { "cuit" : "20948004306", "apellido" : "Salazar", "nombre" : "Jhon", "region" : "CABA" }, "total" : 1 }
{ "_id" : { "nombre" : "Julio Gonzales" }, "total" : 1 }
{ "_id" : { "cuit" : 2729887543, "apellido" : "Lavagno", "nombre" : "Soledad", "region" : "NOA" }, "total" : 4373 }
{ "_id" : {  }, "total" : 11 }
{ "_id" : { "cuit" : 2029889382, "apellido" : "Manoni", "nombre" : "Juan Manuel", "region" : "NEA" }, "total" : 13140 }
{ "_id" : { "cuit" : 2038373771, "apellido" : "Zavasi", "nombre" : "Martin", "region" : "CABA" }, "total" : 8759 }







5. Basados en la consulta del punto 4 informar sólo los clientes con número de CUIT
mayor a 27000000000.


db.facturas.aggregate([
			{$match:{"cliente.cuit":27000000000}},
			{$group:{
					_id:
						{cuit:"$cliente.cuit",apellido:"$cliente.apellido",nombre:"$cliente.nombre",region:"$cliente.region"}
					,
					total:{$sum:1}
			        }
			}

	])




6. Basados en la consulta del punto 5 informar solamente la cantidad de clientes que
cumplen con esta condición.

db.facturas.aggregate([
			{$match:{"cliente.cuit":27000000000}},
			{$group:{
					_id:
						{cuit:"$cliente.cuit",apellido:"$cliente.apellido",nombre:"$cliente.nombre",region:"$cliente.region"}
			        }
			},
			{
				$group:{
						_id:null,
						count:{$sum:1}
				}
			}

	])

7. Se requiere realizar una consulta que devuelva la siguiente información: producto y
cantidad de facturas en las que lo compraron, ordenado por cantidad de facturas
descendente.

db.facturas.aggregate([
			{$unwind:"$item"},
			
			{$group:{
						_id:"$item.producto",
						 total:{
						 	$sum:1
						}
					}
			},
			{$sort:{total:1}}
	])

]Resultado:
{ "_id" : "Destornillador", "total" : 1 }
{ "_id" : "regalo", "total" : 4374 }
{ "_id" : "SET HERRAMIENTAS", "total" : 8753 }
{ "_id" : "TALADRO 12mm", "total" : 8759 }
{ "_id" : "CORREA 10mm", "total" : 8759 }
{ "_id" : "TUERCA 2mm", "total" : 8760 }
{ "_id" : "TUERCA 5mm", "total" : 8761 }






8. Obtener la cantidad total comprada así como también los ingresos totales para cada
producto.


> db.facturas.aggregate([
				{$unwind:"$item"},
				{$group:
						{
							_id: "$item.producto",
							cantidad_total_comprada:{$sum:"$item.cantidad"},
							ingreso_total:{$sum:"$item.precio"}
						}
				}
	])



9. Idem el punto anterior, ordenar por ingresos en forma ascendente, saltear el 1ro y
mostrar 2do y 3ro.

db.facturas.aggregate([
				{$unwind:"$item"},
				{$group:
						{
							_id: "$item.producto",
							cantidad_total_comprada:{$sum:"$item.cantidad"},
							ingreso_total:{$sum:"$item.precio"}
						}
				},
				{$sort:{ingreso_total:1}},
				{$limit:3},
				{$skip:1}
	])



10. Obtener todos productos junto con un array de las personas que lo compraron. En este
array deberá haber solo strings con el nombre completo de la persona. Los
documentos entregados como resultado deberán tener la siguiente forma:
{producto: “<nombre>”, personas:[“...”, ...]}

db.facturas.aggregate([
    { "$unwind": "$item"},
    { "$project": {producto :"$item.producto",
        "clientes":[ "$cliente.nombre"]
    }}
    ])
    
// no encontré la manera de correcta de hacerlo

11. Obtener los productos ordenados en forma descendente por la cantidad de diferentes
personas que los compraron.

	// idem, arrastra el ejercicio anterior

12. Obtener el total gastado por persona y mostrar solo los que gastaron más de 3100000.
Los documentos devueltos deben tener el nombre completo del cliente y el total
gastado:
{cliente:”<nombreCompleto>”,total:<num>}


db.facturas.aggregate([
			{$unwind:"$item"},
			{$group:
				{
				_id:"$cliente.cuit",
				total_gasto:{$sum:"$item.precio"}
				}
			},
			{$match:{ total_gasto: {$gt:3100000}}}
	])







13. Obtener el promedio de gasto por factura por cada región.

db.facturas.aggregate([
		{$unwind:"$item"},
		{$group:
				{
				  _id:"$cliente.region",
				  promedio:{$avg:"$item.precio"}
				}

		}
	])



14. Obtener la factura en la que se haya gastado más. En caso de que sean varias obtener
la que tenga el número de factura menor.
db.facturas.aggregate([
		{$unwind:"$item"},
		{$group:
				{
				  _id:"$nroFactura",
				  gasto_total:{$sum:"$item.precio"}

				}

		},
		{$sort:{gasto_total:-1}},
		{$limit:1}

	]);



15. Obtener a los clientes indicando cuanto fue lo que más gastó en una única factura.


db.facturas.aggregate([
		{$unwind:"$item"},
		{$group:
				{
					_id:{cliente:"$cliente",factura:"$nroFactura"},
					total:{$sum:"$item.precio"}
				}
		}
	])



16. Utilizando MapReduce, indicar la cantidad total comprada de cada ítem. Comparar el
resultado con el ejercicio 8.

{

var map = function() {
                       emit(this.producto, this.cantidad);
                   };

var reduce = function(clave, cantidad) {
                          return Array.sum(cantidad);
                      };

db.facturas.mapReduce(map,reduce,{ out: "prueb_map_reduce" })
}





17. Obtener la información de los clientes que hayan gastado 100000 en una orden junto
con el número de orden.

db.facturas.aggregate([
		{$unwind:"$item"},
		{$group:
				{
					_id:{cliente:"$cliente",factura:"$nroFactura"},
					total:{$sum:"$item.precio"}
				}
		},
		{$match:{total:{$gt:100000}}}
	])



18. En base a la localidad de los clientes, obtener el total facturado por localidad.

db.facturas.aggregate([
		{$unwind:"$item"},
		{$group:
				{
					_id:"$cliente.region",
					total:{$sum:"$item.precio"}
				}
		}
	])

