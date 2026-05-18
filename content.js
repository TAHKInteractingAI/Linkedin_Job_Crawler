
// content.js - LinkedIn Job Crawler with full details (salary, type, remote)
let jobs = [];
let isCrawling = false;
let maxPages = 5;
let currentPage = 1;
let jobSet = new Set();

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getText(selector) {
  const el = document.querySelector(selector);
  return el?.innerText?.trim() || "";
}

function simulateUserBehavior(element) {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const mouseEvent = new MouseEvent('mousemove', {
    bubbles: true,
    clientX: x,
    clientY: y
  });
  element.dispatchEvent(mouseEvent);
}

function restoreFromStorage() {
  const saved = localStorage.getItem('linkedin_jobs');
  if (saved) {
    try {
      jobs = JSON.parse(saved);
      jobs.forEach(j => jobSet.add(j.link));
      renderJobTable();
    } catch (e) {
      console.warn('Lỗi khôi phục dữ liệu:', e);
    }
  }
}

async function crawlJobsOnPage() {
    const cards = [...document.querySelectorAll('[componentkey^="job-card-component-ref"]')];

    for (const card of cards) {
      if (!isCrawling) return;

    simulateUserBehavior(card);
    card.click();
    await wait(2000 + Math.random() * 1000);

    const titleSpan = card.querySelector('span[aria-hidden="true"]');
    let jobTitle = titleSpan ? titleSpan.innerText.trim() : card.querySelector('p span')?.innerText.trim() || "";

    const title = jobTitle
      .replace(/^Selected,\s*/i, '') // Strips "Selected, " if it exists at the start
      .replace(/\s*\(Verified job\)$/i, '') // Strips "(Verified job)" string trailing notes
      .trim();

    const allParagraphs = [...card.querySelectorAll('p')];
    const companyParagraph = allParagraphs[1];
    const locationParagraph = allParagraphs[2];

    const company = companyParagraph ? companyParagraph.innerText.trim() : "";
    const location = locationParagraph ? locationParagraph.innerText.trim() : "";
    const easyApply = allParagraphs.some(p => p.innerText.includes('Easy Apply')) ? "True" : "False";

    const cardText = card.innerText;

// Match anything like "X days ago", "X weeks ago", "Hours ago", "Yesterday"
    const dateMatch = cardText.match(/(\d+\s+(?:days?|weeks?|months?|hours?)\s+ago|yesterday|just\s+now)/i);

    let date = dateMatch ? dateMatch[0] : "Unknown";
    console.log(date); // Output: "4 days ago"

    const activeJobLink = [...document.querySelectorAll('a')]
      .find(a => a.href.includes('/jobs/view/'));

    let link = ''
    let jobId = '';
    if (activeJobLink) {
      link = activeJobLink.href
      const match = activeJobLink.href.match(/\/view\/(\d+)/);
      jobId = match ? match[1] : '';
    }
    // --- Get detailed info from detail panel ---
    let jobType = "";  // Full-time, Part-time, etc.
    let workplace = ""; // Hybrid, Remote, On-site
    if (jobId) {
      const matchingLinks = [...document.querySelectorAll(`a[href*="/jobs/search-results/?currentJobId=${jobId}"]`)];

      matchingLinks.forEach(link => {
        const text = link.innerText?.trim();
        if (!text) return;

        if (['Hybrid', 'Remote', 'On-site'].includes(text)) {
          workplace = text;
        } else if (['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'].includes(text)) {
          jobType = text;
        }
      });
    }

    const job = {
      title,
      company,
      location,
      link,
      date,
      jobType,
      workplace,
      easyApply
    };

    const key = job.link;
    if (!jobSet.has(key)) {
      jobs.push(job);
      jobSet.add(key);
      renderJobTable();
      localStorage.setItem('linkedin_jobs', JSON.stringify(jobs));
    }
  }
}

