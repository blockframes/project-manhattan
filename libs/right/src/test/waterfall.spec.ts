import { Right, Terms, Income, createTerms, createRight } from '../index';
import { createIncome, Summary, createSummary } from '../lib/model';
import { runSimulation, Simulation, createSimulation } from '../lib/waterfall';
import { removeOverflow } from '../lib/utils';
import { RightCondition } from '../lib/condition.model';
import { WATERFALL } from '../lib/fixtures';
import { getTheatricalSupport, CNC_SUPPORT } from '../lib/income';

const roundSummary = (summary: Summary) => {
  for (const key in summary.title) {
    summary.title[key] = Math.round(summary.title[key]);
  }
  for (const key in summary.rights) {
    summary.rights[key] = Math.round(summary.rights[key]);
  }
  for (const org in summary.orgs) {
    for (const key in summary.orgs[org]) {
      summary.orgs[org][key] = Math.round(summary.orgs[org][key]);
    }
  }
};

describe.skip('Remove overflow', () => {
  let right: Right;
  let summary: Summary;
  beforeEach(() => {
    summary = createSummary({ rights: { '0': 10 } });
    right = createRight({
      id: '0',
      conditions: [{ kind: 'right', rightId: '0', max: 50 } as RightCondition],
    });
  });
  it('Without overflow', () => {
    const total = removeOverflow(10, right, summary);
    expect(total).toBe(10);
  });
  it('With overflow', () => {
    const total = removeOverflow(100, right, summary);
    expect(total).toBe(40);
  });
});

