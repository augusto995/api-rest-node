const validator = require("validator")
const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una accion de prueba en mi controlador de articulos"
    })
}

const crear = (req, res) => {

    //recoger parametros por post a guardar 
    let parametros = req.body;

    //Validar datos
    try{

        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, {min: 5, max: undefined});
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if(!validar_titulo || !validar_contenido){
            throw new Error("No se ha validado la informacion!!!")
        }

    }catch(error){
        return res.status(400).json({
            status:"error",
            mensaje: "Faltan datos por enviar"
        })

    }

    //Crear el objeto

    //Asignar valores a objeto basado en el modelo (manual o automatico)

    //Guardar el articulo en la base de datos

    //Devolver resultado
    return res.status(200).json({
        mensaje: "Accion de guardar"
    })
}

module.exports = {
    prueba,
    crear
}