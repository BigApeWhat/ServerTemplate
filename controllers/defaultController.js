const defaultValidator = require('../dataSource/validator/defaultValidator');
const defaultSerializer = require('../dataSource/serializers/defaultSerializer');

const defaultUsecase = require('../domain/usecase/defaultUsecase');
const defaultRepository = require('../repository/defaultRepository');

module.exports = {
    getQuestions(req, res, next) {
        // Input
        const { fieldToCheck } = req.params; // can deconstruct further once all fields are known
        const validatedBody = defaultValidator.validate(fieldToCheck); // validate input is in correct format

        if (validatedBody instanceof Error) {
            return next(validatedBody);
        }

        const payload = { validatedBody }

        // Treatment
        defaultUsecase(defaultRepository, payload, response => { // Callback needed only when returning a promise
            if (response instanceof Error) {
                return next(response);
            }
    
            // Output can be here but better inside usecase
            const serializered = defaultSerializer.serializePostOrder(response);
    
            if (serializered instanceof Error) {
                return next(serializered);
            }
    
            res.status(200).send(serializered); // Or add intermediate to formulate response
        });

    }
}