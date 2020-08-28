import { Right, Terms } from '../lib/model';
import { RightCondition } from '../lib/condition.model';
import { Waterfall } from './waterfall';
export const RIGHTS: Right[] = [
  {
    id: "originTheatricalDistributionFees",
    orgId: "pathe",
    percentage: 0.2,
    termsIds: ["originTheatrical"],
    parentIds: ["originTheatrical"],
  },
  {
    id: "originTvDistributionFees",
    orgId: "pathe",
    percentage: 0.2,
    termsIds: ["originTv"],
    parentIds: ["originTv"],
  },
  {
    id: "originVideoDistributionFees",
    orgId: "pathe",
    percentage: 0.2,
    termsIds: ["originVideo"],
    parentIds: ["originVideo"],
  },
  {
    id: "originVodDistributionFees",
    orgId: "pathe",
    percentage: 0.2,
    termsIds: ["originVod"],
    parentIds: ["originVod"],
  },
  {
    id: "rowAllRightsDistributionFees",
    orgId: "pathe",
    percentage: 0.2,
    termsIds: ["rowAllRights"],
    parentIds: ["rowAllRights"],
  },
  {
    id: "originTheatricalExpenses",
    orgId: "pathe",
    percentage: 1,
    termsIds: ["originTheatrical"],
    parentIds: ["originTheatricalDistributionFees"],
    conditions: [
      {
        kind: "right",
        max: 1150000,
        rightId: "originTheatricalExpenses",
      } as RightCondition,
    ],
  },
  {
    id: "originVideoExpenses",
    orgId: "pathe",
    percentage: 1,
    termsIds: ["originVideo"],
    parentIds: ["originVideoDistributionFees"],
    conditions: [
      {
        kind: "right",
        max: 137000,
        rightId: "originVideoExpenses",
      },
    ],
  },
  {
    id: "rowExpenses",
    orgId: "pathe",
    percentage: 1,
    termsIds: ["rowAllRights"],
    parentIds: ["rowAllRightsDistributionFees"],
    conditions: [
      {
        kind: "right",
        max: 56000,
        rightId: "rowExpenses",
      },
    ],
   },
  {
    id: "RNPPAydTheatrical",
    orgId: "AYD",
    parentIds: ["originTheatricalExpenses"],
    termsIds: ["originTheatrical"],
    percentage: 0.62,
  },
  {
    id: "RNPPAydVideo",
    orgId: "AYD",
    parentIds: ["originVideoExpenses"],
    termsIds: ["originVideo"],
    percentage: 0.62,
  },
  {
    id: "RNPPAydVod",
    orgId: "AYD",
    parentIds: ["originVodDistributionFees"],
    termsIds: ["originVod"],
    percentage: 0.62,
  },
  {
    id: "RNPPAydRow",
    orgId: "AYD",
    parentIds: ["rowExpenses"],
    termsIds: ["rowAllRights"],
    percentage: 0.62,
  },
  {
    id: "RNPPAydTv",
    orgId: "AYD",
    percentage: 0.57,
    parentIds: ["originTvDistributionFees"],
    termsIds: ["originTv"],
  },
  {
    id: "tVBroadcasterRNPP",
    orgId: "tVBroadcaster",
    percentage: 0.08,
    parentIds: ["originTvDistributionFees"],
    termsIds: ["originTv"],
  },
  {
    id: "RNPPpatheTheatrical",
    orgId: "pathe",
    percentage: 0.38,
    parentIds: ["originTheatricalExpenses"],
    termsIds: ["originTheatrical"],
  },
  {
    id: "RNPPpatheVideo",
    orgId: "pathe",
    percentage: 0.38,
    parentIds: ["originVideoExpenses"],
    termsIds: ["originVideo"],
  },
  {
    id: "RNPPpatheVod",
    orgId: "pathe",
    percentage: 0.38,
    parentIds: ["originVodDistributionFees"],
    termsIds: ["originVod"],
  },
  {
    id: "RNPPpatheRow",
    orgId: "pathe",
    percentage: 0.38,
    parentIds: ["rowExpenses"],
    termsIds: ["rowAllRights"],
  },
  {
    id: "RNPPpatheTv",
    orgId: "pathe",
    percentage: 0.35,
    parentIds: ["originTvDistributionFees"],
    termsIds: ["originTv"],
  },
  {
    id: "tVBroadcasterSupport",
    orgId: "tVBroadcaster",
    percentage: 0.1,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "equitySupport",
    orgId: "equity",
    percentage: 0.064,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "prodFullSupport",
    orgId: "prod",
    parentIds: ["theatricalSupport", "videoSupport", "tvSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
    percentage: 1,
    conditions:  [ {
      kind: "right",
      max: 150000,
      rightId: "prodFullSupport",
    }],
  },
  {
    id: "prodFollowingSupport",
    orgId: "prod",
    percentage: 0.5,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "patheSupport",
    orgId: "pathe",
    percentage: 0.336,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "patheBonusSupport",
    orgId: "pathe",
    percentage: 1,
    parentIds: ["bonusSupport"],
    termsIds: ["bonusSupport"],
  },
];
export const CONDITIONS: RightCondition[] = [
  {
    kind: "right",
    max: 1150000,
    rightId: "originTheatricalExpenses",
  },
  {
    kind: "right",
    max: 137000,
    rightId: "originVideoExpenses",
  },
  {
    kind: "right",
    max: 56000,
    rightId: "rowExpenses",
  },
  {
    kind: "right",
    max: 150000,
    rightId: "prodFullSupport",
  },
];
export const TERMS: Terms[] = [
  {
    id: "originTheatrical",
    title: "Exploitation Salles",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["theatrical"],
      excluded: [],
    },
    type: "origin",
  },
  {
    id: "originTv",
    title: "Exploitation TV",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["pay-tv", "free-tv"],
      excluded: [],
    },
    type: "origin",
  },
  {
    id: "originVideo",
    title: "Exploitation Vidéo",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["video"],
      excluded: [],
    },
    type: "origin",
  },
  {
    id: "originVod",
    title: "Exploitation VOD",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["est", "pay-per-view", "n-vod", "a-vod", "f-vod", "s-vod"],
      excluded: [],
    },
    type: "origin",
  },
  {
    id: "rowAllRights",
    title: "Exploitation Export",
    territories: {
      included: ["World"],
      excluded: ["France", "Switzerland", "Belgium"],
    },
    channels: {
      included: ["all-rights"],
      excluded: [],
    },
    type: "origin",
  },
  {
    id: "theatricalSupport",
    title: "Soutien financier salle",
    territories: {
      included: ["France"],
      excluded: [],
    },
    channels: {
      included: ["theatrical"],
      excluded: [],
    },
    type: "support",
  },  {
    id: "videoSupport",
    title: "Soutien financier vidéo",
    territories: {
        included: ["France"],
        excluded: [],
      },
    channels: {
      included: ["video"],
      excluded: [],
    },
    type: "support",
  },  {
    id: "tvSupport",
    title: "Soutien financier TV",
    territories: {
        included: ["France"],
        excluded: [],
      },
    channels: {
      included: ["pay-tv", "free-tv"],
      excluded: [],
    },
    type: "support",
  },
  {
    id: "bonusSupport",
    title: "Majoration soutien financier",
    territories: {
        included: ["France"],
        excluded: [],
      },
    channels: {
      included: ["pay-tv", "free-tv"],
      excluded: [],
    },
    type: "support",
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
}