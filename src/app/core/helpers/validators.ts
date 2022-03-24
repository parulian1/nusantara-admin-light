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
    console.log(files.item(0).type);
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
    // console.log(control as any as FileList);
    // return (control as any as FileList)?.item(0).type in imageType ? {fileType: { value: 'Wrong file type'}} : null;
  };
}
