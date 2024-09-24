const mongoose = require("mongoose");

const connection = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_blog")

        console.log("Conectado correctamente a la base de datos mi_blog")
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar")
    }
}


module.exports = {
    connection
}