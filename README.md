# NODEJS BACKEND CODERHOUSE



## Instalación

```bash
# Paso 1: Clonar el repositorio
git clone https://github.com/TomasZalazar/Entrega1_BackEnd.git

# Paso 2: Instalar dependencias (en la carpeta raíz para instalar dependencias)
npm i

# Paso 3: Correr el script en consola en la carpeta raíz "npm run app" para conectar con el servidor de Express
npm run app
```

Para usar las acciones GET, levantar el servidor con el script `npm run app`.

```bash
# Paso 1: en consola : npm run app
   (esto corre por dentro nodemon ./src/app.js)

# Paso 2: abrir archivo app.http y ubicar el mouse en la palabra GET para poder clickearlo y hacer el request
```

Estos pasos te permitirán configurar y ejecutar el backend Node.js. Si tienes alguna pregunta o problema, no dudes en preguntar.

## Rutas

### Productos

- [http://localhost:4000/api/db/products](http://localhost:4000/api/db/products)

### Usuarios

- [http://localhost:4000/api/db/users](http://localhost:4000/api/db/users)

### Carrito

- [http://localhost:4000/api/db/cart](http://localhost:4000/api/db/cart)

### Chat

- [http://localhost:4000/api/db/chat](http://localhost:4000/api/db/chat)

### Vista chat

- [http://localhost:4000/chat](http://localhost:4000/chat)

### Inicio

- [http://localhost:4000/home](http://localhost:4000/home)

### Productos en tiempo real

- [http://localhost:4000/realtimeproducts](http://localhost:4000/realtimeproducts)

## Acciones

### Recuperar Productos (GET)

- Recuperar todos los productos: [GET http://localhost:4000/api/db/products](http://localhost:4000/api/db/products)
- Recuperar un producto por su ID: [GET http://localhost:4000/api/db/products/:pid](http://localhost:4000/api/db/products/:pid)
- Recuperar el array de carrito: [GET http://localhost:4000/api/db/cart](http://localhost:4000/api/db/cart)
- Recuperar el carrito por su ID: [GET http://localhost:4000/api/db/cart/:cid](http://localhost:4000/api/cart/:cid)

### Crear Productos (POST)



  - Crear un carrito con usuario y producto : [POST http://localhost:4000/api/db/cart](http://localhost:4000/api/cart)

  ```
  {
  "_user_id": "664b2cb2c29eda94e08c7689",
  "products": [
    {
      "_id": "66466792744170cc87f10813",
      "qty": 1
    }
    ]
  }
  ```
- Agregar un producto al carrito creado: [POST http://localhost:4000/api/cart/:cid/product/:pid](http://localhost:4000/api/cart/:cid/product/:pid)
 - Crear un nuevo producto: [POST http://localhost:4000/api/db/products](http://localhost:4000/api/db/products)
  ```
  {
      "title": "Nuevo producto",
      "description": "esta es la descripcion del nuevo producto",
      "price": 200,
      "code": "AAB01",
      "stock": 30,
      "thumbnails": "http://example.com",
      "category" : "categoria del producto"
  }
  ```

### Actualizar Productos (PUT)



- Actualizar Producto por su id: [PUT http://localhost:4000/api/db/products/:id](http://localhost:4000/api/db/products/:id)
- Actualizar Usuario por su id: [PUT http://localhost:4000/api/db/users/:id](http://localhost:4000/api/db/users/:pid)
- Actualizar Carrito por su id: [PUT http://localhost:4000/api/db/cart/:id](http://localhost:4000/api/db/cart/:id)


### Elimnar por su id (DELETE)

- \*\* Metodo DELETE

 
- Eliminar Producto por su id: [DELETE http://localhost:4000/api/db/products/:id](http://localhost:4000/api/db/products/:id)
- Eliminar Usuario por su id: [DELETE http://localhost:4000/api/db/users/:id](http://localhost:4000/api/db/users/:pid)
- Eliminar Carrito por su id: [DELETE http://localhost:4000/api/db/cart/:id](http://localhost:4000/api/db/cart/:id)





````phyton

Gracias por tomarte el tiempo de leer mi proyecto. 
saludos Zalazar Tomas🚀

````