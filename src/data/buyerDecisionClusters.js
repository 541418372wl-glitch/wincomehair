export const HAIR_CLIP_BUYER_DECISION_CLUSTER = 'hair-clips-buyer-path';

export const buyerDecisionClusters = {
  [HAIR_CLIP_BUYER_DECISION_CLUSTER]: {
    id: HAIR_CLIP_BUYER_DECISION_CLUSTER,
    title: 'Hair Clip Buyer Decision Path',
    description: 'Make the decisions in order: define the hair profile and hold requirement, select the material and finish, then put MOQ, sample and QC terms into the quote.',
    hub: {
      route: '/products/category/hair-clips-barrettes',
      label: 'Compare custom hair clips and barrettes',
    },
    supportLinks: [
      { route: '/quality', label: 'Review quality control' },
      { route: '/contact', label: 'Request a quote' },
    ],
    steps: [
      {
        number: '01',
        slug: 'best-barrettes-fine-thin-hair',
        label: 'Fit & retention',
        question: 'Which hair profile and hairstyle must the clip hold without painful pulling?',
      },
      {
        number: '02',
        slug: 'metal-hair-clip-material-guide',
        label: 'Material & finish',
        question: 'Which body, spring and finish fit the geometry, market and claim?',
      },
      {
        number: '03',
        slug: 'hair-accessories-moq-guide',
        label: 'MOQ, sample & QC',
        question: 'Which minimum, sample evidence and inspection terms belong in the quote?',
      },
    ],
  },
};
