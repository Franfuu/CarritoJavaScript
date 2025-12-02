document.addEventListener("DOMContentLoaded", () => {
  /* Clase Comida
   *   - Atributos:
   *     + nombre
   *     + precio
   *     + imagen
   *   - Constructor
   */
  class Comida {
    constructor(nombre, precio, imagen) {
      this.nombre = nombre;
      this.precio = precio;
      this.imagen = imagen;
    }
  }

  // Función que devuelve las comidas en formato JSON, simulando que se obtienen de un servidor
  function getComidasJSON() {
    return '[{"nombre":"Hamburguesa","precio":7.5,"imagen":"https://cdn-icons-png.flaticon.com/512/3075/3075977.png"},{"nombre":"Pizza","precio":9,"imagen":"https://cdn-icons-png.flaticon.com/512/1404/1404945.png"},{"nombre":"Porción","precio":1.5,"imagen":"https://cdn-icons-png.flaticon.com/512/3595/3595455.png"},{"nombre":"Helado","precio":3,"imagen":"https://cdn-icons-png.flaticon.com/512/1867/1867015.png"}]';
  }

  // crearElemento(comida) genera el div de la lista de productos correspondiente a la comida pasada por argumento
  function crearElemento(comida) {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.draggable = true;

    productDiv.innerHTML =
      '<img src="' +
      comida.imagen +
      '" alt="' +
      comida.nombre +
      '">' +
      "<span>" +
      comida.nombre +
      "</span>" +
      "<strong>" +
      comida.precio.toFixed(2) +
      "€</strong>";

    // EventListener para cuando comienza el arrastre
    productDiv.addEventListener("dragstart", (e) => {
      productDiv.classList.add("dragging");
      e.dataTransfer.setData("name", comida.nombre);
      e.dataTransfer.setData("price", comida.precio);
    });

    // EventListener para cuando termina el arrastre
    productDiv.addEventListener("dragend", () => {
      productDiv.classList.remove("dragging");
    });

    return productDiv;
  }

  // Cargar productos desde JSON
  function cargarComidas() {
    setTimeout(() => {
      const json = getComidasJSON();

      // Crear array de objetos de la clase Comida a partir del JSON
      const comidasArray = JSON.parse(json);
      const comidas = comidasArray.map(
        (c) => new Comida(c.nombre, c.precio, c.imagen)
      );

      // Crear elementos de la lista de productos y añadirlos
      const productList = document.getElementById("product-list");
      comidas.forEach((comida) => {
        const elemento = crearElemento(comida);
        productList.appendChild(elemento);
      });

      // Eliminar spinner
      document.getElementById("spinner").remove();

      // Mostrar lista de productos
      productList.classList.add("show");
    }, 3000);
  }
  cargarComidas();

  // DROPZONE
  const dropzone = document.querySelector(".dropzone");

  // Añadir clase over al arrastrar por encima
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("over");
  });

  // Eliminar clase over al dejar la zona de arrastre
  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("over");
  });

  // Cuando se suelte, obtener el nombre y el precio del objeto event y añadirlo al carrito
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("over");

    const name = e.dataTransfer.getData("name");
    const price = parseFloat(e.dataTransfer.getData("price"));

    addToCart(name, price);
  });

  // updateOrderTotal(): Actualiza el total del pedido
  function updateOrderTotal() {
    const cartItems = document.querySelectorAll(".cart-item");
    let total = 0;

    cartItems.forEach((item) => {
      const price = parseFloat(item.dataset.price);
      total += price;
    });

    document.getElementById("total").textContent = total.toFixed(2) + "€";
  }

  // addToCart(name, price): Crea el elemento li del carrito
  function addToCart(name, price) {
    const cartList = document.getElementById("cart-list");
    const cartItem = document.createElement("li");
    cartItem.className = "cart-item";
    cartItem.dataset.price = price;

    cartItem.innerHTML = `
      <span>${name}</span>
      <span>${price.toFixed(2)}€</span>
    `;

    // Listener para eliminar elemento al hacer clic
    cartItem.addEventListener("click", () => {
      cartItem.remove();
      updateOrderTotal();
    });

    cartList.appendChild(cartItem);
    updateOrderTotal();
  }

  // mostrarModalPedido(): Crea el contenido del modal de confirmación
  function mostrarModalPedido() {
    const modalBody = document.getElementById("modal-body");
    const cartItems = document.querySelectorAll(".cart-item");

    if (cartItems.length === 0) {
      modalBody.innerHTML = "<p>El carrito está vacío</p>";
    } else {
      let content =
        '<ul style="text-align: left; list-style: none; padding: 0;">';
      let total = 0;

      cartItems.forEach((item) => {
        const name = item.querySelector("span:first-child").textContent;
        const price = parseFloat(item.dataset.price);
        total += price;
        content += `<li style="margin: 0.5rem 0;">${name} - ${price.toFixed(
          2
        )}€</li>`;
      });

      content += "</ul>";
      content += `<hr><strong>Total: ${total.toFixed(2)}€</strong>`;
      modalBody.innerHTML = content;
    }

    document.getElementById("modal").classList.add("show");
  }

  // Enlazar botón "Realizar pedido" con mostrarModalPedido
  document
    .getElementById("submit-order")
    .addEventListener("click", mostrarModalPedido);

  // Enlazar botón "Cancelar" para cerrar modal
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal").classList.remove("show");
  });

  // Enlazar botón "Confirmar pedido" con confirmarPedido
  document
    .getElementById("confirm-order")
    .addEventListener("click", confirmarPedido);

  function confirmarPedido() {
    // Oculta el modal de confirmación
    document.getElementById("modal").classList.remove("show");

    // Muestra el modal de éxito
    document.getElementById("success-modal").classList.add("show");

    setTimeout(() => {
      // Oculta el modal de éxito
      document.getElementById("success-modal").classList.remove("show");

      // Vaciar el carrito y poner totales a 0
      document.getElementById("cart-list").innerHTML = "";
      document.getElementById("total").textContent = "0.00€";
    }, 2000);
  }
});
