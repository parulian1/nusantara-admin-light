export interface IProduct {
  href: string;
  name: string;
  upc: string;
  description: string;
  vendor: string;
  productClass: string;
  media: Array<{href: string; type: string; youtubeVideoId: string;}>;
  weight: number;
  category: string;
  // related[]
  // attributes
}


// export interface IMedia {
//   href: string;
//   type: 'video'|'image';
// }

// export interface IDisplayedPrice {
//   current: number;
//   regular: number;
// }


// "related": [
//   {
//     "href": "https://bhisma.cloud/hahahahahhahahaa",
//     "name": "PAC Blush On-c-01",
//     "vendor": {
//       "href": "https://bhisma.cloud/wahtever",
//       "name": "PAC"
//     },
//     "price": {
//       "current": 123800,
//       "regular": 150000
//     },
//     "image": "https://bhisma.cloud/hah"
//   }
// ],

// export interface IProduct {
//   name: string;
//   description: string;
//   vendor: IEntityHref;
//   media: Array<IMedia>;
//   price: IDisplayedPrice;
//   related: Array<any>;



//
//   "attributes": [
//     {
//       "name": "Bahan-Bahan",
//       "type": "multiline_text",
//       "value": "lorem bla bla bla"
//     },
//     {
//       "name": "Color",
//       "type": "image",
//       "value": "Y315 - Sand",
//       "href": "https://bhisma.cloud/heh",
//       "image": "https://bhisma.cloud/heh",
//       "variants": [
//         {
//           "value": "Y316 - Sand",
//           "href": "https://bhisma.cloud/heh", //link detail produk ke API
//           "image": "https://bhisma.cloud/heh",
//           "inStock": true,
//           "isBestSeller": true
//         }
//       ]
//     }
//   ]
// }
// }
