import { Right, Terms, Income, createTerms, createRight } from '../index';
import { createIncome, Summary, createSummary } from '../lib/model';
import { runSimulation, Simulation } from '../lib/waterfall';
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


describe('Remove overflow', () => {
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

  it('originTheatrical 2600', async () => {
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
    const price = 2.6;
    const simulation: Simulation = {
      ticket: { amount, price },
      terms: {
        originTheatrical: (amount / 1000) * price,
        originTv: 600,
        originVideo: 312.34,
        originVod: 299,
        rowAllRights: 816
      }
    }
    const { summary } = runSimulation(WATERFALL, simulation);
    roundSummary(summary);

    console.log(summary);
    expect(summary.title['originTheatrical']).toBe(2600);
    expect(summary.title['originTv']).toBe(600);
    expect(summary.title['originVideo']).toBe(312);
    expect(summary.title['originVod']).toBe(299);
    expect(summary.title['rowAllRights']).toBe(816);
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520);
    expect(summary.rights['originTvDistributionFees']).toBe(120);
    expect(summary.rights['originVideoDistributionFees']).toBe(62);
    expect(summary.rights['originVodDistributionFees']).toBe(60);
    expect(summary.rights['rowAllRightsDistributionFees']).toBe(163);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150);
    expect(summary.rights['originVideoExpenses']).toBe(137);
    expect(summary.rights['rowExpenses']).toBe(56);

    expect(summary.orgs['equity'].total).toBe(45);
    expect(summary.orgs['prod'].total).toBe(502);
    expect(summary.orgs['AYD'].total).toBe(1438);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577);
    expect(summary.orgs['AYD']['originTv']).toBe(274);
    expect(summary.orgs['AYD']['originVideo']).toBe(70);
    expect(summary.orgs['AYD']['originVod']).toBe(148);
    expect(summary.orgs['AYD']['rowAllRights']).toBe(370);
    expect(summary.orgs['tVBroadcaster'].total).toBe(142);
    expect(summary.orgs['tVBroadcaster'].total).toBe(38);
    expect(summary.orgs['tVBroadcaster']['originTv']).toBe(38);
    expect(summary.orgs['pathe'].total).toBe(3422);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(2023);
    expect(summary.orgs['pathe']['originTv']).toBe(288);
    expect(summary.orgs['pathe']['originVideo']).toBe(243);
    expect(summary.orgs['pathe']['originVod']).toBe(151);
    expect(summary.orgs['pathe']['rowAllRights']).toBe(446);
    expect(summary.rights['tVBroadcasterSupport']).toBe(70);
    expect(summary.rights['equitySupport']).toBe(45);
    expect(summary.rights['prodFullSupport']).toBe(150);
    expect(summary.rights['prodFollowingSupport']).toBe(352);
    expect(summary.rights['patheSupport']).toBe(236);
    expect(summary.rights['patheBonusSupport']).toBe(35);
  })
});