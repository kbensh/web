const repo = 'kbensh/koala';

document.addEventListener("DOMContentLoaded", function() {
  const rows = document.querySelectorAll("#benchmarks tbody tr");
  
  rows.forEach((row) => {
    const td = row.querySelector("td");
    const code = td.querySelector("code");
    const name = code.textContent.trim();
    
    const link = document.createElement("a");
    link.href = `https://github.com/${repo}/tree/main/${name}`;
    link.textContent = name;
    link.target = "_blank"; // open in new tab
    
    code.textContent = ""; // clear existing text
    code.appendChild(link);
  });
});
