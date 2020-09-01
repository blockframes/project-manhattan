import { Right, Terms, Income, createTerms, createRight } from '../index';
import { createIncome, Summary, createSummary } from '../lib/model';
import { runSimulation, Simulation, createSimulation } from '../lib/waterfall';
import { removeOverflow } from '../lib/utils';
import { RightCondition } from '../lib/condition.model';
import { WATERFALL } from '../lib/fixtures';

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
}


describe.skip('Remove overflow', () => {
  let right: Right;
  let summary: Summary;
  beforeEach(() => {
    summary = createSummary({ rights: { '0': 10 }});
    right = createRight({
      id: '0',
      conditions: [{ kind: 'right', rightId: '0', max: 50 } as RightCondition]
    });
  })
  it('Without overflow', () => {
    const total = removeOverflow(10, right, summary);
    expect(total).toBe(10);
  });
  it('With overflow', () => {
    const total = removeOverflow(100, right, summary);
    expect(total).toBe(40);
  });
})

describe('Get Income from waterfall', () => {

  it.skip('originTheatrical 2600', async () => {
    const incomeId = 'income_0';
    const simulation = createIncome({ id: incomeId, termsId: 'originTheatrical', amount: 2600 });
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

  it('List of 5 incomes', async () => {
    const amount = 1_000_000;
    const price = 6.01;
    const simulation: Simulation = createSimulation({
      ticket: { amount, price },
      terms: {
        originTheatrical: 2600000,
        originTv: 600000,
        originVideo: 312344,
        originVod: 299000,
        rowAllRights: 816000
      }
    });
    const { summary } = runSimulation(WATERFALL, simulation);
    roundSummary(summary);

    // Title
    expect(summary.title.total).toBe(5515798);
    expect(summary.title['originTheatrical']).toBe(2600000);
    expect(summary.title['originTv']).toBe(600000);
    expect(summary.title['originVideo']).toBe(312344);
    expect(summary.title['originVod']).toBe(299000);
    expect(summary.title['rowAllRights']).toBe(816000);
    expect(summary.title['theatricalSupport']).toBe(748966);
    expect(summary.title['videoSupport']).toBe(14055);
    expect(summary.title['tvSupport']).toBe(90000);
    expect(summary.title['bonusSupport']).toBe(35432);
    // Pathé
    expect(summary.orgs['pathe'].total).toBe(3422089);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(2023400);
    expect(summary.orgs['pathe']['originTv']).toBe(288000);
    expect(summary.orgs['pathe']['originVideo']).toBe(242361);
    expect(summary.orgs['pathe']['originVod']).toBe(150696);
    expect(summary.orgs['pathe']['rowAllRights']).toBe(445984);
    expect(summary.orgs['pathe']['theatricalSupport']).toBe(201253);
    expect(summary.orgs['pathe']['videoSupport']).toBe(4723);
    expect(summary.orgs['pathe']['tvSupport']).toBe(30240);
    expect(summary.orgs['pathe']['bonusSupport']).toBe(35432);
    // AYD
    expect(summary.orgs['AYD'].total).toBe(1438503);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(576600);
    expect(summary.orgs['AYD']['originTv']).toBe(273600);
    expect(summary.orgs['AYD']['originVideo']).toBe(69983);
    expect(summary.orgs['AYD']['originVod']).toBe(148304);
    expect(summary.orgs['AYD']['rowAllRights']).toBe(370016);
    // TV Broadcaster
    expect(summary.orgs['tVBroadcaster'].total).toBe(108702);
    expect(summary.orgs['tVBroadcaster']['originTv']).toBe(38400);
    expect(summary.orgs['tVBroadcaster']['theatricalSupport']).toBe(59897);
    expect(summary.orgs['tVBroadcaster']['videoSupport']).toBe(1406);
    expect(summary.orgs['tVBroadcaster']['tvSupport']).toBe(9000);
    // Prod
    expect(summary.orgs['prod'].total).toBe(501511);
    expect(summary.orgs['prod']['theatricalSupport']).toBe(449483);
    expect(summary.orgs['prod']['videoSupport']).toBe(7028);
    expect(summary.orgs['prod']['tvSupport']).toBe(45000);
    // Equity
    expect(summary.orgs['equity'].total).toBe(44993);
    expect(summary.orgs['equity']['theatricalSupport']).toBe(38334);
    expect(summary.orgs['equity']['videoSupport']).toBe(900);
    expect(summary.orgs['equity']['tvSupport']).toBe(5760);
    // Rights
    // theatrical
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520000);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150000);
    expect(summary.rights['RNPPAydTheatrical']).toBe(576600);
    expect(summary.rights['RNPPpatheTheatrical']).toBe(353400);
    // TV
    expect(summary.rights['originTvDistributionFees']).toBe(120000);
    expect(summary.rights['RNPPAydTv']).toBe(273600);
    expect(summary.rights['tVBroadcasterRNPP']).toBe(38400);
    expect(summary.rights['RNPPpatheTv']).toBe(168000);
    // Video
    expect(summary.rights['originVideoDistributionFees']).toBe(62469);
    expect(summary.rights['originVideoExpenses']).toBe(137000);
    expect(summary.rights['RNPPAydVideo']).toBe(69983);
    expect(summary.rights['RNPPpatheVideo']).toBe(42893);
    // Vod
    expect(summary.rights['originVodDistributionFees']).toBe(59800);
    expect(summary.rights['RNPPAydVod']).toBe(148304);
    expect(summary.rights['RNPPpatheVod']).toBe(90896);
    // ROW
    expect(summary.rights['rowAllRightsDistributionFees']).toBe(163200);
    expect(summary.rights['rowExpenses']).toBe(56000);
    expect(summary.rights['RNPPAydRow']).toBe(370016);
    expect(summary.rights['RNPPpatheRow']).toBe(226784);
    // Support
    expect(summary.rights['prodFullSupport']).toBe(150000);
    expect(summary.rights['tVBroadcasterSupport']).toBe(70302);
    expect(summary.rights['equitySupport']).toBe(44993);
    expect(summary.rights['prodFollowingSupport']).toBe(351511);
    expect(summary.rights['patheSupport']).toBe(236215);
    expect(summary.rights['patheBonusSupport']).toBe(35432);
  })
});
