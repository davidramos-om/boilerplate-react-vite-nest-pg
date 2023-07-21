import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'uppercaseWithoutSpecialChars', async: false })
export class UppercaseWithoutSpecialCharsConstraint implements ValidatorConstraintInterface {

    validate(text: string): boolean {
        // Check if the text is upercase and does not contain special characters or spaces except for the underscore and dash
        return text === text.toUpperCase() && /^[A-Z0-9_-]+$/.test(text);;
    }

    defaultMessage(): string {
        return 'El campo $property debe estar en mayúsculas y no debe contener caracteres especiales ni espacios';
    }
}

export function UppercaseWithoutSpecialChars(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'lowercaseWithoutSpecialChars',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UppercaseWithoutSpecialCharsConstraint,
        });
    };
}