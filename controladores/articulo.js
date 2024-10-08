const fs = require("fs")
const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");


/*
Codigo viejo
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
  //Recogemos parametros por post a guardar
  let parametros = req.body;

  //Validar datos
  try {
    validarArticulo(parametros)
    //Crear el objeto
    const articulo = new Articulo(parametros);

    //Guardar el articulo en la base de datos
    const articuloGuardado = await articulo.save();

    //Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con exito",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: error.message || "No se ha guardado el articulo",
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
    const articulos = await Articulo.find({}).sort({ fecha: -1 }).exec();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos",
      });
    }

    return res.status(200).send({
      status: "success",
      articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: error.message || "Error al obtener los artículos",
    });
  }
};

const uno = async (req, res) => {
  try {
    // Recoger el ID de los parámetros de la solicitud
    let id = req.params.id;

    // Buscar el artículo por ID usando await
    const articulo = await Articulo.findById(id);

    // Si no se encuentra el artículo o hay algún problema
    if (!articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el artículo",
      });
    }

    // Devolver el artículo encontrado
    return res.status(200).json({
      status: "success",
      articulo,
    });
  } catch (error) {
    // Manejar cualquier error (como si el ID es inválido)
    return res.status(500).json({
      status: "error",
      mensaje: error.message || "Error al obtener el artículo",
    });
  }
};

const borrar = async (req, res) => {
  try {
    let articuloId = req.params.id;

    const articulo = await Articulo.findOneAndDelete({ _id: articuloId });

    if (!articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "Artículo no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Artículo borrado con éxito",
      articulo: articulo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: error.message || "Error al eliminar el artículo",
    });
  }
};

const editar = async (req, res) => {
    try {

    let parametros = req.body;
    let articuloId = req.params.id;

      validarArticulo(parametros)
  
      // Actualizar el artículo
      const articuloActualizado = await Articulo.findOneAndUpdate(
        { _id: articuloId },
        parametros,
        { new: true } // Devuelve el artículo actualizado
      );
  
      // Comprobar si se encontró y actualizó
      if (!articuloActualizado) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se ha encontrado el artículo para actualizar",
        });
      }
  
      // Respuesta exitosa
      return res.status(200).json({
        status: "success",
        mensaje: "Artículo actualizado con éxito",
        articulo: articuloActualizado,
      });
  
    } catch (error) {
      return res.status(500).json({
        status: "error",
        mensaje: error.message || "Error al actualizar el artículo",
      });
    }
  };
  
  const subir = async (req, res) => {
    // Verificar si no se subió ningún archivo
    if (!req.file && !req.files) {
      return res.status(404).json({
        status: "error",
        mensaje: "Petición inválida",
      });
    }
  
    // Nombre y extensión del archivo
    let archivo = req.file.originalname;
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];
  
    // Comprobar extensiones permitidas
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
      // Eliminar el archivo si la extensión no es válida
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({
          status: "error",
          mensaje: "Imagen inválida",
        });
      });
    } else {
      // Si la imagen es válida, actualizamos el artículo
      try {
        let articuloId = req.params.id; // ID del artículo desde los parámetros de la URL
  
        // Actualizar el campo de imagen del artículo
        const articuloActualizado = await Articulo.findOneAndUpdate(
          { _id: articuloId },
          { imagen: req.file.filename }, // Actualiza el campo "imagen" del artículo
          { new: true } // Devuelve el artículo actualizado
        );
  
        if (!articuloActualizado) {
          return res.status(404).json({
            status: "error",
            mensaje: "No se ha encontrado el artículo para actualizar",
          });
        }
  
        return res.status(200).json({
          status: "success",
          mensaje: "Imagen subida y artículo actualizado con éxito",
          articulo: articuloActualizado,
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          mensaje: error.message || "Error al actualizar el artículo",
        });
      }
    }
  };

  /*
  const buscador = (req, res) => {

    //Sacar el string de busqueda
    let busqueda = req.params.busqueda;
    //Find OR
    Articulo.find({ "$or": [
      { "titulo": {"$regex": busqueda, "$options": "i"}},
      { "contenido": {"$regex": busqueda, "$options": "i"}},

    ]})
    .sort({fecha: -1})
    .exec((error, articulosEncontrados) => {

      if(error || !articulosEncontrados || articulosEncontrados.length <= 0){
        return res.status(404).json({
          status: "error",
          mensaje: "No se ha encontrado el artículos"
        })
      }
      return res.status(200).json({
        status: "success",
        articulos: articulosEncontrados
      })

    })
  }
   */

  const buscador = async (req, res) => {
    try {
        let busqueda = req.params.busqueda;

        if (!busqueda || busqueda.trim() === "") {
            return res.status(400).json({
                status: "error",
                mensaje: "La búsqueda no puede estar vacía."
            });
        }

        const articulosEncontrados = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } },
            ]
        })
        .sort({ fecha: -1 });

        if (articulosEncontrados.length <= 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontraron artículos que coincidan con la búsqueda."
            });
        }

        return res.status(200).json({
            status: "success",
            articulos: articulosEncontrados
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en el servidor: " + error.message
        });
    }
};


module.exports = {
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  buscador
};
