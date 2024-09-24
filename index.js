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
    return rest.status(200).json([{
        curso: "Master",
        autor: "Augusto",
        url: "www.augusto.com"
    },
    {
        curso: "Master",
        autor: "Augusto",
        url: "www.augusto.com"
    }
    ]);
});

app.get("/", (req, rest) => {
    console.log("Se ejecuto endpoint")
    return rest.status(200).send(
        "<h1>Empezando a crear una api rest con node</h1>"
    );
});

//Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto "+puerto)
})