
a. A los ítems de la factura 1000 agregarle 2 destornilladores con un precio de 20.

>db.facturas.update({nroFactura:1000},{$push:{item:{"cantidad":2 ,"precio":20,"producto":"destornilladores"}}})



b. Sacarle el primer item a la factura número 1000.

> db.facturas.update({nroFactura:1000},{$pop:{item:-1}})


c. Sacarle el ítem "CORREA 10mm" a la factura número 1000.

> db.facturas.update({nroFactura:1000},{$pull:{item:{producto:"CORREA 10mm"}}})


d. Hacerle un update total a la factura número 1000 sacándole el array de items.

> db.facturas.update({nroFactura:1000},{$unset:{item:""}},{multi:true})

 

e. Realizar lo mismo que en el ejercicio anterior pero con update parcial para la
factura 1001

> db.facturas.update({nroFactura:1001},{$unset:{item:""}})


f. Agregar los ítems de la factura 1002 a las facturas 1000 y 1001.


> db.facturas.find({nroFactura:1002}).forEach(function(factura){
				db.facturas.update({nroFactura:1000},{$push:{item:{$each:factura.item}}});
				db.facturas.update({nroFactura:1001},{$push:{item:{$each:factura.item}}});

})


g. A cada factura del cliente Lavagno agregarle el campo “tipo” con el valor “VIP”.
Este deberá estar dentro del campo cliente. (cliente:{nombre:...,
apellido:..., tipo:..., ...}).

> db.facturas.update({"cliente.apellido":"Lavagno"},{$set:{tipo:"VIP"}},{multi:true})



h. A las facturas de los clientes que tienen un tipo cargado agregarle un producto
regalo.

> db.facturas.update({tipo:{$exists:true}},{$push:{item:{producto:"regalo"}}},{multi:true})



i. A las facturas del cliente Julio Gonzales agregarle un array de intereses con los
valores “Plomeria” y “Electronica”. Tener en cuenta que los intereses no deberán
estar repetidos.


> db.facturas.update({"cliente.nombre":"Julio Gonzales"},{$push:{intereses:{$each:["Plomeria","Electronica"]}}})




j. Obtener una factura donde es haya comprado 1 “TALADRO 12mm”.

> db.facturas.find({"item.producto":"TALADRO 12mm","item.cantidad":1})


k. Realizar lo mismo que en el ejercicio anterior pero mostrar únicamente el
nroFactura y sólo el elemento del array que cumplió la condición.

> db.facturas.find({item:{$elemMatch:{producto:"TALADRO 12mm",cantidad:1}}},{"item.$":1,_id:0})


l. En todas las facturas donde se hayan comprado 11 “ CORREA 12mm”,
decrementar el precio de ese elemento.

> db.facturas.update({item:{$elemMatch:{producto:"CORREA 12mm",cantidad:11}}},{$inc:{"item.$.precio":-1}},{multi:true})

el resultado es WriteResult({ "nMatched" : 0, "nUpserted" : 0, "nModified" : 0 })

pero si cambiamos la condicion con CORREA 10mm y cantidad 2, modifica el nroFactura: 1029, antes tenía 134 y ahora tiene 133


m. Obtener un documento con la condición del ejercicio anterior para corroborar el
resultado, mostrando únicamente el elemento del array que cumple la condición.


> db.facturas.find({item:{$elemMatch:{producto:"CORREA 10mm",cantidad:2}}, nroFactura:1029},{"item.$":1,_id:0})


n. En una colección inexistente insertar los valores 1,3,5,7,8,4,9,2 en un array “x” en
el documento que tenga la key “y” igual a 1, pero asegurarse de que sólo los 3
valores más chicos queden en ese array. A su vez, indicar una key “creado” donde
se guarde la fecha de creación del documento si es que no existía.

{	
  var array = [1,3,5,7,8,4,9,2];
  array.sort();
  var arrayAux = [];
  for (i = 0; i < 3 ; i++) {arrayAux[i] = array[i];}
   db.inexistente.insert( {  key:"y",  "x":arrayAux});
}




o. Insertar en la colección del ejercicio anterior un documento con “x” igual a new
Date(), otro con x igual a “mongo” y otro con x igual a “db”. Luego encontrar los
documentos con x donde el tipo de dato sea String.

{
db.inexistente.insert({"x": new Date()},{x:"mongo"},{x:"db"})
db.inexistente.insert()
db.inexistente.insert()
}

> db.inexistente.find({x:{$type:"string"}})


p. A los ítems de la factura 9999 agregarle los de la factura 9998, dejándolos
ordenados por precio ascendente.
{

db.facturas.find({nroFactura:9999}).forEach(function(factura){
				db.facturas.update({nroFactura:9998},{$push:{item:{$each:factura.item, $sort: { precio: 1 }  }}});
})
}




q. A los ítems de la factura 9999 agregarle los de la factura 9996 (sin importar si hay
productos repetidos), dejándolos ordenados por precio descendente y limitar la
cantidad del array a 3.

{

db.facturas.find({nroFactura:9999}).forEach(function(factura){
				db.facturas.update({nroFactura:9996},{$push:{item:{$each:factura.item, $slice:3,$sort: { precio:-1 }  }}});
})
}


r. Cada subdocumento del cliente, en cada factura, deberá tener un array llamado
“intereses”. Agregarle a todos el interés “Mecanica”, teniendo en cuenta que el
array no deberá tener más de 2 elementos.

db.facturas.update({},{$push:{"cliente.intereses":{$each:["Mecanica"],$slice:2}}},{multi:true})



s. Obtener la factura número 3355. En memoria cambiarle la fecha de vencimiento,
poniendo el día de hoy, cambiarle la condición de pago a “CONTADO”. Guardarlo
con la función save.


{
db.facturas.find({nroFactura:3355}).forEach(function(factura){
				db.facturas.save({_id:factura._id, nroFactura:3355,fechaVencimiento: new Date(), condPago:"CONTADO"});
})
}



t. Obtener nuevamente la factura 3355, eliminar el _id, cambiar el atributo
nroFactura a “Invalido”. Eliminar la factura de la colección e insertar el documento
modificado con la función save.

// no me quedo claro el funcionamiento de save()


u. A la factura de menor número de los clientes de CABA, incrementarle en 1 el
atributo “cuotas” y obtener el documento modificado. Toda esta acción debe ser
atómica.

{
var bulk = db.facturas.initializeOrderedBulkOp();	
db.facturas.find({"cliente.region":"CABA"}).sort({nroFactura:1}).limit(1).forEach(function(factura){
				bulk.update({ nroFactura:factura.nroFactura},{$inc:{cuotas:1}});
				bulk.find({nroFactura:factura.nroFactura})
				bull.execute();
})
}


v. A la factura 1700 eliminarle el primer ítem y asignárselo a una variable. Toda esta
acción debe ser atómica.


{
var bulk = db.facturas.initializeOrderedBulkOp();
db.facturas.find({nroFactura:1700}).forEach(function(factura){
				var primerItem = factura.item[0];
				bulk.update({ nroFactura:factura.nroFactura},{$pop:{item:-1}});
				bulk.find({nroFactura:factura.nroFactura})
				bull.execute();
})
}


