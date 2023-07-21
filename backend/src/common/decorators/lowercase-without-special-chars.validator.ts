import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'lowercaseWithoutSpecialChars', async: false })
export class LowercaseWithoutSpecialCharsConstraint implements ValidatorConstraintInterface {

    validate(text: string): boolean {
        // Check if the text is lowercase and does not contain special characters or spaces except for the underscore and dash
        return text === text.toLowerCase() && /^[a-z0-9_-]+$/.test(text);;
    }

    defaultMessage(): string {
        return 'El campo $property debe estar en minúsculas y no debe contener caracteres especiales ni espacios';
    }
}

export function LowercaseWithoutSpecialChars(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'lowercaseWithoutSpecialChars',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: LowercaseWithoutSpecialCharsConstraint,
        });
    };
}