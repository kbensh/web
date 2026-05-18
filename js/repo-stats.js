document.addEventListener('DOMContentLoaded', async () => {
  const repo = 'kbensh/koala';
  const cacheKey = `gh-stats:${repo}`;
  const ttlMs = 10 * 60 * 1000;

  const starsEl = document.getElementById('gh-stars');
  const forksEl = document.getElementById('gh-forks');
  if (!starsEl || !forksEl) return;

  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);

  const starIcon = '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>';
  const forkIcon = '<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';

  const render = (stars, forks) => {
    starsEl.innerHTML = `${starIcon}<span>${fmt(stars)}</span>`;
    forksEl.innerHTML = `${forkIcon}<span>${fmt(forks)}</span>`;
    starsEl.setAttribute('aria-label', `${stars} stars`);
    forksEl.setAttribute('aria-label', `${forks} forks`);
    starsEl.hidden = false;
    forksEl.hidden = false;
  };

  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && Date.now() - cached.t < ttlMs) {
      render(cached.stars, cached.forks);
      return;
    }
  } catch {}

  try {
    const resp = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
    const data = await resp.json();
    const stars = data.stargazers_count ?? 0;
    const forks = data.forks_count ?? 0;
    render(stars, forks);
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ stars, forks, t: Date.now() }));
    } catch {}
  } catch (err) {
    console.warn('repo-stats:', err);
  }
});
