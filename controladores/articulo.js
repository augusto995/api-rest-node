const validator = require("validator");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una accion de prueba en mi controlador de articulos"
    })
}

/*
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
    const articulo = new Articulo(parametros);
    //Asignar valores a objeto basado en el modelo (manual o automatico)
    //Guardar el articulo en la base de datos
    articulo.save((error, articuloGuardado) => {
        if( error || !articuloGuardado){
            return res.status(400).json({
                status:"error",
                mensaje: "No se ha guardado el articulo"
            })
        }
        //Devolver resultado
        return res.status(200).json({
        status: "success",
        articulo: articuloGuardado,
        mensaje: "Articulo creado con exito"
    })
    })
}
*/

const crear = async (req, res) => {
    // Recoger parámetros por POST a guardar 
    let parametros = req.body;

    // Validar datos
    try {
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, { min: 5, max: undefined });
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error("No se ha validado la informacion!!!");
        }

        // Crear el objeto
        const articulo = new Articulo(parametros);

        // Guardar el artículo en la base de datos
        const articuloGuardado = await articulo.save();

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito"
        });

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: error.message || "No se ha guardado el articulo"
        });
    }
};

/*
const listar = (req, res) => {
    let consulta = Articulos.find({}).exec((error, articulos) =>{

        if(error || !articulos){
            return res.status(404).json({
                status: "error",
                mensaje: error.message || "No se han encontrado articulos"
            });
        }
        return res.status(200).send({
            status: "success",
            articulos
        })

    })
}
*/

const listar = async (req, res) => {
    try {
        const articulos = await Articulo.find({}).exec(); // Asegúrate de que el modelo está bien nombrado

        if (!articulos || articulos.length === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        return res.status(200).send({
            status: "success",
            articulos
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: error.message || "Error al obtener los artículos"
        });
    }
};




module.exports = {
    prueba,
    crear,
    listar
}