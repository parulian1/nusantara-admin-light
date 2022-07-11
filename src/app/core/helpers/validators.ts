import {AbstractControl, ValidationErrors} from '@angular/forms';
import {Logger} from '@nusantara/core';
//
const logger = new Logger('Core Helper Validators');

export function fileTypeValidator(imageType: Array<string>, files: FileList) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      logger.debug('fileTypeValidator', 'No Value');
      return null;
    }
    let xFileError = false;
    for (let x = 0; x < files.length; x++) {
      logger.debug('fileTypeValidator', 'check image in ', x, ' is type ', imageType);
      xFileError = xFileError || !imageType.includes(files.item(x).type);
    }
    if (!xFileError) {
      logger.debug('fileTypeValidator', 'image in ', imageType);
      return null;
    }
    logger.debug('fileTypeValidator', 'image not in ', imageType);
    return {
      fileType: {
        value: imageType.toString(),
        fileType: imageType,
      }
    };
  };
}

/***
 * Validate file size in KB
 * @param {number} maxSize KB
 * @param {FileList} files
 * @returns {(control: AbstractControl) => (ValidationErrors | null)}
 */
export function fileSizeValidator(maxSize: number, files: FileList) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      logger.debug('fileSizeValidator', 'No Value');
      return null;
    }
    let xFileError = false;
    for (let x = 0; x < files.length; x++) {
      logger.debug('fileSizeValidator', 'check image in ', x, ' is sized ', maxSize, files.item(x).size);
      xFileError = xFileError || !(files.item(0).size <= (maxSize * 1024));
    }
    if (!xFileError) {
      logger.debug('fileSizeValidator', 'image size ', xFileError);
      return null;
    }

    return {
      fileSize: {
        value: maxSize,
        fileSize: files.item(0).size,
      }
    };
  };
}

/**
 * Validate the number of uploaded files input
 *
 * @param {number} maxFile
 * @param {FileList} files
 * @returns {(control: AbstractControl) => (ValidationErrors | null)}
 */
export function maxFileValidator(maxFile: number, files: FileList) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      logger.debug('maxFileValidator', 'No Value');
      return null;
    }
    if (files.length <= maxFile) {
      return null;
    }

    return {
      maxFile: {
        value: maxFile,
      }
    };
  };
}

export function fileNameLengthValidator(maxLength: number, files: FileList) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      logger.debug('fileNameLengthValidator', 'No Value');
      return null;
    }
    if (files.item(0).name.length <= maxLength) {
      return null;
    }
    return {
      fileNameLength: {
        value: maxLength,
      }
    };
  };
}


export function minDateValidator(minDate: Date) {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    if (minDate.getTime() < date.getTime()) {
      return null;
    } else {
      return {
        min: {
          value: control.value,
          expected: minDate.toDateString(),
          min: minDate.toDateString(),
        }
      };
    }
  };
}

export function maxDateValidator(maxDate: Date) {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    if (maxDate.getTime() > date.getTime()) {
      return null;
    } else {
      return {
        max: {
          value: control.value,
          expected: maxDate.toDateString(),
          max: maxDate.toDateString(),
        }
      };
    }
  };
}
