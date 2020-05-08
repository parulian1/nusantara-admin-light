export const PRODUCT_CLASSES_GET_RESPONSES = {
  '/catalog/product-classes/': {
    status: 200,
    body: [
      {
        name: 'Books',
        href: 'https://bhisma.cloud/api/catalog/categories/books/',
        icon: {
          href: 'https://picsum.photos/32/32',
          height: 32,
          width: 32
        },
        products: {
          href: '',
          count: 6
        },
        sourceMappings: ['retail > buku', '0031', '0234/234'],
        children: []
      },
      {
        name: 'Cosmetics',
        href: 'https://bhisma.cloud/api/catalog/categories/cosmetics/',
        icon: {
          href: 'https://picsum.photos/32/32',
          height: 32,
          width: 32
        },
        products: {
          href: '',
          count: 10
        },
        sourceMappings: [],
        children: [
          {
            name: 'Lipstick',
            href: 'https://bhisma.cloud/api/catalog/categories/cosmetics/lipstick/',
            icon: {
              href: 'https://picsum.photos/32/32',
              height: 32,
              width: 32
            },
            products: {
              href: '',
              count: 3
            },
            sourceMappings: [],
            children: []
          }
        ]
      }
    ]
  },
};
