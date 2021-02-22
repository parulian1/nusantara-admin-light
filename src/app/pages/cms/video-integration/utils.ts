import { AbstractControl } from '@angular/forms';


export const youtubeUrl = (youtubeId: string, needReturn = true) => {
  if (!youtubeId && !needReturn) { return; }
  return `https://www.youtube.com/watch?v=${youtubeId}`;
};


export const getYoutubeIdFromUrl = (url: string, needReturn = true) => {
  if (!url) { return url ? needReturn : null; }

  // raise error mean something not good with url
  try {
    const params = new URLSearchParams((new URL(url)).search);
    return params?.get('v');
  } catch (e) {
    return url ? needReturn : null;
  }
};


/**
 * Validator to check youtube url is correct or not
 * correct mean include youtube_id
 */
export const youtubeUrlValidator = (control: AbstractControl): { [key: string]: any } | null => {
    return getYoutubeIdFromUrl(control.value, false)
      ? null : {invalidYoutubeUrl: control.value};
};
