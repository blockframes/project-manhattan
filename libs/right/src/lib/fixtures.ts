import { Right, Terms } from '../lib/model';
import { RightCondition } from '../lib/condition.model';
import { Waterfall } from './waterfall';

export const RIGHTS: Right[] = [
  {
    id: 'originPatheTheatricalDistributionFees',
    orgId: 'pathe',
    percentage: 0.1,
    termsIds: ['originTheatrical'],
    parentIds: ['originTheatrical'],
  },
  {
    id: 'originPartnerTheatricalDistributionFees',
    orgId: 'partner',
    percentage: 0.1111,
    termsIds: ['originTheatrical'],
    parentIds: ['originPatheTheatricalDistributionFees'],
  },
  {
    id: 'originPatheTvDistributionFees',
    orgId: 'pathe',
    percentage: 0.1,
    termsIds: ['originTv'],
    parentIds: ['originTv'],
  },
  {
    id: 'originPartnerTvDistributionFees',
    orgId: 'partner',
    percentage: 0.1111,
    termsIds: ['originTv'],
    parentIds: ['originPatheTvDistributionFees'],
  },
  {
    id: 'originPatheVideoDistributionFees',
    orgId: 'pathe',
    percentage: 0.1,
    termsIds: ['originVideo'],
    parentIds: ['originVideo'],
  },
  {
    id: 'originPartnerVideoDistributionFees',
    orgId: 'partner',
    percentage: 0.1111,
    termsIds: ['originVideo'],
    parentIds: ['originPatheVideoDistributionFees'],
  },
  {
    id: 'originPatheVodDistributionFees',
    orgId: 'pathe',
    percentage: 0.1,
    termsIds: ['originVod'],
    parentIds: ['originVod'],
  },
  {
    id: 'originPartnerVodDistributionFees',
    orgId: 'partner',
    percentage: 0.1111,
    termsIds: ['originVod'],
    parentIds: ['originPatheVodDistributionFees'],
  },
  {
    id: 'rowAllPatheRightsDistributionFees',
    orgId: 'pathe',
    percentage: 0.1,
    termsIds: ['rowAllRights'],
    parentIds: ['rowAllRights'],
  },
  {
    id: 'rowAllPartnerRightsDistributionFees',
    orgId: 'partner',
    percentage: 0.1111,
    termsIds: ['rowAllRights'],
    parentIds: ['rowAllPatheRightsDistributionFees'],
  },
  {
    id: 'originTheatricalExpenses',
    orgId: 'pathe',
    percentage: 1,
    termsIds: ['originTheatrical'],
    parentIds: ['originPartnerTheatricalDistributionFees'],
    conditions: [
      {
        kind: 'right',
        max: 1150000,
        rightId: 'originTheatricalExpenses',
      } as RightCondition,
    ],
  },
  {
    id: 'originVideoExpenses',
    orgId: 'pathe',
    percentage: 1,
    termsIds: ['originVideo'],
    parentIds: ['originPartnerVideoDistributionFees'],
    conditions: [
      {
        kind: 'right',
        max: 137344,
        rightId: 'originVideoExpenses',
      },
    ],
  },
  {
    id: 'rowExpenses',
    orgId: 'pathe',
    percentage: 1,
    termsIds: ['rowAllRights'],
    parentIds: ['rowAllPartnerRightsDistributionFees'],
    conditions: [
      {
        kind: 'right',
        max: 56000,
        rightId: 'rowExpenses',
      },
    ],
  },
  {
    id: 'RNPPAydTheatrical',
    orgId: 'AYD',
    parentIds: ['originTheatricalExpenses'],
    termsIds: ['originTheatrical'],
    percentage: 0.62,
  },
  {
    id: 'RNPPAydVideo',
    orgId: 'AYD',
    parentIds: ['originVideoExpenses'],
    termsIds: ['originVideo'],
    percentage: 0.62,
  },
  {
    id: 'RNPPAydVod',
    orgId: 'AYD',
    parentIds: ['originPartnerVodDistributionFees'],
    termsIds: ['originVod'],
    percentage: 0.62,
  },
  {
    id: 'RNPPAydRow',
    orgId: 'AYD',
    parentIds: ['rowExpenses'],
    termsIds: ['rowAllRights'],
    percentage: 0.62,
  },
  {
    id: 'RNPPAydTv',
    orgId: 'AYD',
    percentage: 0.57,
    parentIds: ['originPartnerTvDistributionFees'],
    termsIds: ['originTv'],
  },
  {
    id: 'tVBroadcasterRNPP',
    orgId: 'tVBroadcaster',
    percentage: 0.08,
    parentIds: ['originPartnerTvDistributionFees'],
    termsIds: ['originTv'],
  },
  {
    id: 'RNPPpatheTheatrical',
    orgId: 'pathe',
    percentage: 0.19,
    parentIds: ['originTheatricalExpenses'],
    termsIds: ['originTheatrical'],
  },
  {
    id: 'RNPPpatheVideo',
    orgId: 'pathe',
    percentage: 0.19,
    parentIds: ['originVideoExpenses'],
    termsIds: ['originVideo'],
  },
  {
    id: 'RNPPpatheVod',
    orgId: 'pathe',
    percentage: 0.19,
    parentIds: ['originPartnerVodDistributionFees'],
    termsIds: ['originVod'],
  },
  {
    id: 'RNPPpatheRow',
    orgId: 'pathe',
    percentage: 0.19,
    parentIds: ['rowExpenses'],
    termsIds: ['rowAllRights'],
  },
  {
    id: 'RNPPpatheTv',
    orgId: 'pathe',
    percentage: 0.175,
    parentIds: ['originPartnerTvDistributionFees'],
    termsIds: ['originTv'],
  },
  {
    id: 'RNPPPartnerTheatrical',
    orgId: 'partner',
    percentage: 0.19,
    parentIds: ['originTheatricalExpenses'],
    termsIds: ['originTheatrical'],
  },
  {
    id: 'RNPPPartnerVideo',
    orgId: 'partner',
    percentage: 0.19,
    parentIds: ['originVideoExpenses'],
    termsIds: ['originVideo'],
  },
  {
    id: 'RNPPPartnerVod',
    orgId: 'partner',
    percentage: 0.19,
    parentIds: ['originPartnerVodDistributionFees'],
    termsIds: ['originVod'],
  },
  {
    id: 'RNPPPartnerRow',
    orgId: 'partner',
    percentage: 0.19,
    parentIds: ['rowExpenses'],
    termsIds: ['rowAllRights'],
  },
  {
    id: 'RNPPPartnerTv',
    orgId: 'partner',
    percentage: 0.175,
    parentIds: ['originPartnerTvDistributionFees'],
    termsIds: ['originTv'],
  },
  {
    id: 'tVBroadcasterSupport',
    orgId: 'tVBroadcaster',
    percentage: 0.1,
    parentIds: ['prodFullSupport'],
    termsIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
  },
  {
    id: 'equitySupport',
    orgId: 'equity',
    percentage: 0.064,
    parentIds: ['prodFullSupport'],
    termsIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
  },
  {
    id: 'prodFullSupport',
    orgId: 'prod',
    parentIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
    termsIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
    percentage: 1,
    conditions: [
      {
        kind: 'right',
        max: 150000,
        rightId: 'prodFullSupport',
      },
    ],
  },
  {
    id: 'prodFollowingSupport',
    orgId: 'prod',
    percentage: 0.5,
    parentIds: ['prodFullSupport'],
    termsIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
  },
  {
    id: 'patheSupport',
    orgId: 'pathe',
    percentage: 0.168,
    parentIds: ['prodFullSupport'],
    termsIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
  },
  {
    id: 'partnerSupport',
    orgId: 'partner',
    percentage: 0.168,
    parentIds: ['prodFullSupport'],
    termsIds: ['theatricalSupport', 'videoSupport', 'tvSupport'],
  },
  {
    id: 'patheBonusSupport',
    orgId: 'pathe',
    percentage: 1,
    parentIds: ['bonusSupport'],
    termsIds: ['bonusSupport'],
  },
  {
    id: 'patheDistSupport',
    orgId: 'pathe',
    percentage: 0.5,
    parentIds: ['theatricalDistSupport', 'videoDistSupport'],
    termsIds: ['theatricalDistSupport', 'videoDistSupport'],
  },
  {
    id: 'partnerDistSupport',
    orgId: 'partner',
    percentage: 1,
    parentIds: ['patheDistSupport'],
    termsIds: ['theatricalDistSupport', 'videoDistSupport'],
  },
];
export const CONDITIONS: RightCondition[] = [
  {
    kind: 'right',
    max: 1150000,
    rightId: 'originTheatricalExpenses',
  },
  {
    kind: 'right',
    max: 137000,
    rightId: 'originVideoExpenses',
  },
  {
    kind: 'right',
    max: 56000,
    rightId: 'rowExpenses',
  },
  {
    kind: 'right',
    max: 150000,
    rightId: 'prodFullSupport',
  },
];
export const TERMS: Terms[] = [
  {
    id: 'originTheatrical',
    title: 'Exploitation Salles',
    territories: {
      included: ['France', 'Switzerland', 'Belgium'],
      excluded: [],
    },
    channels: {
      included: ['theatrical'],
      excluded: [],
    },
    type: 'origin',
  },
  {
    id: 'originTv',
    title: 'Exploitation TV',
    territories: {
      included: ['France', 'Switzerland', 'Belgium'],
      excluded: [],
    },
    channels: {
      included: ['pay-tv', 'free-tv'],
      excluded: [],
    },
    type: 'origin',
  },
  {
    id: 'originVideo',
    title: 'Exploitation Vidéo',
    territories: {
      included: ['France', 'Switzerland', 'Belgium'],
      excluded: [],
    },
    channels: {
      included: ['video'],
      excluded: [],
    },
    type: 'origin',
  },
  {
    id: 'originVod',
    title: 'Exploitation VOD',
    territories: {
      included: ['France', 'Switzerland', 'Belgium'],
      excluded: [],
    },
    channels: {
      included: ['est', 'pay-per-view', 'n-vod', 'a-vod', 'f-vod', 's-vod'],
      excluded: [],
    },
    type: 'origin',
  },
  {
    id: 'rowAllRights',
    title: 'Exploitation Export',
    territories: {
      included: ['World'],
      excluded: ['France', 'Switzerland', 'Belgium'],
    },
    channels: {
      included: ['all-rights'],
      excluded: [],
    },
    type: 'origin',
  },
  {
    id: 'theatricalSupport',
    title: 'Soutien financier salle',
    territories: {
      included: ['France'],
      excluded: [],
    },
    channels: {
      included: ['theatrical'],
      excluded: [],
    },
    type: 'support',
  },
  {
    id: 'videoSupport',
    title: 'Soutien financier vidéo',
    territories: {
      included: ['France'],
      excluded: [],
    },
    channels: {
      included: ['video'],
      excluded: [],
    },
    type: 'support',
  },
  {
    id: 'tvSupport',
    title: 'Soutien financier TV',
    territories: {
      included: ['France'],
      excluded: [],
    },
    channels: {
      included: ['pay-tv', 'free-tv'],
      excluded: [],
    },
    type: 'support',
  },
  {
    id: 'bonusSupport',
    title: 'Majoration soutien financier',
    territories: {
      included: ['France'],
      excluded: [],
    },
    channels: {
      included: ['pay-tv', 'free-tv'],
      excluded: [],
    },
    type: 'support',
  },
  {
    id: 'theatricalDistSupport',
    title: 'Soutien distributeur salle',
    territories: {
      included: ['France'],
      excluded: [],
    },
    channels: {
      included: ['theatrical'],
      excluded: [],
    },
    type: 'support',
  },
  {
    id: 'videoDistSupport',
    title: 'Soutien distributeur vidéo',
    territories: {
      included: ['France'],
      excluded: [],
    },
    channels: {
      included: ['video'],
      excluded: [],
    },
    type: 'support',
  },
];
export const WATERFALL: Waterfall = {
  id: 'withoutMG',
  type: 'scenario',
  name: 'Sans MG',
  orgId: '',
  simulations: [],
  terms: TERMS,
  rights: RIGHTS,
  investments: {
    pathe: 750_000,
    partner: 750_000,
  },
};
