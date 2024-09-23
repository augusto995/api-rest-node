const {connection} = require("./database/connection")
const express = require("express")
const cors = require("cors")


//Conectar a la base de datos
connection()

//Crear server Node

const app = express();
const puerto = 3900

//Configurar cors

app.use(cors())

//Convertir body a objeto js

app.use(express.json())

//Crear rutas

app.get("/probando", (req, rest) => {
    console.log("Se ejecuto endpoint")
    return rest.status(200).send(`
        <div>
            <h1>Probando ruta nodejs</h1>
            <p>Creando api rest con nodejs</p>
        </div>
    `)
})

//Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo,  puerto "+puerto)
})