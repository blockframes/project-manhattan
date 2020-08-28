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
    const price = 6.01;
    const simulation: Simulation = {
      ticket: { amount, price },
      terms: {
        originTheatrical: 2600000,
        originTv: 600000,
        originVideo: 312340,
        originVod: 299000,
        rowAllRights: 816000
      }
    }
    const { summary } = runSimulation(WATERFALL, simulation);
    roundSummary(summary);

    console.log(summary);
    expect(summary.title['originTheatrical']).toBe(2600000);
    expect(summary.title['originTv']).toBe(600000);
    expect(summary.title['originVideo']).toBe(312320);
    expect(summary.title['originVod']).toBe(299000);
    expect(summary.title['rowAllRights']).toBe(816000);
    expect(summary.rights['originTheatricalDistributionFees']).toBe(520000);
    expect(summary.rights['originTvDistributionFees']).toBe(120000);
    expect(summary.rights['originVideoDistributionFees']).toBe(62000);
    expect(summary.rights['originVodDistributionFees']).toBe(60000);
    expect(summary.rights['rowAllRightsDistributionFees']).toBe(163000);
    expect(summary.rights['originTheatricalExpenses']).toBe(1150000);
    expect(summary.rights['originVideoExpenses']).toBe(137000);
    expect(summary.rights['rowExpenses']).toBe(56000);
    expect(summary.orgs['pathe'].total).toBe(3422000);
    expect(summary.orgs['AYD'].total).toBe(1438000);
    expect(summary.orgs['tVBroadcaster'].total).toBe(142000);
    expect(summary.orgs['equity'].total).toBe(45000);
    expect(summary.orgs['prod'].total).toBe(502000);
    expect(summary.orgs['AYD']['originTheatrical']).toBe(577000);
    expect(summary.orgs['AYD']['originTv']).toBe(274000);
    expect(summary.orgs['AYD']['originVideo']).toBe(70000);
    expect(summary.orgs['AYD']['originVod']).toBe(148000);
    expect(summary.orgs['AYD']['rowAllRights']).toBe(370000);
    expect(summary.orgs['tVBroadcaster'].total).toBe(38000);
    expect(summary.orgs['tVBroadcaster']['originTv']).toBe(38000);
    expect(summary.orgs['pathe']['originTheatrical']).toBe(2023000);
    expect(summary.orgs['pathe']['originTv']).toBe(288000);
    expect(summary.orgs['pathe']['originVideo']).toBe(243000);
    expect(summary.orgs['pathe']['originVod']).toBe(151000);
    expect(summary.orgs['pathe']['rowAllRights']).toBe(446000);
    expect(summary.rights['tVBroadcasterSupport']).toBe(70000);
    expect(summary.rights['equitySupport']).toBe(45000);
    expect(summary.rights['prodFullSupport']).toBe(150000);
    expect(summary.rights['prodFollowingSupport']).toBe(352000);
    expect(summary.rights['patheSupport']).toBe(236000);
    expect(summary.rights['patheBonusSupport']).toBe(35000);
  })
});