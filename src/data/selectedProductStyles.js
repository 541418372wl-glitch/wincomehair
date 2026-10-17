// Product selection approved for display; order terms are confirmed per style.
export const selectedProductStyles = {
  "scrunchies": {
    "title": "Selected Scrunchie Styles",
    "intro": "Compare an oversized silhouette, mulberry silk and a rhinestone satin finish.",
    "items": [
      {
        "id": "oversized",
        "group": "Scrunchies",
        "title": "Oversized Polyester Scrunchie",
        "tag": "VOLUME & TEXTURE",
        "alt": "Solid-color oversized scrunchies arranged on a light background",
        "intro": "A gathered silhouette in solid colors, with regular fabric and larger satin options.",
        "facts": [
          [
            "Material",
            "100% polyester"
          ],
          [
            "Options",
            "Regular fabric · Satin"
          ]
        ],
        "details": "Choose the fabric option before comparing sizes. The regular and satin versions have different outer diameters.",
        "table": {
          "heads": [
            "Fabric option",
            "Approx. outer diameter"
          ],
          "rows": [
            [
              "Regular solid-color fabric",
              "13–14 cm"
            ],
            [
              "Larger satin option",
              "16–18 cm"
            ]
          ]
        },
        "note": "Product photography shows the style and color selection; it does not identify the size of each pictured item.",
        "image": "/assets/images/selected-oversized-polyester-scrunchie.webp",
        "imageWidth": 1200,
        "imageHeight": 1200
      },
      {
        "id": "silk",
        "group": "Scrunchies",
        "title": "Mulberry Silk Scrunchie",
        "tag": "SILK & SIZE CHOICE",
        "alt": "Mulberry silk scrunchies in a selection of soft and neutral colors",
        "intro": "Mulberry silk with an elastic inner band, offered in four listed width options.",
        "facts": [
          [
            "Fabric",
            "100% mulberry silk"
          ],
          [
            "Size options",
            "4 listed widths"
          ]
        ],
        "details": "Compare the listed width with the corresponding outer diameter to select a size.",
        "table": {
          "heads": [
            "Listed width",
            "Approx. outer diameter"
          ],
          "rows": [
            [
              "2 cm",
              "6 cm"
            ],
            [
              "4 cm",
              "8 cm"
            ],
            [
              "6 cm",
              "12 cm"
            ],
            [
              "8 cm",
              "16 cm"
            ]
          ]
        },
        "note": "Dimensions are manually measured and may vary slightly. Product photos show the style; they are not a to-scale size comparison.",
        "image": "/assets/images/selected-mulberry-silk-scrunchie.webp",
        "imageWidth": 800,
        "imageHeight": 800
      },
      {
        "id": "rhinestone",
        "group": "Scrunchies",
        "title": "Rhinestone Satin Scrunchie",
        "tag": "SATIN & SHIMMER",
        "alt": "Champagne-colored polyester satin scrunchie with rhinestone decoration on a plate",
        "intro": "Polyester charmeuse satin with hot-fix rhinestones for a decorative finish.",
        "facts": [
          [
            "Fabric",
            "100% polyester satin"
          ],
          [
            "Outer diameter",
            "Approx. 12–14 cm"
          ]
        ],
        "details": "A satin scrunchie with rhinestones attached using a hot-fix process.",
        "extra": [
          [
            "Band width",
            "Approx. 5 cm"
          ]
        ],
        "care": "Gently hand wash in cold water. Avoid rubbing the embellished area. Do not machine wash, spin-dry or tumble dry at high temperature. Dry flat in the shade.",
        "image": "/assets/images/selected-rhinestone-satin-scrunchie.webp",
        "imageWidth": 1254,
        "imageHeight": 1254
      }
    ]
  },
  "headbands": {
    "title": "Soft Fabric Headbands",
    "intro": "Two fabric constructions, with gathered detailing and solid-color options.",
    "items": [
      {
        "id": "ruched",
        "group": "Fabric headbands",
        "title": "Ruched Wide Fabric Headband",
        "tag": "SOFT FABRIC · GATHERED SHAPE",
        "alt": "Black ruched fabric headband worn across the forehead, alongside black, white and grey styles",
        "intro": "A wide, gathered fabric design with an elastic construction and a soft draped appearance.",
        "facts": [
          [
            "Style",
            "Wide, ruched fabric"
          ],
          [
            "Listed flat size",
            "24 cm long × 14 cm wide"
          ]
        ],
        "details": "The product diagram lists a flat length of 24 cm and a width of 14 cm. These are flat product dimensions, not a recommended head circumference.",
        "note": "The photo shows the style and available color directions, not a measurement diagram.",
        "image": "/assets/images/selected-ruched-fabric-headband.webp",
        "imageWidth": 1500,
        "imageHeight": 1500
      },
      {
        "id": "stretch",
        "group": "Fabric headbands",
        "title": "Solid Stretch Fabric Headband",
        "tag": "SOLID COLOR · ELASTIC INNER BAND",
        "alt": "Blue soft fabric headband with a black elastic joining section on a white background",
        "intro": "A solid-color nylon-and-spandex fabric headband with a black elastic inner band.",
        "facts": [
          [
            "Fabric",
            "Nylon and spandex"
          ],
          [
            "Construction",
            "Fabric-covered elastic band"
          ]
        ],
        "details": "The outer fabric wraps around a black elastic inner band. This style has no silicone anti-slip strip.",
        "image": "/assets/images/selected-stretch-fabric-headband.webp",
        "imageWidth": 900,
        "imageHeight": 1200
      }
    ]
  }
};

const detailSlugs = {
  oversized: 'oversized-polyester-scrunchie',
  silk: 'mulberry-silk-scrunchie',
  rhinestone: 'rhinestone-satin-scrunchie',
  ruched: 'ruched-wide-fabric-headband',
  stretch: 'solid-stretch-fabric-headband',
};

export const selectedProducts = Object.entries(selectedProductStyles).flatMap(([category, selection]) =>
  selection.items.map(product => ({ ...product, category, slug: detailSlugs[product.id] }))
);

export function selectedProductPath(product) {
  return `/products/${detailSlugs[product.id]}`;
}

export function findSelectedProduct(slug) {
  return selectedProducts.find(product => product.slug === slug);
}

export function selectedProductInquiryPath(product) {
  return `/contact?product=${detailSlugs[product.id]}`;
}
