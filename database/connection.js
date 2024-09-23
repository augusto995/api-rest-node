const mongoose = require("mongoose");

const connection = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017//mi_blog")

        console.log("Conectado")
    } catch (error) {
        console.log(error);
        throw new Error("No se pudo conectar")
    }
}


module.exports = {
    connection
}