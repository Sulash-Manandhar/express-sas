import { NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

import { isEmpty } from './isEmpty';

export function validateJOISchema<D, S>(data: D, schema: ObjectSchema<S>) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (!isEmpty(error)) return Promise.reject(error);
    return Promise.resolve(value);
}
