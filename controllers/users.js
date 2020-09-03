const mongoose = require('mongoose')
const Usuarios = mongoose.model('Users')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")
const isEmpty = require("is-empty")
const validateRegisterInput = require('./validaciones.js')
const validateLoginInput = require('./validaciones.js')

//Listar clientes
module.exports.listaUsuarios = (req, res) => {
  Usuarios
    .find({
      permits: 'cliente'
    })
    .exec((err, results, status) => {
      if(!results || results.length < 1){
        res.status(204).json([{}])
      } else if (err) {
        res.status(404).json(err)
      } else {
        res.status(200).json(results)
      }
    })
}

//Eliminar clientes
module.exports.eliminarUsuario = (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ message: "Se requiere el id del usuario"})
    return
  }
  Usuarios
    .findByIdAndRemove(req.params.id)
    .exec(
      (err, usuario) => {
        if(err){
          res.status(404).json(err)
        } else {
          res.status(204).json(null)
        }
      }
    )
}

//Crear usuario
module.exports.registrarUsuarios = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    console.log("not valid")
    return res.status(400).json(errors)
  }
  Usuarios.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ message: "Ya existe una cuenta con ese Email" })
    } else {
      const newUser = new Usuarios({
        email: req.body.email,
        password: req.body.password,
        permits: req.body.permits ? req.body.permits : 'cliente'
      })
      // Hash password antes de guardar en la base de datos
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
}

//Login
module.exports.loguearUsuarios = (req, res) => {
  const { error } = validateLoginInput(req.body);
  // Validar
  if (!isEmpty(error)) {
    return res.status(400).json(error);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Encontrar usuario por el email
  Usuarios.findOne({ email }).then(user => {
    // Chequear si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Email no encontrado" });
    }
  // Validar password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          email: user.email,
          permits: user.permits
        };
        // Crear token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 año en segundos
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              user: user
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: "Password incorrecto" });
      }
    });
  });
}