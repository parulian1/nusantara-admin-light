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
    if (imageType.includes(files.item(0).type)) {
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
 * @param {number} maxSize
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
    if (files.item(0).size <= (maxSize * 1024) ) {
      return null;
    }
    logger.debug('fileSizeValidator', 'image size over ', files.item(0).size);
    return {
      fileSize: {
        value: maxSize,
        fileSize: files.item(0).size,
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
