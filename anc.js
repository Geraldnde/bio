// Get elements
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const addVisitBtn = document.getElementById("addVisitBtn");
const addHistoryBtn = document.getElementById("addHistoryBtn");
const progressBar = document.getElementById("progressBar");
const feedback = document.getElementById("feedback");
const ancVisits = document.getElementById("ancVisits");
const ancHistory = document.getElementById("ancHistory");

// Add new obstetric history row
addHistoryBtn.addEventListener("click", () => {
  const newRow = ancHistory.insertRow(-1);
  const cols = [
    '<input type="date">',
    '<input type="text" placeholder="Term/Preterm">',
    '<input type="text" placeholder="NVD/CS">',
    '<input type="number" placeholder="kg">',
    '<input type="text" placeholder="M/F">'
  ];
  cols.forEach(html => {
    const cell = newRow.insertCell();
    cell.innerHTML = html;
  });
});

// Add new ANC visit row
addVisitBtn.addEventListener("click", () => {
  const newRow = ancVisits.insertRow(-1);
  const cols = [
    '<input type="date">',
    '<input type="text" placeholder="120/80">',
    '<input type="number" placeholder="kg">',
    '<input type="number" placeholder="cm">',
    '<input type="number" placeholder="bpm">',
    '<input type="text" placeholder="Cephalic/Breech">',
    '<input type="text" placeholder="LOA/ROA">',
    '<input type="number" placeholder="g/dL">',
    '<input type="text" placeholder="Negative/Trace/+">',
    '<input type="text" placeholder="Negative/Trace/+">',
    '<input type="text" placeholder="Nil/Mild/Severe">',
    '<textarea placeholder="Remarks"></textarea>'
  ];
  cols.forEach(html => {
    const cell = newRow.insertCell();
    cell.innerHTML = html;
  });
});

// Save and check risks
saveBtn.addEventListener("click", () => {
  const inputs = document.querySelectorAll("#ancVisits input, #ancVisits textarea");
  let filled = 0;
  inputs.forEach(input => {
    if (input.value.trim() !== "") filled++;
  });

  const percent = Math.round((filled / inputs.length) * 100);
  progressBar.style.width = percent + "%";
  progressBar.textContent = percent + "%";

  let riskAlerts = [];

  // Loop through each visit row
  const rows = ancVisits.querySelectorAll("tr");
  rows.forEach((row, idx) => {
    if (idx === 0) return; // skip header
    const cells = row.querySelectorAll("input, textarea");

    const bp = cells[1].value;
    const weight = cells[2].value;
    const fh = parseFloat(cells[3].value);
    const fhr = parseFloat(cells[4].value);
    const presentation = cells[5].value.toLowerCase();
    const position = cells[6].value;
    const hb = parseFloat(cells[7].value);
    const sugar = cells[8].value.toLowerCase();
    const albumin = cells[9].value.toLowerCase();
    const oedema = cells[10].value.toLowerCase();

    // Risk rules
    if (hb && hb < 11) riskAlerts.push(`Visit ${idx}: ⚠️ Anaemia risk (Hb < 11 g/dL)`);
    if (albumin.includes("+")) riskAlerts.push(`Visit ${idx}: ⚠️ Pre-eclampsia risk (Albumin positive)`);
    if (presentation.includes("breech")) riskAlerts.push(`Visit ${idx}: ⚠️ Breech presentation → labor complication risk`);
    if (oedema.includes("severe")) riskAlerts.push(`Visit ${idx}: ⚠️ Severe oedema → hypertensive disorder risk`);
    if (fhr && (fhr < 110 || fhr > 160)) riskAlerts.push(`Visit ${idx}: ⚠️ Abnormal FHR`);
  });

  feedback.textContent = (riskAlerts.length > 0)
    ? "Risks identified:\n" + riskAlerts.join("\n")
    : "✅ No risks identified. ANC card complete.";
});

// Reset tables
resetBtn.addEventListener("click", () => {
  ancVisits.innerHTML = `
    <tr>
      <th>Date</th><th>BP</th><th>Weight</th><th>Fundal Height</th><th>FHR</th>
      <th>Presentation</th><th>Position</th><th>Hb</th><th>Sugar</th>
      <th>Albumin</th><th>Oedema</th><th>Remarks</th>
    </tr>`;
  ancHistory.innerHTML = `
    <tr>
      <th>Date</th><th>Gestation</th><th>Mode of Delivery</th><th>Birth Weight</th><th>Sex</th>
    </tr>`;
  progressBar.style.width = "0%";
  progressBar.textContent = "0%";
  feedback.textContent = "";
});
