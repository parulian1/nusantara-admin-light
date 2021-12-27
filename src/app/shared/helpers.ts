import { isObject } from 'rxjs/internal-compatibility';


export function getSlugFromHref(href: string): string {
  const r = /^.+\/(.+?)\/$/.exec(href);
  if (r) {
    return r[1];
  }
  return null;
}

/**
 * convert object key snake case to camel case
 */
export function toCamel(key) {
  return key.replace(/([-_][a-z])/ig, (k) => {
    return k.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

/**
 * convert snake case to camel case
 */
export function keysToCamel(param) {
  if (isObject(param)) {
    const n = {};

    Object.keys(param)
      .forEach((k) => {
        n[toCamel(k)] = param[k];
      });

    return n;
  }
  return param;
}

/**
 * convert string with '\n' separator to object
 */
export function convertStringToObject(param: string) {
  const obj = {};
  const paramArray = param.split('\n');
  for (const value of paramArray) {
    const strParts = value.split(':');
    if (strParts[0] && strParts[1]) { // <-- Make sure the key & value are not undefined
      obj[strParts[0].replace(/\s+/g, '')] = strParts[1].trim(); // <-- Get rid of extra spaces at beginning of value strings
    }
  }
  return obj;
}

//
// export function getCategorySlugFromHref(href: string): string {
//   return href.split("value=\"")[1].replace("\"", "");
// }
//
// export function getCategoryTreeFromHref(href: string): string {
//   href = href.split(">;")[0];
//   return ((href.match(/tree=([^&#]*)/g)).pop()).split("=")[1];
// }
//
// export function getAllCategorySlugFromHref(href: string): Array<string> {
//   href = href.split(">;")[0];
//   return href.match(/category=([^&#]*)/g);
// }
//
// export function getQueryFromHref(href: string): string {
//   href = href.split(">;")[0];
//   return ((href.match(/q=([^&#]*)/g)).pop()).split("=")[1];
// }
//
//
// export function getSelectedCategorySlugFromHref(href: string): string {
//   return ((href.match(/category=([^&#]*)/g)).pop()).split("=")[1];
// }
//
// export function removeUrlParam(url) {
//   const query = url.indexOf("?");
//   if (query !== -1) {
//     url = url.split("?")[0];
//   }
//   return url;
//
// }
//
// export function isMobileBrowser() {
//   if ( navigator.userAgent.match(/Android/i)
//     || navigator.userAgent.match(/webOS/i)
//     || navigator.userAgent.match(/iPhone/i)
//     || navigator.userAgent.match(/iPad/i)
//     || navigator.userAgent.match(/iPod/i)
//     || navigator.userAgent.match(/BlackBerry/i)
//     || navigator.userAgent.match(/Windows Phone/i)
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }
//
// export function getFormErrors(ex: any): Array<string> {
//   if (ex instanceof Response) {
//     if (ex.json) {
//       let errorJson: any;
//       try {
//         errorJson = ex.json();
//       } catch (err) {
//         errorJson = ex;
//       }
//       if (!!errorJson.nonFieldErrors) {
//         return errorJson.nonFieldErrors as string[];
//       } else if (!!errorJson.message) {
//         return [errorJson.message, ];
//       } else {
//         return ["An unknown API error occurred", ];
//       }
//     }
//   } else if (ex instanceof Error) {
//     const msg = ex.message || "An unknown error occurred";
//     return [msg, ];
//   } else if (ex.error.message) {
//     const msg = ex.error.message || "An unknown error occurred";
//     return [msg, ];
//   }
//   return ["An unknown error occurred", ];
// }
//
// export function checkNonBookFormat(product: Array<IProductFormat>): boolean {
//   let isNonBook: boolean;
//   isNonBook = false;
//   product.forEach(e => {
//     if (e.format === "non-book" || e.type === "non-book") {
//       isNonBook = true;
//     }
//   });
//   return isNonBook;
// }
//
// export function decryptJWT(jwt) {
//   const base64Url = jwt.split(".")[1];
//   const base64 = base64Url.replace("-", "+").replace("_", "/");
//   return JSON.parse(window.atob(base64));
// }
//
// export function sortByStockLevel(entity) {
//   entity.formats.sort(function(a, b) {
//     const keyA1 = a.stockLevel;
//     const keyA2 = a.name;
//     const keyB1 = b.stockLevel;
//     const keyB2 = b.name;
//
//     if (keyA1 > keyB1) {
//       return -1;
//     }
//     if (keyA1 < keyB1) {
//       return 1;
//     }
//     if (keyA2 > keyB2) {
//       return 1;
//     }
//     if (keyA2 < keyB2) {
//       return -1;
//     }
//     return 0;
//   });
// }
//
// export function sortByPromoPrice(entity, sort) {
//   entity.formats.sort(function(a, b) {
//     const keyA = a.promoPrice;
//     const keyB = b.promoPrice;
//
//     if (keyA > keyB) {
//       return sort === "price_asc" ? 1 : -1;
//     }
//     if (keyA < keyB) {
//       return sort === "price_asc" ? -1 : 1;
//     }
//     return 0;
//   });
// }
//
// export function objectifyQueryString(queryString) {
//   const obj = {};
//   const pairs = queryString.split("&");
//   for (let i = 0; i < pairs.length; i++ ) {
//     const split = pairs[i].split("=");
//     obj[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
//   }
//   return obj;
// }
//
// export function filterUnique(value, index, self) {
//   return self.indexOf(value) === index;
// }
//
// export function checkTypeRibbon(e: IProductSummary) {
//   if (e.formats.length > 0) {
//     return e.formats[0].isPreOrder ? "preorder" : e.isBestseller ? "detail-best-seller" : "";
//   } else {
//     return e.isBestseller ? "detail-best-seller" : "";
//   }
// }

const StringIsNumber = value => isNaN(Number(value)) === false;

// Turn enum into array
export function enumToArray(enumme) {
  return Object.keys(enumme)
      .filter(StringIsNumber)
      .map(key => enumme[key]);
}

/**
 * Get product base price from price list
 */
export function getProductBasePrice(priceLists: Array<any>) {
  const priceData = priceLists.find(obj => {
    return obj.type === 'default';
  });

  let basePrice = 0;
  if (priceData !== undefined) {
    const priceRange = priceData.ranges.find(range => {
      return range.minQuantity === 1;
    });

    if (priceRange !== undefined) {
      basePrice = priceRange.price;
    }
  }

  return basePrice;
}
