import { Right, Terms } from '../lib/model';
import { RightCondition } from '../lib/condition.model';

export const RIGHTS: Right[] = [
  {
    id: "originTheatricalDistributionFees",
    orgId: "Pathe",
    percentage: 0.20,
    termsIds: ["originTheatrical"],
    parentIds: ["originTheatrical"],
  },
  {
    id: "originTvDistributionFees",

    orgId: "Pathe",
    percentage: 0.20,
    termsIds: ["originTv"],
    parentIds: ["originTv"],
  },
  {
    id: "originVideoDistributionFees",
    orgId: "Pathe",
    percentage: 0.20,
    termsIds: ["originVideo"],
    parentIds: ["originVideo"],
  },

  {
    id: "originVodDistributionFees",
    orgId: "Pathe",
    percentage: 0.20,
    termsIds: ["originVod"],
    parentIds: ["originVod"],
  },
  {
    id: "rowAllRightsDistributionFees",
    orgId: "Pathe",
    percentage: 0.20,
    termsIds: ["rowAllRights"],
    parentIds: ["rowAllRights"],
  },
  {
    id: "originTheatricalExpenses",
    orgId: "Pathe",
    percentage: 1,
    termsIds: ["originTheatrical"],
    parentIds: ["originTheatricalDistributionFees"],
    conditions: [
      {
        kind: "right",
        max: 1150,
        rightId: "originTheatricalExpenses",
      } as RightCondition,
    ],
  },
  {
    id: "originVideoExpenses",
    orgId: "Pathe",
    percentage: 1,
    termsIds: ["originVideo"],
    parentIds: ["originVideoDistributionFees"],
    conditions: [
      {
        kind: "right",
        max: 137,
        rightId: "originVideoExpenses",
      },
    ],
  },
  {
    id: "rowExpenses",
    orgId: "Pathe",
    percentage: 1,
    termsIds: ["rowAllRights"],
    parentIds: ["rowAllRightsDistributionFees"],
    conditions: [
      {
        kind: "right",
        max: 56,
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
    id: "TVBroadcasterRNPP",
    orgId: "TVBroadcaster",
    percentage: 0.08,
    parentIds: ["originTvDistributionFees"],
    termsIds: ["originTv"],
  },
  {
    id: "RNPPPatheTheatrical",
    orgId: "Pathe",
    percentage: 0.38,
    parentIds: ["originTheatricalExpenses"],
    termsIds: ["originTheatrical"],
  },
  {
    id: "RNPPPatheVideo",
    orgId: "Pathe",
    percentage: 0.38,
    parentIds: ["originVideoExpenses"],
    termsIds: ["originVideo"],
  },
  {
    id: "RNPPPatheVod",
    orgId: "Pathe",
    percentage: 0.38,
    parentIds: ["originVodDistributionFees"],
    termsIds: ["originVod"],
  },
  {
    id: "RNPPPatheRow",
    orgId: "Pathe",
    percentage: 0.38,
    parentIds: ["rowExpenses"],
    termsIds: ["rowAllRights"],
  },
  {
    id: "RNPPPatheTv",
    orgId: "Pathe",
    percentage: 0.35,
    parentIds: ["originTvDistributionFees"],
    termsIds: ["originTv"],
  },
  {
    id: "TvBroadcasterSupport",
    orgId: "TVBroadcaster",
    percentage: 0.10,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "EquitySupport",
    orgId: "Equity",
    percentage: 0.064,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "prodFullSupport",
    orgId: "Prod",
    parentIds: ["theatricalSupport", "videoSupport", "tvSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
    percentage: 1,
    conditions:  [ {
      kind: "right",
      max: 150,
      rightId: "prodFullSupport",
    },],
  },
  {
    id: "prodFollowingSupport",
    orgId: "Prod",
    percentage: 0.50,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
  {
    id: "PatheSupport",
    orgId: "Pathe",
    percentage: 0.336,
    parentIds: ["prodFullSupport"],
    termsIds: ["theatricalSupport", "videoSupport", "tvSupport"],
  },
];

export const CONDITIONS: RightCondition[] = [
  {
    kind: "right",
    max: 1150,
    rightId: "originTheatricalExpenses",
  },
  {
    kind: "right",
    max: 137,
    rightId: "originVideoExpenses",
  },
  {
    kind: "right",
    max: 56,
    rightId: "rowExpenses",
  },
  {
    kind: "right",
    max: 150,
    rightId: "prodFullSupport",
  },
];

export const TERMS: Terms[] = [
  {
    id: "originTheatrical",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["theatrical"],
      excluded: [],
    },
  },
  {
    id: "originTv",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["pay-tv", "free-tv"],
      excluded: [],
    },
  },
  {
    id: "originVideo",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["video"],
      excluded: [],
    },
  },
  {
    id: "originVod",
    territories: {
      included: ["France", "Switzerland", "Belgium"],
      excluded: [],
    },
    channels: {
      included: ["est", "pay-per-view", "n-vod", "a-vod", "f-vod", "s-vod"],
      excluded: [],
    },
  },
  {
    id: "rowAllRights",
    territories: {
      included: ["World"],
      excluded: ["France", "Switzerland", "Belgium"],
    },
    channels: {
      included: ["all-rights"],
      excluded: [],
    },
  },
];
