import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OrderDownloadShippingLabel {
  constructor(private httpClient: HttpClient) {}

  getFile(href: string) {
    return this.httpClient
      .get<Blob>(href, {
        observe: "response",
        responseType: "blob" as "json",
      })
      .subscribe((response: HttpResponse<Blob>) => {
        const type = this.getFileType(response);

        if (type === "application/pdf") {
          this.downloadPdfFile(response);
        } else if (type === "text/html; charset=utf-8") {
          this.openDownloadHtml(response);
        }
      });
  }

  getFileName(response: HttpResponse<Blob>) {
    let filename: string;
    try {
      const contentDisposition: string = response.headers.get(
        "content-disposition"
      );

      const r = /.*filename=([\'\"]?)([^\"]+)\1/;

      filename = r.exec(contentDisposition)[2];
    } catch (e) {
      filename = "shipping-label.pdf";
    }
    return filename;
  }

  getFileType(response: HttpResponse<Blob>) {
    const contentType = response.headers.get("content-type");
    return contentType;
  }

  downloadPdfFile(response: HttpResponse<Blob>) {
    let filename: string = this.getFileName(response);
    let binaryData = [];
    binaryData.push(response.body);
    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(
      new Blob(binaryData, { type: "application/pdf" })
    );
    downloadLink.setAttribute("download", filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  openDownloadWindow(labelUrl: string) {
    let windowContent = "<!DOCTYPE html>";
    windowContent += "<html>";
    windowContent += "<head><title>Print</title></head>";
    windowContent += "<body>";
    windowContent += '<img src="' + labelUrl + '">';
    windowContent += "</body>";
    windowContent += "</html>";

    const printWin = window.open(
      "",
      "",
      "width=" + screen.availWidth + ",height=" + screen.availHeight
    );
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener(
      "load",
      () => {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();
      },
      true
    );
  }

  openDownloadHtml(response: HttpResponse<Blob>) {
    const reader = new FileReader();
    reader.readAsText(response.body);
    reader.onloadend = function () {
      const text: string = reader.result as string;
      const printWin = window.open(
        "",
        "",
        "width=" + screen.availWidth + ",height=" + screen.availHeight
      );
      printWin.document.open();
      let iFrame = printWin.document.createElement("IFRAME");
      iFrame.setAttribute("srcdoc", text);
      iFrame.setAttribute("height", "100%");
      iFrame.setAttribute("width", "100%");
      printWin.document.appendChild(iFrame);
    };
  }
}