describe('Get Income from waterfall', () => {
  it.skip('originTheatrical 2600', async () => {
    const incomeId = 'income_0';
    const simulation = createIncome({
      id: incomeId,
      termsId: 'originTheatrical',
      amount: 2600,
    });
    const { summary } = runSimulation(WATERFALL, simulation);
    roundSummary(summary);

    expect(summary.title['originTheatrical']).toBe(2600);
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150);
    expect(summary.orgs['pathe'].total).toBe(2023);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(2023);
    expect(summary.orgs['AYD'].total).toBe(577);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577);
  });

  it('Calculate Theatrical Support', () => {
    const test1 = getTheatricalSupport(5_000_000, 6.01, CNC_SUPPORT);
    expect(Math.round(test1)).toBe(3_350_214);
    const test2 = getTheatricalSupport(10_000_000, 6.01, CNC_SUPPORT);
    expect(Math.round(test2)).toBe(3_672_350);
  })

  it('List of 5 incomes', async () => {
    const amount = 1_000_000;
    const price = 6.01;
    const simulation: Simulation = createSimulation({
      ticket: { amount, price },
      terms: {
        originTheatrical: 2_600_000,
        originTv: 600_000,
        originVideo: 312_344,
        originVod: 299_000,
        rowAllRights: 816_000,
      },
    });
    const { summary } = runSimulation(WATERFALL, simulation);
    roundSummary(summary);
    console.log(summary);
    // Title
    expect(summary.title.total).toBe(5884299); // was 5_515_798
    expect(summary.title['originTheatrical']).toBe(2_600_000);
    expect(summary.title['originTv']).toBe(600_000);
    expect(summary.title['originVideo']).toBe(312_344);
    expect(summary.title['originVod']).toBe(299_000);
    expect(summary.title['rowAllRights']).toBe(816_000);
    expect(summary.title['theatricalSupport']).toBe(748_966);
    expect(summary.title['videoSupport']).toBe(14_055);
    expect(summary.title['tvSupport']).toBe(90_000);
    expect(summary.title['bonusSupport']).toBe(35_432);
    expect(summary.title['theatricalDistSupport']).toBe(354_446);
    expect(summary.title['videoDistSupport']).toBe(14_055);
    // Pathé
    expect(summary.orgs['pathe'].total).toBe(2_584_790);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(1_586_700);
    expect(summary.orgs['pathe']['originTv']).toBe(144_000);
    expect(summary.orgs['pathe']['originVideo']).toBe(189_959);
    expect(summary.orgs['pathe']['originVod']).toBe(75_348);
    expect(summary.orgs['pathe']['rowAllRights']).toBe(250_992);
    expect(summary.orgs['pathe']['theatricalSupport']).toBe(100_626);
    expect(summary.orgs['pathe']['videoSupport']).toBe(2_361);
    expect(summary.orgs['pathe']['tvSupport']).toBe(15_120);
    expect(summary.orgs['pathe']['bonusSupport']).toBe(35_432);
    expect(summary.orgs['pathe']['patheDistSupport']).toBe(184_251);
    // Partner
    expect(summary.orgs['partner'].total).toBe(1_206_014);
    expect(summary.orgs['partner']['originTheatrical']).toBe(436_700);
    expect(summary.orgs['partner']['originTv']).toBe(144_000);
    expect(summary.orgs['partner']['originVideo']).toBe(52_615);
    expect(summary.orgs['partner']['originVod']).toBe(75_348);
    expect(summary.orgs['partner']['rowAllRights']).toBe(194_992);
    expect(summary.orgs['partner']['theatricalSupport']).toBe(100_626);
    expect(summary.orgs['partner']['videoSupport']).toBe(2_361);
    expect(summary.orgs['partner']['tvSupport']).toBe(15_120);
    expect(summary.orgs['partner']['partnerDistSupport']).toBe(184_251);
    // AYD
    expect(summary.orgs['AYD'].total).toBe(1_438_289);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(576_600);
    expect(summary.orgs['AYD']['originTv']).toBe(273_600);
    expect(summary.orgs['AYD']['originVideo']).toBe(69_769);
    expect(summary.orgs['AYD']['originVod']).toBe(148_304);
    expect(summary.orgs['AYD']['rowAllRights']).toBe(370_016);
    // TV Broadcaster
    expect(summary.orgs['tVBroadcaster'].total).toBe(108_702);
    expect(summary.orgs['tVBroadcaster']['originTv']).toBe(38_400);
    expect(summary.orgs['tVBroadcaster']['theatricalSupport']).toBe(59_897);
    expect(summary.orgs['tVBroadcaster']['videoSupport']).toBe(1_406);
    expect(summary.orgs['tVBroadcaster']['tvSupport']).toBe(9_000);
    // Prod
    expect(summary.orgs['prod'].total).toBe(501_511);
    expect(summary.orgs['prod']['theatricalSupport']).toBe(449_483);
    expect(summary.orgs['prod']['videoSupport']).toBe(7_028);
    expect(summary.orgs['prod']['tvSupport']).toBe(45_000);
    // Equity
    expect(summary.orgs['equity'].total).toBe(44_993);
    expect(summary.orgs['equity']['theatricalSupport']).toBe(38_334);
    expect(summary.orgs['equity']['videoSupport']).toBe(900);
    expect(summary.orgs['equity']['tvSupport']).toBe(5_760);
    // Rights
    // theatrical
    expect(summary.rights['originPatheTheatricalDistributionFees']).toBe(
      260_000
    );
    expect(summary.rights['originPartnerTheatricalDistributionFees']).toBe(
      260_000
    );
    expect(summary.rights['originTheatricalExpenses']).toBe(1_150_000);
    expect(summary.rights['RNPPAydTheatrical']).toBe(576_600);
    expect(summary.rights['RNPPpatheTheatrical']).toBe(176_700);
    expect(summary.rights['RNPPPartnerTheatrical']).toBe(176_700);
    // TV
    expect(summary.rights['originPatheTvDistributionFees']).toBe(60_000);
    expect(summary.rights['originPartnerTvDistributionFees']).toBe(60_000);
    expect(summary.rights['RNPPAydTv']).toBe(273_600);
    expect(summary.rights['tVBroadcasterRNPP']).toBe(38_400);
    expect(summary.rights['RNPPpatheTv']).toBe(84_000);
    expect(summary.rights['RNPPPartnerTv']).toBe(84_000);
    // Video
    expect(summary.rights['originPatheVideoDistributionFees']).toBe(31_234);
    expect(summary.rights['originPartnerVideoDistributionFees']).toBe(31_234);
    expect(summary.rights['originVideoExpenses']).toBe(137_344);
    expect(summary.rights['RNPPAydVideo']).toBe(69_769);
    expect(summary.rights['RNPPpatheVideo']).toBe(21_381);
    expect(summary.rights['RNPPPartnerVideo']).toBe(21_381);
    // Vod
    expect(summary.rights['originPatheVodDistributionFees']).toBe(29_900);
    expect(summary.rights['originPartnerVodDistributionFees']).toBe(29_900);
    expect(summary.rights['RNPPAydVod']).toBe(148_304);
    expect(summary.rights['RNPPpatheVod']).toBe(45_448);
    expect(summary.rights['RNPPPartnerVod']).toBe(45_448);
    // ROW
    expect(summary.rights['rowAllPatheRightsDistributionFees']).toBe(81_600);
    expect(summary.rights['rowAllPartnerRightsDistributionFees']).toBe(81_600);
    expect(summary.rights['rowExpenses']).toBe(56_000);
    expect(summary.rights['RNPPAydRow']).toBe(370_016);
    expect(summary.rights['RNPPpatheRow']).toBe(113_392);
    expect(summary.rights['RNPPPartnerRow']).toBe(113_392);
    // Support
    expect(summary.rights['prodFullSupport']).toBe(150_000);
    expect(summary.rights['tVBroadcasterSupport']).toBe(70_302);
    expect(summary.rights['equitySupport']).toBe(44_993);
    expect(summary.rights['prodFollowingSupport']).toBe(351_511);
    expect(summary.rights['patheSupport']).toBe(118_108);
    expect(summary.rights['partnerSupport']).toBe(118_108);
    expect(summary.rights['patheBonusSupport']).toBe(35_432);
    expect(summary.rights['patheDistSupport']).toBe(184_251);
    expect(summary.rights['partnerDistSupport']).toBe(184_251);
  });
});
