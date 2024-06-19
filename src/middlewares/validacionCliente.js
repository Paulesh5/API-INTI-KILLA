import { check, validationResult } from 'express-validator'

const validacionCliente =[
    check(["nombre","cedula"])
        .exists()
            .withMessage('Los campos "nombre" y/o "cedula" son obligatorios')
        .notEmpty()
            .withMessage('Los campos "nombre" y/o "cedula" no pueden estar vacíos')
        .customSanitizer(value => value?.trim()),

    check(["nombre"])
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
            .withMessage('El campo "nombre" debe contener solo letras')
        .customSanitizer(value => value?.trim()),

    check(["cedula"])
        .isLength({ min: 10, max: 13 })
            .withMessage('El campo "cedula" debe tener entre 10 y 13 caracteres')
        .isNumeric()
            .withMessage('El campo "cedula" debe contener solo números')
        .customSanitizer(value => value?.trim()),

    (req,res,next)=>{
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]

export {
    validacionCliente
}