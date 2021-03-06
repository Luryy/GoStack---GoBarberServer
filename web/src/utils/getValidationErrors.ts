import { ValidationError } from 'yup';

interface IErrors {
  [key: string]: string;
}

export default function getValidationIErrors(err: ValidationError): IErrors {
  const validationIErrors: IErrors = {};

  err.inner.forEach(error => {
    validationIErrors[error.path] = error.message;
  });
  return validationIErrors;
}
