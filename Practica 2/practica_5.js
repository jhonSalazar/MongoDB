

Crear un índice único por número de factura para la colección facturas.

> db.facturas.createIndex({nroFactura:1})

2.1. Realizar una consulta en la que se muestren los siguientes datos, nroFactura,
fechaFactura, condPago y todos los datos del cliente, para las facturas que estén en el
rango de 1000 a 1015.

> db.facturas.find(
				{nroFactura:{$gt:1000,$lt:1015}},
				{_id:0,nroFactura:1,fechaFactura:1,condPago:1,cliente:1}
	)


2.2. Validar si el comando está utilizando el índice creado oportunamente.

 > db.facturas.fin({nroFactura:1024}).explain("queryPlanner")


2.3. Realizar una consulta que devuelva todos los datos para los clientes cuyo apellido sea
“Malinez”. Forzar que se ejecute accediendo por el índice creado en el punto.
	
> db.facturas.find({"cliente.apellido":"Malinez"}).hint({nroFactura:1})



3. Crear un índice de texto para todos los atributos que posean string en la colección.
> db.facturas.createIndex({"$**":"text"})

3.1. Informar la cantidad de facturas que posean la palabra TALADRO.
> db.facturas.find({"item.producto":{ $regex:"^TALADRO"}}).count()


3.2. Listar los documentos que posean alguna de las siguientes palabras “TALADRO
TUERCA”.

>db.facturas.find( { "item.producto":{ $in:[ "^TALADRO","^TUERCA"] } }).count()




3.3. Contar los documentos que posean la frase “Ds FF”.

>db.facturas.find({ condPago:{$regex:"Ds FF"}}).count()


3.4. Contar los documentos que posean la frase “30 Ds FF”.

>db.facturas.find({ condPago:{$regex:"30 Ds FF"}}).count()

3.5. Cuantos documentos deberían haber con la frase “60 Ds FF”.
Valídelo con una consulta.


>db.facturas.find({ condPago:{$regex:"60 Ds FF"}}).count()


4. Crear la colección solicitudes insertando 3 documentos con la siguiente estructura:
{nroSolicitud: unNúmero,
tipoSolicitud: “TEXTO”,
fechaSolicitud: new Date()}



> db.solicitudes.insert([
						{ nroSolicitud: 1,
						  tipoSolicitud: "solicitude 1",
						  fechaSolicitud: new Date()},
						{ nroSolicitud: 2,
						  tipoSolicitud: "solicitude 1",
						  fechaSolicitud: new Date()},
						{ nroSolicitud: 3,
						  tipoSolicitud: "solicitude 1",
						  fechaSolicitud: new Date()}])


4.1. Crear un índice TTL que borre las solicitudes luego de un minuto de cargadas.

> db.solicitudes.createIndex({nroSolicitud:1},{expireAfterSeconds:1})


4.2. Listar los documentos existentes en la colección solicitudes luego de crear el índice.
> db.solicitudes.find().pretty()


4.3. Esperar un minuto y volver a listarlos.
>db.solicitudes.find().pretty()


5. Se desea que las consultas de las facturas por región del cliente respondan más
rápidamente.



> db.facturas.createIndex({"cliente.region":1},true)

5.1. Consultar las facturas de la región “NEA” con el .explain() para saber cuánto tiempo
tarda originalmente.

> db.facturas.find({"cliente.region":"NEA"}).explain("executionStats")




5.2. Volver a realizar el .explain() luego de crear la estructura necesaria para que el query
se responda más rápido y comparar con el anterior.
> db.facturas.find({"cliente.region":"NEA"}).explain()
> db.facturas.createIndex({"cliente.region":1},true)


> db.facturas.find({"cliente.region":"NEA"}).explain()
25 milisegundos

6. Ahora se desea que respondan más rápidamente las consultas que, aparte de consultar
por región, las facturas se devuelvan ordenadas por número de factura descendente.
	
6.1. Realizar el .explain() de la consulta deseada. Determinar si utilizó algún índice y el
tiempo que tardó.

> db.facturas.find({"cliente.region":"NEA"}).sort({nroFactura:-1}).explain("executionStats")

109 milisegundos