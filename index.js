import fetch from "node-fetch";

// Base URL de la API FakeStore
const BASE_URL = "https://fakestoreapi.com";

// Función para manejar las solicitudes GET
const getProducts = async (productId = null) => {
  try {
    const url = `${BASE_URL}/products${productId ? `/${productId}` : ""}`; // Uso de template literals para simplificar
    const response = await fetch(url);
    const data = await response.json();

    // Destructuring para extraer datos útiles en caso de producto específico
    if (productId && response.ok) {
      const { id, title, price, category, description, image } = data;
      console.log({ id, title, price, category, description, image });
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error("Se produjo el siguiente error al querer obtener los productos:", error.message);
  }
};

// Función para manejar las solicitudes POST
const createProduct = async (title, price, category) => {
  try {
    const productData = {
      title,
      price: parseFloat(price),
      category,
    };

    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData), // Uso de spread para construir el body de forma dinámica
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
    } else {
      console.log("El siguiente producto ha sido creado con éxito:", { ...data }); // Uso de spread para mostrar el producto creado
    }
  } catch (error) {
    console.error("Se produjo el siguiente error al intentar crear el producto:", error.message);
  }
};

// Función para manejar las solicitudes DELETE
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Error:", await response.json());
    } else {
      console.log(`El producto con ID ${productId} ha sido eliminado correctamente.`);
    }
  } catch (error) {
    console.error("Se produjo el siguiente error al intentar eliminar el producto:", error.message);
  }
};

// Procesar argumentos
const main = async () => {
  const [_, __, method, resource, ...args] = process.argv;
  const [resourceName, resourceId] = resource.split("/");

  if (resourceName !== "products") {
    console.error("Por favor, pruebe con 'products'.");
    return;
  }

  switch (method) {
    case "GET":
      await getProducts(resourceId || null); // Uso de valor por defecto
      break;

    case "POST":
      if (args.length === 3) {
        const [title, price, category] = args;
        await createProduct(...args); // Uso de spread para pasar los argumentos
      } else {
        console.error(
          "Para crear un producto debes ingresar la siguiente información: <title> <price> <category>"
        );
      }
      break;

    case "DELETE":
      if (resourceId) {
        await deleteProduct(resourceId);
      } else {
        console.error(
          "Si desea eliminar un producto, debe proporcionar un productId."
        );
      }
      break;

    default:
      console.error(
        "No reconozco ese comando, por favor utilice uno de los siguientes formatos:"
      );
      console.log("GET products");
      console.log("GET products/<productId>");
      console.log("POST products <title> <price> <category>");
      console.log("DELETE products/<productId>");
      break;
  }
};

// Ejecuta el programa
main();
