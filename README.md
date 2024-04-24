# NODEJS BACKEND CODERHOUSE
Entrega 1 

## Intalacion 

```bash
# Paso 1: Clonar el repositorio
git clone https://github.com/TomasZalazar/Entrega1_BackEnd.git

# Paso 2: Instalar dependencias (en la carpeta raíz para instalar dependencias)
npm i

# Paso 3: Correr el script en consola en la carpeta raíz "npm run app" para conectar con el servidor de Express
npm run app
````
## Para usar las acciones GET 
levantar el servidor con el script
npm run app
````bash 
# Paso 1: en consola : npm run app 
   (esto corre por dentro nodemon ./src/app.js)
`````
abrir el archivo app.http
````bash 
# Paso 2: abrir archivo y ubicar el mouse en la palabra GET para poder clickearlo y hacer el request 
`````




Estos pasos te permitirán configurar y ejecutar el backend Node.js. Si tienes alguna pregunta o problema, no dudes en preguntar.

## Rutas

```python 

# Products

/api/products

# Cart

/api/cart

````

## Acciones
```python 

# GET

## Recuperar los productos y por su id

GET http://localhost:4000/api/products

GET http://localhost:4000/api/products/:pid

## recuperar el array de carrito

GET http://localhost:4000/api/cart

## Recuperar el carrito por su id

GET http://localhost:4000/api/cart/:cid

# POST 

## Crear un nuevo producto con su body

POST http://localhost:4000/api/products
Content-Type: application/json

{
    "title": "Nuevo producto",
    "description": "esta es la descripcion del nuevo producto",
    "price": 200,
    "code": "AAB01",
    "stock": 30,
    "thumbnails":
}

## Crear un carrito con su cid 

POST http://localhost:4000/api/cart/

## Agregar un producto al carrito creado

POST http://localhost:4000/api/cart/:cid/product/:pid

# PUT
## Actualizar campos de un producto y requisitos del body

PUT http://localhost:4000/api/products/:pid
Content-Type: application/json

{
    "title": "Nuevo producto",
    "description": "esta es la descripcion del nuevo producto",
    "price": 200
}

# DELETE

## Eliminar producto 

DELETE http://localhost:4000/api/products/:pid

````