async function goToNextPage() {
  const nextBtn = document.querySelector('button[data-testid="pagination-controls-next-button-visible"]');
  if (nextBtn && !nextBtn.disabled) {
    simulateUserBehavior(nextBtn);
    nextBtn.click();
    await wait(4000);
    return true;
  }
  return false;
}

async function startCrawling() {
  isCrawling = true;
  currentPage = 1;
  maxPages = parseInt(document.getElementById("maxPageInput").value) || 5;

  while (isCrawling && currentPage <= maxPages) {
    await crawlJobsOnPage();
    if (currentPage >= maxPages) {
      console.log("Reached specified max page limit sequence threshold.");
      break;
    }
    const hasNext = await goToNextPage();
    if (!hasNext) break;
    currentPage++;
  }

  isCrawling = false;
  exportCSV();
}

function exportCSV() {
  const header = "Company Name, Title Job, Link Job, Location, Employment Type, Workplace Type, Date, Easy Apply\n";
  const rows = jobs.map(j =>
    [ j.company, j.title, j.link, j.location, j.jobType, j.workplace, j.date, j.easyApply ]
      .map(field => `"${(field || "").replace(/"/g, '""')}"`).join(',')
  );
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const title = document.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
  a.download = `${jobs.length}_jobs_${title}.csv`;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

function resetData() {
  jobs = [];
  jobSet.clear();
  localStorage.removeItem('linkedin_jobs');
  renderJobTable();
}

function renderJobTable() {
  const container = document.getElementById("jobCrawlerTableBody");
  if (!container) return;

  container.innerHTML = "";
  for (const j of jobs) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${j.title}</td>
      <td>${j.company}</td>
      <td><a href="${j.link}" target="_blank">Link</a></td>
      <td>${j.location}</td>
      <td>${j.jobType}</td>
      <td>${j.workplace}</td>
      <td>${j.date}</td>
      <td>${j.easyApply}</td>
    `;
    container.appendChild(row);
  }
}

(function () {
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🧰 Mở Tool Crawl";
  toggleBtn.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background: #0073b1;
    color: white;
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  document.body.appendChild(toggleBtn);

  const container = document.createElement("div");
  container.id = "jobCrawlerContainer";
  container.style = `
    position: fixed;
    top: 50px;
    right: 0;
    width: 500px;
    max-height: 90vh;
    background: white;
    border-left: 2px solid #ccc;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
    padding: 10px;
    overflow: auto;
    z-index: 9999;
    font-family: sans-serif;
    font-size: 12px;
    display: none;
    border-radius: 4px;
  `;

  toggleBtn.onclick = () => {
    if (container.style.display === "none") {
      container.style.display = "block";
      toggleBtn.textContent = "❌ Đóng Tool Crawl";
    } else {
      container.style.display = "none";
      toggleBtn.textContent = "🧰 Mở Tool Crawl";
    }
  };

  container.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
    <h6 style = "color: red"> Lưu ý: Sau khi bấm 'Bắt đầu' bạn cần thu nhỏ trang xuống 25% để tool có thể hoạt động chính xác nhất</h6>
      <label>Số trang tối đa:</label>
      <input id="maxPageInput" type="number" value="5" min="1" style="width: 60px" />
      <button id="startBtn">Bắt đầu</button>
      <button id="stopBtn">Dừng</button>
      <button id="resetBtn">Xóa</button>
    </div>
    <div style="max-height: 65vh; overflow: auto; margin-top: 10px">
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 12px">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Link</th>
            <th>Location</th>
            <th>EmploymentType</th>
            <th>Workplace</th>
            <th>Date</th>
            <th>Easy Apply</th>
          </tr>
        </thead>
        <tbody id="jobCrawlerTableBody"></tbody>
      </table>
    </div>
  `;

  document.body.appendChild(container);
  document.getElementById("startBtn").onclick = () => startCrawling();
  document.getElementById("resetBtn").onclick = () => resetData();
  document.getElementById("stopBtn").onclick = () => { isCrawling = false; };
})();

window.addEventListener('DOMContentLoaded', restoreFromStorage);
