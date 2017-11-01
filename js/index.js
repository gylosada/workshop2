//blayermatias@gmail.com

var formulario = document.getElementById("formulario")
var cajaGeneral = document.getElementById("cajaGeneral")
var favoritosbtn = document.getElementById("favoritosbtn")
var cajaDetalle = document.getElementById("cajaDetalle")

////////// mi constructor de productos 
var productoCreado = function(miId, miTitulo, miPrecio, miImg, miUbicacion){
	this.id = miId
	this.titulo = miTitulo
	this.precio = miPrecio
	this.img = miImg
	this.ubicacion = miUbicacion
}

var detalleProducto = function(elTitulo, elPrecio, laDesc, laImg){
	this.titulo = elTitulo
	this.precio = elPrecio
	this.descripcion = laDesc
	this.img = laImg
}


var arrProdBusc = []


////// oculto los productos anteriores
var ocultarProductos = function(){
	
	while(cajaGeneral.childElementCount !== 0){
		cajaGeneral.removeChild(cajaGeneral.firstChild)
	}

	while(cajaDetalle.childElementCount !== 0){
		cajaDetalle.removeChild(cajaDetalle.firstChild)
	}
}



var mostrarDetalleProd = function(miObj){

	var divPadre= document.createElement("div")

	var divUno = document.createElement("div")
	divUno.classList.add("dostercios")
	var divDos = document.createElement("div")
	divDos.classList.add("untercio")
	divPadre.appendChild(divUno)
	divPadre.appendChild(divDos)	
	cajaDetalle.appendChild(divPadre)

	

	///////////////////////////////////////////////
	//creo el contenido de divUno
	var divImg = document.createElement("div")
	var imgProdDet = document.createElement("img")
	imgProdDet.src = miObj.img
	divImg.appendChild(imgProdDet)
	divUno.appendChild(divImg)
	
	var miH5 = document.createElement("h5")
	var txtH5 = document.createTextNode("Descrición del producto")
	miH5.appendChild(txtH5)
	divUno.appendChild(miH5)

	var miPdiv = document.createElement("div")
	//var divP = document.createTextNode(miObj.descripcion)
	miPdiv.innerHTML = miObj.descripcion
	//miPdiv.appendChild(divP)
	divUno.appendChild(miPdiv)


	///////////////////////////////////////////////
	//creo el contenido de divDos
	var segundoH5 = document.createElement("h5")
	var txtSegundoH5 = document.createTextNode(miObj.titulo)
	segundoH5.appendChild(txtSegundoH5)
	divDos.appendChild(segundoH5)

	var miH4 = document.createElement("h4")
	var txtH4 = document.createTextNode("$" + miObj.precio)
	miH4.appendChild(txtH4)
	divDos.appendChild(miH4)

	var botonComprar = document.createElement("button")
	var txtBtn = document.createTextNode("Comprar")
	botonComprar.appendChild(txtBtn)
	divDos.appendChild(botonComprar)


	//////////////////////////////////////////////////
}




var pedidosAjax = function (event){

	var idClickeado = event.currentTarget.id.substring(4)


	// peticion anidada, muestra la info final
	var ajaxItem = function (){
		$.ajax({
			url: "https://api.mercadolibre.com/items/" + idClickeado,
			type: "get",
			data: "json",
			success: function(info){

				var ajaxDescripcion = function(hola){
						$.ajax({
							url: "https://api.mercadolibre.com/items/" + idClickeado + "/descriptions",
							type: "get",
							data: "json",
							success: function(desc){
								var infoTitulo = info.title
								var infoPrecio = info.price
								var infoImg = info.pictures[0].url
								var infoDesc = desc[0].text
								
								//console.log("titulo:" + infoTitulo)
								//console.log("precio: " +infoPrecio)
								//console.log("src img: " +infoImg)
								//console.log("desc: " +infoDesc)
								
								//creo un objeto con esos datos
								var objProducto = new detalleProducto(infoTitulo, infoPrecio, infoDesc, infoImg)
								console.log(objProducto)

								ocultarProductos()
								
								//muestro el producto
								mostrarDetalleProd(objProducto)
							},
							error: function(info){
								console.log("hay problemas en dos")
							},
							complete: function(){
							}
						})
					}();				
			},
			error: function(){
				console.log("hay problemas")
			}
		})
	}();	
}




