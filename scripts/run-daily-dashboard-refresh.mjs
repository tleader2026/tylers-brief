const origin = 'https://tyler-signal-command-center.tylerfischella.chatgpt.site';
const key = process.env.DAILY_REFRESH_KEY;
if (!key) throw new Error('DAILY_REFRESH_KEY is missing');

async function request(path = '', method = 'GET') {
  const response = await fetch(origin + '/api/daily-refresh' + path, {
    method,
    headers: { Authorization: 'Bearer ' + key },
    redirect: 'error',
    signal: AbortSignal.timeout(110_000),
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}

const { providers } = await request();
if (!Array.isArray(providers) || !providers.length ||
    providers.some(id => typeof id !== 'string' || !id.length || id.length > 160)) {
  throw new Error('Site returned an invalid source list');
}

const outcomes = [];
const queue = [...new Set(providers)];
async function run() {
  for (let provider; (provider = queue.shift());) {
    let result;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { health } = await request('?provider=' + encodeURIComponent(provider), 'POST');
        if (health?.provider !== provider) throw new Error('Missing source readback');
        result = { provider, status: health.status, count: health.count, message: health.message };
        if (result.status !== 'error') break;
      } catch (error) {
        result = { provider, status: 'error', message: error.message };
      }
    }
    outcomes.push(result);
    console.log(JSON.stringify(result));
  }
}
await Promise.all([run(), run(), run()]);
const totals = Object.groupBy(outcomes, row => row.status);
const summary = Object.entries(totals).map(([status, rows]) => status + ': ' + rows.length).join(', ');
console.log('Daily refresh: ' + summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import('node:fs/promises');
  const details = outcomes.filter(row => row.status !== 'connected')
    .map(row => '- ' + row.provider + ': ' + row.status + ' — ' + (row.message || 'See source health.'));
  await appendFile(process.env.GITHUB_STEP_SUMMARY, '## Dashboard refresh\n\n' + summary + '\n\n' + details.join('\n') + '\n');
}
if (!totals.connected?.length) process.exitCode = 1;
