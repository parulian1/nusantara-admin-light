import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class OrderDownloadFileService {
  downloadAsCsv(data: string, type: string) {
    let filename: string;
    const today = moment().format('YYYY-MM-DD').toString();

    if(type === 'product-list'){ filename = `PL-${today}`; }
    if(type === 'order-list'){ filename = `OL-${today}`; }

    let blob = new Blob(["\ufeff" + data], {
      type: "text/csv;charset=utf-8;",
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf("Safari") !== -1 &&
      navigator.userAgent.indexOf("Chrome") === -1;

    //if Safari open in new window to save file with random filename.
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
}