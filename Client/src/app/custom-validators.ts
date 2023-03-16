import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


export function passMatchValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        const hasMatch = control.get('password').value === value
        return !hasMatch ? {hasMatch:true}: null;
    }
}


export function hasNumberValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        const hasNumeric = /[0-9]+/.test(value);
        return !hasNumeric ? {hasNumeric:true}: null;
    }
}


export function hasLowercaseValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        const hasLowercase = /[a-z]+/.test(value);
        return !hasLowercase ? {hasLowercase:true}: null;
    }
}


export function hasUppercaseValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null;
        }
        const hasUppercase = /[A-Z]+/.test(value);
        return !hasUppercase ? {hasUppercase:true}: null;
    }
}