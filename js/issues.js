document.addEventListener('DOMContentLoaded', async () => {
  const repo = 'kbensh/koala';
  const perPage = 4;
  const issuesUrl = `https://api.github.com/repos/${repo}/issues?state=open&sort=created&direction=desc&per_page=${perPage}`;

  try {
    const resp = await fetch(issuesUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
    const issues = await resp.json();

    const div = document.getElementById('help-wanted-issues');
    const ul = div.querySelector('ul');
    issues.forEach(issue => {
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = issue.html_url;
      a.textContent = `#${issue.number}`;
      li.appendChild(a);
      li.insertAdjacentText('beforeend', ` ${issue.title}`);
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    const ul = document.getElementById('help-wanted-issues');
    ul.innerHTML = '<li>Unable to load issues at this time.</li>';
  }
});
