export const CATEGORY_GET_RESPONSES = {
  '/api/catalog/category/': {
    status: 200,
    body: [
      {
        name: 'Books',
        href: 'https://bhisma.cloud/api/catalog/category/books/',
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
        href: 'https://bhisma.cloud/api/catalog/category/cosmetics/',
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
            href: 'https://bhisma.cloud/api/catalog/category/cosmetics/lipstick/',
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
  '/api/catalog/category/books/': {
    status: 200,
    body: {
      name: 'Books',
      icon: {
        href: 'https://picsum.photos/32/32',
        height: 32,
        width: 32
      },
      products: {
        href: '',
        count: 6
      },
      sourceMappings: [],
      href: 'https://bhisma.cloud/api/catalog/category/books/',
      children: []
    }
  },
  '/api/catalog/category/cosmetics/': {
    status: 200,
    body: {
      name: 'Cosmetics',
      href: 'https://bhisma.cloud/api/catalog/category/cosmetics/',
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
          href: 'https://bhisma.cloud/api/catalog/category/cosmetics/lipstick/',
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
  },
  '/api/catalog/category/cosmetics/lipstick/': {
    status: 200,
    body: {
      name: 'Lipstick',
      href: 'https://bhisma.cloud/api/catalog/category/cosmetics/lipstick/',
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
  },
};
