var products = [];

function loadProducts() {
  fetch("https://api.yumserver.com/16717/products")
    .then((response) => response.json())
    .then((data) => {
      products = data;

      displayProducts();
    })

    .catch((error) => console.error("Error:", error));
}

function displayProducts() {
  document.getElementById("body").innerHTML = "";
  products.forEach((product) => {
    document.getElementById("body").innerHTML += `
            
            <td>${product.titulo}</td>
            <td>${product.precioPeso}</td>
            <td>${product.precioDolar}</td>
            <td>${product.fecha}</td>


            <td>
                <button onclick="Editar('${product.idcod}')">Editar</button>
                <button onclick="Borrar('${product.idcod}')">Eliminar</button>
                
            </td>
        `;
  });
}

function NuevoProducto() {
  var data = {
    titulo: document.getElementById("productName").value,
    precioPeso: document.getElementById("productPriceARS").value,
    precioDolar: document.getElementById("productPriceUSD").value,
    fecha: document.getElementById("productDate").value,
  };

  var id = document.getElementById("productId").value;

  if (id) {
    Modificar(id);
  } else {
    fetch("https://api.yumserver.com/16717/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((rta) => {
        console.log(rta);
        if (rta == "OK") {
          alert("Producto ingresado");
          window.location.href = "index.html";
        }
       
      })
      .catch((error) => console.error("Error:", error));
      
  }
  
}

function Borrar(idprod) {
  var idProd = idprod;

  const confirmacion = confirm("¿Desea eliminar el producto?");

  if (confirmacion) {
    fetch("https://api.yumserver.com/16717/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idcod: idProd,
      }),
    })
      .then((response) => response.text())
      .then((rta) => {
        if (rta == "OK") {
          console.log(rta);
          alert("Producto eliminado");
          loadProducts();
        }        
      })
      .catch((error) => console.error("Error:", error));      
  }   
}

function Editar(idproducto) {
  miStorage = window.localStorage;

  localStorage.clear();
  var product = products.find((product) => product.idcod == idproducto);
  localStorage.setItem("id", idproducto);
  localStorage.setItem("titulo", product.titulo);
  localStorage.setItem("precioARS", product.precioPeso);
  localStorage.setItem("precioUSD", product.precioDolar);
  localStorage.setItem("fecha", product.fecha);

  window.location.href = "product.html";
}

function ClearStorage() {
  localStorage.clear;
}

function FormStorage() {
  if (localStorage.getItem("id") != null) {
    var idprod = localStorage.getItem("id");
    var name = localStorage.getItem("titulo");
    var precioPeso = localStorage.getItem("precioARS");
    var precioDolar = localStorage.getItem("precioUSD");
    var fecha = localStorage.getItem("fecha");

    document.getElementById("productId").value = idprod;
    document.getElementById("productName").value = name;
    document.getElementById("productPriceARS").value = precioPeso;
    document.getElementById("productPriceUSD").value = precioDolar;
    document.getElementById("productDate").value = fecha;
  }

  localStorage.clear();
}

function Modificar(idprod) {
  var data = {
    idcod: document.getElementById("productId").value,
    titulo: document.getElementById("productName").value,
    precioPeso: document.getElementById("productPriceARS").value,
    precioDolar: document.getElementById("productPriceUSD").value,
    fecha: document.getElementById("productDate").value,
  };

  fetch("https://api.yumserver.com/16717/products", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((rta) => {
      console.log(rta);
      if (rta == "OK") {
        alert("Producto modificado");
        window.location.href = "index.html";
        loadProducts();
      } else {
        alert("Error al modificar el producto");
      }
    })
    .catch((error) => console.error("Error:", error));

  localStorage.clear;
}