////// muestro la búsqueda ingresada
var mostrarProductos = function(miArr){

	for(var i=0; i<miArr.length; i++){

		var cajaProd = document.createElement("article")
		cajaProd.setAttribute("id", i);
		cajaGeneral.appendChild(cajaProd)

		//creo los tres divs
		var divImg = document.createElement("div")
		var divH = document.createElement("div")
		var divP = document.createElement("div")

		// agrego los divs a la 
		cajaProd.appendChild(divImg)
		cajaProd.appendChild(divH)
		cajaProd.appendChild(divP)

		//creo los contenidos de las cajas
		var imgProd = document.createElement("img")
		var spanIcon = document.createElement("span")
		var titA = document.createElement("a")
		var titH4 = document.createElement("h4")
		var parP = document.createElement("p")

		//los agrego a sus respectivas cajas
		divImg.appendChild(imgProd) //img
		divH.appendChild(spanIcon) // fav
		divH.appendChild(titA) // titulo
		divH.appendChild(titH4) //precio
		divP.appendChild(parP) // ubicacion

		//creo los contenidos de texto e img
		imgProd.src = miArr[i].img

		//creo los contenidos de texto
		var textoA = document.createTextNode(miArr[i].titulo)
		titA.appendChild(textoA)
		var textoH4 = document.createTextNode("$" + miArr[i].precio)
		titH4.appendChild(textoH4)
		var textoP = document.createTextNode(miArr[i].ubicacion)
		parP.appendChild(textoP)




		///////////////////////////// boton favorito
		spanIcon.setAttribute("id", "fav"+ miArr[i].id)

		// defino la variable en false
		var yaEsFav = false

		// itero el LS para saber si ya es favorito
		for(var j=0; j<localStorage.length; j++){
			var idLS = JSON.parse(localStorage.getItem(localStorage.key(j)))
			if(miArr[i].id == idLS){
				yaEsFav = true
			}
		}

		// agrego la clase si ya existe, sino la otra
		if(yaEsFav){
			spanIcon.classList.add("ion-android-favorite")			
		} else{
			spanIcon.classList.add("ion-android-favorite-outline")	
		}
		

		//boton favoritos eventlistener
		spanIcon.addEventListener("click", function(){		
			
			var idProdArr = event.currentTarget.id.substring(3)

			//defino el prod en NOFAV
			var soyFav = false	

			//busco el id en el LS
			for(var i=0; i<localStorage.length; i++){
				var idProdLS = JSON.parse(localStorage.getItem(localStorage.key(i)))
				
				if(idProdArr==idProdLS){
					soyFav = true			
				}
			}

			if(soyFav){
				document.getElementById("fav" + idProdArr).classList.remove("ion-android-favorite")
				document.getElementById("fav" + idProdArr).classList.add("ion-android-favorite-outline")
				localStorage.removeItem(idProdArr)
			} else{
				document.getElementById("fav" + idProdArr).classList.remove("ion-android-favorite-outline")
				document.getElementById("fav" + idProdArr).classList.add("ion-android-favorite")
				localStorage.setItem(idProdArr, JSON.stringify(idProdArr))
			}
		})




		///////////////////////////// boton a producto individual
		titA.setAttribute("id", "link"+ miArr[i].id)
		titA.href = "#"

		//le agrego la funcion del event listener
		titA.addEventListener("click", pedidosAjax);
	}
}




favoritosbtn.onclick = function(event){

	arrFavLS = []
	arrFavMostrar = []

	//itero el ls guardando los objetos
	for(var i=0; i<localStorage.length; i++){
		var idSinComilla = localStorage.key(i)
		arrFavLS.push(idSinComilla)
	}	

	//hago un pedido por un array de ids
	$.ajax({
		//url: "https://api.mercadolibre.com/items/" + arrFavLS[i], 
		url: "https://api.mercadolibre.com/items?ids=" + arrFavLS,
		type: "get",
		data: "json",
		success: function(info){
			for(var i=0; i<info.length; i++){
				var ciudad = info[i].seller_address.state.name
				var barrio = info[i].seller_address.city.name
				arrFavMostrar.push(new productoCreado(info[i].id, info[i].title, info[i].price, info[i].thumbnail, ciudad + ", " + barrio))
			}
	
			//ocultar productos en pantalla
			ocultarProductos();

			//Muestro los favoritos en pantalla
			mostrarProductos(arrFavMostrar)
		},
		error: function(info){
			console.log("salió todo mal")
		}
	})	
}


////// función que ejecuta la búsqueda
formulario.onsubmit = function(event){
	
	var productoIngresado = formulario[0].value

	////// hago pedido a ajax por busqueda
	var pedidoProducto = function(info){
		$.ajax({
			url: "https://api.mercadolibre.com/sites/MLA/search?q=" + productoIngresado + "&limit=10",
			type: "get",
			data: "json",
			success: function(info){
				arrProdBusc = []
				var laInfo = JSON.parse(JSON.stringify(info.results))
				for(var i=0; i<laInfo.length; i++){
					var infoUbicacion = laInfo[i].address.state_name + ", " + laInfo[i].address.city_name
					arrProdBusc.push(new productoCreado( laInfo[i].id, laInfo[i].title, laInfo[i].price, laInfo[i].thumbnail, infoUbicacion))
				}
				mostrarProductos(arrProdBusc)
			},
			error: function(info){
				console.log("hay un problema")
			},
			complete: function(info){
			},
		})
	}();
	
	ocultarProductos();

	event.preventDefault();
}

