import { check, validationResult } from 'express-validator'

const validacionProducto =[
    check(["codigo","nombre","precio_unitario","cantidad"])
        .exists()
            .withMessage('Los campos "codigo" "nombre" "precio_unitario" y/o "cantidad" son obligatorios')
        .notEmpty()
            .withMessage('Los campos "codigo" "nombre" "precio_unitario" y/o "cantidad" no pueden estar vacíos')
        .customSanitizer(value => value?.trim()),

    check(["codigo"])
        .isNumeric()
            .withMessage('El campo "codigo" debe contener solo números')
        .customSanitizer(value => value?.trim()),

    check("precio_unitario")
        .isFloat({ min: 0 })
            .withMessage('El campo "precio_unitario" debe ser un número positivo')
        .customSanitizer(value => value?.trim()),

    check(["cantidad"])
        .isNumeric()
            .withMessage('El campo "cantidad" debe contener solo números')
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
    validacionProducto
}