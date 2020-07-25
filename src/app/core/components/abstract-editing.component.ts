import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Input, Directive } from '@angular/core';

/**
 * Base class for all controls which implement form editing of an
 * entity.  Typically you will not want to inherit from this class
 * when creating standard detail components, instead this
 * should generally be used with sub-components inside a detail
 * component.
 *
 * @see AbstractDetailControl
 */
@Directive()
export abstract class AbstractEditingComponent<TForm extends AbstractControl = FormGroup> {

  @Input() form: TForm;

  get href(): FormControl { return this.form?.get('href') as FormControl; }

  /**
   * URL to be used for an image preview, when there is no image available.
   */
  get emptyImagePreviewURL(): string {
    return '/assets/no-image_id.png';
  }

  /**
   * Returns either the first file in a FileList, or creates an empty file object.
   * This mirrors the DOM's handling of inputs when providing an HTMLFormElement to
   * FormData's constructor, an empty FileList on an HTMLInputElement.
   *
   * @param element reference to an input element
   *
   * @see HTMLFormElement
   * @see FormData
   * @see FileList
   * @see File
   */
  getFirstFileOrDefault(element: HTMLInputElement): File {
    return element.files[0] ?? new File([], '');
  }

  /**
   * Indicates whether the data being edited already exists on the server
   * i.e., whether the data will be saved via a create (POST) or an
   * update (PUT/PATCH).
   */
  get isNew(): boolean {
    return !this.href?.value;
  }


  /**
   * Reads the file set on an HTMLInputElement, and returns that file as a data url
   * that is returned to the callback function.  This is only safe to call on
   * image.
   */
  readFileURL(event: Event, callback: (dataAsURL: string) => void) {
    const target = event.target as HTMLInputElement;
    if (target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (ev) => callback(reader.result as string);
      reader.readAsDataURL(target.files[0]);
    }
  }

  /**
   * Used to set an image on an HTMLImageElement for the purposes
   * of allowing the user to preview the image they've selected.
   *
   * The callback method will return a string (url) that can be
   * set to the src element of some HTMLImageElement.
   *
   * There are 3 primary use cases here:
   * 1. data is null -- a default image will be set (defined by 'emptyImagePreviewURL')
   * 2. data is set by the change event on an input element.
   * 3. data is a string (image file URL sent by the server);  used to set initial state on update.
   */
  setImagePreview(data: Event | string, setterFn: (dataAsUrl) => void) {
    if (!data) {
      setterFn(this.emptyImagePreviewURL);
    } else if (data instanceof Event) {
      this.readFileURL(data, setterFn);
    } else {
      setterFn(data);
    }
  }
}
