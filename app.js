// Cameroon vaccination schedule
const cameroonSchedule = {
    "birth": ["BCG", "OPV-0", "HepB-BD"],
    "6w": ["Penta-1", "Pneumo-1", "OPV-1", "Rota-1", "Vit A FP"],
    "10w": ["Penta-2", "Pneumo-2", "OPV-2", "Rota-2", "IPTi-1"],
    "14w": ["Penta-3", "Pneumo-3", "OPV-3", "Rota-3", "IPTi-2", "IPV-1"],
    "6m": ["Vitamin A", "IPTi-3"],
    "9m": ["Measles-Rubella (RR-1)", "Yellow Fever (VAA)", "IPTi-4/MILDA", "IPV-2"],
    "12m": ["Vitamin A", "Mebendazole"],
    "15m": ["MR-2", "Men A(ACYW135)", "IPTi-5"],
    "18m": ["Vitamin A", "Albendazole/Mebendazole"],
    "24m": ["Vitamin A", "Albendazole/Mebendazole"],
    "9y": ["HPV"]
  };
  
  const vaccineRules = {
    "BCG": {
      route: "Intradermal",
      site: "Left upper arm",
      dose: "0.05 ml (under 1 yr), 0.1 ml (over 1 yr)"
    },
    "OPV-0": { route: "Oral", dose: "2 drops", site: "Mouth" },
    "OPV-1": { route: "Oral", dose: "2 drops", site: "Mouth" },
    "OPV-2": { route: "Oral", dose: "2 drops", site: "Mouth" },
    "OPV-3": { route: "Oral", dose: "2 drops", site: "Mouth" },
    "Rota-1": { route: "Oral", dose: "5 drops", site: "Mouth" },
    "Rota-2": { route: "Oral", dose: "5 drops", site: "Mouth" },
    "Rota-3": { route: "Oral", dose: "5 drops", site: "Mouth" },
    "Penta-1": { route: "Intramuscular", site: "Left thigh", dose: "0.5 ml" },
    "Penta-2": { route: "Intramuscular", site: "Left thigh", dose: "0.5 ml" },
    "Penta-3": { route: "Intramuscular", site: "Left thigh", dose: "0.5 ml" },
    "Pneumo-1": { route: "Intramuscular", site: "Thigh", dose: "0.5 ml" },
    "Pneumo-2": { route: "Intramuscular", site: "Thigh", dose: "0.5 ml" },
    "Pneumo-3": { route: "Intramuscular", site: "Thigh", dose: "0.5 ml" },
    "IPV-1": { route: "SC or IM", site: "Thigh or upper arm", dose: "0.5 ml" },
    "IPV-2": { route: "SC or IM", site: "Thigh or upper arm", dose: "0.5 ml" },
    "HepB-BD": {
      route: "Intramuscular",
      site: "Right thigh",
      dose: "0.5 ml"
    },
    "MR-2": {
      route: "Subcutaneous",
      site: "Upper arm",
      dose: "0.5 ml"
    },
    "Measles-Rubella (RR-1)": {
      route: "Subcutaneous",
      site: "Upper arm",
      dose: "0.5 ml"
    },
    "Yellow Fever (VAA)": {
      route: "Subcutaneous",
      site: "Upper arm",
      dose: "0.5 ml"
    },
    "IPTi-1": { route: "Oral", site: "Mouth", dose: "SP (standard dose)" },
    "IPTi-2": { route: "Oral", site: "Mouth", dose: "SP (standard dose)" },
    "IPTi-3": { route: "Oral", site: "Mouth", dose: "SP (standard dose)" },
    "IPTi-4/MILDA": { route: "Oral", site: "Mouth", dose: "SP (standard dose)" },
    "IPTi-5": { route: "Oral", site: "Mouth", dose: "SP (standard dose)" },
    "Vitamin A": {
      route: "Oral",
      site: "Mouth",
      dose: "100,000 IU (6–11m), 200,000 IU (12m+)"
    },
    "Vit A FP": {
      route: "Oral",
      site: "Mouth",
      dose: "100,000 IU"
    },
    "Mebendazole": {
      route: "Oral",
      site: "Mouth",
      dose: "500 mg"
    },
    "Albendazole/Mebendazole": {
      route: "Oral",
      site: "Mouth",
      dose: "400–500 mg"
    },
    "Men A(ACYW135)": {
      route: "Intramuscular",
      site: "Upper arm",
      dose: "0.5 ml"
    },
    "HPV": {
      route: "Intramuscular",
      site: "Deltoid",
      dose: "0.5 ml"
    }

  };
  //General info about risks if vaccines are missed
const missedVaccineInfo = {
  "Measles-Rubella (RR-1)": "⚠️ Missing this vaccine increases risk of measles outbreaks.",
  "OPV-1": "⚠️ Missing polio vaccine increases risk of paralysis.",
  "Vitamin A": "⚠️ Missing Vitamin A increases risk of vision problems.",
  "BCG": "⚠️ Missing BCG increases risk of severe tuberculosis.",
  "Yellow Fever (VAA)": "⚠️ Missing Yellow Fever vaccine increases risk of yellow fever infection."
};
  
 // Quick facts about each vaccine
const vaccineFacts = {
    "BCG": "Protects against severe forms of tuberculosis.",
    "OPV-0": "Protects against poliomyelitis.",
    "OPV-1": "Protects against poliomyelitis.",
    "OPV-2": "Protects against poliomyelitis.",
    "OPV-3": "Protects against poliomyelitis.",
    "Rota-1": "Protects against rotavirus diarrhea.",
    "Rota-2": "Protects against rotavirus diarrhea.",
    "Rota-3": "Protects against rotavirus diarrhea.",
    "Penta-1": "Protects against diphtheria, tetanus, pertussis, hepatitis B, Hib.",
    "Penta-2": "Protects against diphtheria, tetanus, pertussis, hepatitis B, Hib.",
    "Penta-3": "Protects against diphtheria, tetanus, pertussis, hepatitis B, Hib.",
    "Pneumo-1": "Protects against pneumococcal disease.",
    "Pneumo-2": "Protects against pneumococcal disease.",
    "Pneumo-3": "Protects against pneumococcal disease.",
    "HepB-BD": "Protects against hepatitis B.",
    "Measles-Rubella (RR-1)": "Protects against measles and rubella.",
    "MR-2": "Protects against measles and rubella.",
    "Yellow Fever (VAA)": "Protects against yellow fever.",
    "Vitamin A": "Supports vision and immune health.",
    "Vit A FP": "Supports vision and immune health.",
    "Mebendazole": "Treats intestinal worm infections.",
    "Albendazole/Mebendazole": "Treats intestinal worm infections.",
    "Men A(ACYW135)": "Protects against meningitis A, C, Y, W135.",
    "HPV": "Protects against cervical cancer."
  };
   
  // Get dropdown and table
  const ageSelect = document.getElementById("ageSelect");
  const vaccinationTable = document.getElementById("vaccinationTable");
  
  // NEW: Get Date of Birth field
const dobInput = document.getElementById("dob");

// NEW: Adjust appointment to nearest clinic day (Tue/Fri)
// Adjust appointment to nearest clinic day (Tue/Thu/Fri)
function adjustToClinicDay(date) {
    let day = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  
    // If it's already Tue (2), Thu (4), or Fri (5), keep it
    if (day === 2 || day === 4 || day === 5) {
      return date;
    }
  
    // Otherwise, shift forward to the next valid clinic day
    while (day !== 2 && day !== 4 && day !== 5) {
      date.setDate(date.getDate() + 1);
      day = date.getDay();
    }
    return date;
  }
  
const vaccinateBtn = document.getElementById("vaccinateBtn");
const feedback = document.getElementById("feedback");

// Synonyms for route validation
const routeSynonyms = {
    "intramuscular": ["im", "intramuscular"],
    "subcutaneous": ["sc", "subcutaneous"],
    "oral": ["oral", "by mouth"],
    "sc or im": ["sc", "im", "subcutaneous", "intramuscular"]
  };
  
  
  // Helper to normalize dose values (removes commas and spaces)
  function normalizeDose(value) {
    return value.toLowerCase().replace(/[\s,()]/g, '');
  }
  
  
   

  vaccinateBtn.addEventListener("click", () => {
    let correct = 0;
    let total = 0;
  
    const rows = vaccinationTable.querySelectorAll("tr");
    rows.forEach((row, index) => {
      if (index === 0) return; // skip header
  
      const vaccineName = row.cells[1].textContent.trim();
      const doseInput = row.cells[3].querySelector("input");   // Dose
const siteInput = row.cells[4].querySelector("input");   // Site
const routeInput = row.cells[5].querySelector("input");  // Route

  
      const expected = vaccineRules[vaccineName];
      
  
      total++;

      console.log("🔍 Vaccine:", vaccineName);
console.log("Expected Dose:", expected?.dose);
console.log("Expected Route:", expected?.route);
console.log("Expected Site:", expected?.site);
console.log("User Dose:", doseInput?.value);
console.log("User Route:", routeInput?.value);
console.log("User Site:", siteInput?.value);

  
if (expected && doseInput && routeInput && siteInput) {
    const doseInputVal = normalizeDose(doseInput.value);
const expectedDoses = expected.dose.split(",").map(d => normalizeDose(d.trim()));
const doseOk = expectedDoses.some(d => doseInputVal === d || d.includes(doseInputVal) || doseInputVal.includes(d));

const routeInputVal = routeInput.value.toLowerCase().trim();
const expectedRoute = expected.route.toLowerCase().trim();
const validRoutes = routeSynonyms[expectedRoute] || [expectedRoute];
const routeOk = validRoutes.some(r => routeInputVal.includes(r));

const siteInputVal = siteInput.value.toLowerCase().trim();
const expectedSite = expected.site.toLowerCase().trim();
const siteOk = siteInputVal.includes(expectedSite) || expectedSite.includes(siteInputVal);

// 🔍 Add debug logs here
console.log("🔍 Vaccine:", vaccineName);
console.log("Normalized Input Dose:", doseInputVal);
console.log("Expected Doses:", expectedDoses);
console.log("Dose OK:", doseOk);
console.log("User Route:", routeInputVal);
console.log("Valid Routes:", validRoutes);
console.log("Route OK:", routeOk);
console.log("User Site:", siteInputVal);
console.log("Expected Site:", expectedSite);
console.log("Site OK:", siteOk);

  
if (expected && doseInput && routeInput && siteInput) {
    // Dose validation
    const doseInputVal = normalizeDose(doseInput.value);
    const expectedDoses = expected.dose.split(",").map(d => normalizeDose(d.trim()));
    const doseOk = expectedDoses.some(d => doseInputVal === d || d.includes(doseInputVal) || doseInputVal.includes(d));
  
    // Route validation
    const routeInputVal = routeInput.value.toLowerCase().trim();
    const expectedRoute = expected.route.toLowerCase().trim();
    const validRoutes = routeSynonyms[expectedRoute] || [expectedRoute];
    const routeOk = validRoutes.some(r => routeInputVal.includes(r));
  
    // Site validation
    const siteInputVal = siteInput.value.toLowerCase().trim();
    const expectedSite = expected.site.toLowerCase().trim();
    const siteOk = siteInputVal.includes(expectedSite) || expectedSite.includes(siteInputVal);
  
    // Appointment validation
    const appointmentInput = row.cells[6].querySelector("input");
    const expectedAppointment = row.dataset.expectedAppointment;
  
    let appointmentOk = false;
    if (appointmentInput && appointmentInput.value) {
      appointmentOk = (appointmentInput.value === expectedAppointment);
    }
  
    // Final check
    if (doseOk && routeOk && siteOk && appointmentOk) {
      row.classList.add("correct");
      row.classList.remove("wrong");
      correct++;
    } else {
      row.classList.add("wrong");
      row.classList.remove("correct");
      if (!appointmentOk) {
        row.setAttribute("title", "⚠️ Appointment incorrect. Expected " + expectedAppointment);
      }
    }
}} 
    });
    // Get the buttons
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

// Download button: export table as CSV
downloadBtn.addEventListener("click", () => {
    let csv = [];
    const rows = vaccinationTable.querySelectorAll("tr");
    rows.forEach(row => {
      const cells = row.querySelectorAll("td, th");
      const rowData = [];
      cells.forEach(cell => {
        const input = cell.querySelector("input");
        if (input) {
          rowData.push(input.value);   // ✅ get what the user typed
        } else {
          rowData.push(cell.innerText); // fallback to text
        }
      });
      csv.push(rowData.join(","));
    });
  
    const csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "vaccination_card.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  

// Reset button: clear table and feedback
resetBtn.addEventListener("click", () => {
  vaccinationTable.innerHTML = `
    <tr>
      <th>Age</th>
      <th>Vaccine</th>
      <th>Date</th>
      <th>Dose</th>
      <th>Site</th>
      <th>Route</th>
      <th>Next Appointment</th>
    </tr>`;
  feedback.textContent = "";
  ageSelect.value = "";
  dobInput.value = "";
  downloadBtn.disabled = true;
});

  
    // Show feedback text
feedback.textContent = `✅ ${correct} of ${total} entries match expected dose, route, and site.`;

// Build summary report
let summary = "";
if (correct === total && total > 0) {
  summary = `Child has received all ${total} vaccines due at this age.`;
} else {
  summary = `Child has received ${correct} of ${total} vaccines due at this age.`;
}

// Try to include next appointment info (from column 7)
let nextAppointment = "";

if (rows.length > 1) {
  nextAppointment = rows[1].cells[6].innerText || "";
  if (nextAppointment) {
    summary += ` Next appointment: ${nextAppointment}.`;
  }
}

// Append summary to feedback
feedback.textContent += " " + summary;


// Update progress bar
const progressBar = document.getElementById("progressBar");
if (total > 0) {
  const percent = Math.round((correct / total) * 100);
  progressBar.style.width = percent + "%";
  progressBar.textContent = percent + "%"; // show % inside bar

  // Optional color coding
  if (percent === 100) {
    progressBar.style.backgroundColor = "#4caf50"; // green
  } else if (percent >= 50) {
    progressBar.style.backgroundColor = "#ff9800"; // orange
  } else {
    progressBar.style.backgroundColor = "#f44336"; // red
  }
} else {
  progressBar.style.width = "0%";
  progressBar.textContent = "";
}



// Overall audio feedback
if (correct === total && total > 0) {
  // All rows correct → praise
  const praiseOptions = ["praise", "praise2"];
  const randomPraise = praiseOptions[Math.floor(Math.random() * praiseOptions.length)];
  document.getElementById(randomPraise).play();

} else if (correct > 0) {
  // Some rows correct, some wrong → "close, try again"
  document.getElementById("missed_field").play(); 
  // Or add a new audio like "close_try_again.mp3" if you want a special sound

} else {
  // No rows correct → general error
  document.getElementById("wrong_route").play();
}

  });
  
  let lastAppointment = null;


  // Listen for dropdown changes
  ageSelect.addEventListener("change", () => {
    const age = ageSelect.value;
    if (!age) return;
    downloadBtn.disabled = false;
  
    // Reset table header
    vaccinationTable.innerHTML = `
      <tr>
        <th>Age</th>
        <th>Vaccine</th>
        <th>Date</th>
        <th>Dose</th>
        <th>Site</th>
        <th>Route</th>
        <th>Next Appointment</th>
      </tr>`;
  
    // 👉 Calculate appointment ONCE for this age
    // 👉 Calculate appointment ONCE for this age
let nextAppointment = null;
if (dobInput.value) {
  const dob = new Date(dobInput.value);

  if (age === "6w") {
    nextAppointment = new Date(dob);
    nextAppointment.setDate(dob.getDate() + 42);
  } else {
    if (lastAppointment) {
      nextAppointment = new Date(lastAppointment);
      nextAppointment.setDate(lastAppointment.getDate() + 28);
    } else {
      nextAppointment = new Date(dob);
    }
  }

  nextAppointment = adjustToClinicDay(nextAppointment);
  lastAppointment = nextAppointment; // save for next contact
}

// 👉 Now build rows
if (cameroonSchedule[age]) {
  cameroonSchedule[age].forEach(vaccine => {
    const row = document.createElement("tr");

    // Only attach expectedAppointment if we actually calculated one
    if (nextAppointment) {
      row.dataset.expectedAppointment = nextAppointment.toISOString().split("T")[0];
    }

    row.innerHTML = `
      <td>${age}</td>
      <td title="${vaccineFacts[vaccine] || ''}">${vaccine}</td>
      <td><input type="date"></td>
      <td><input type="text" placeholder="Dose"></td>
      <td><input type="text" placeholder="Site"></td>
      <td><input type="text" placeholder="Route"></td>
      <td><input type="date" placeholder="Next Appointment"></td>
    `;
    vaccinationTable.appendChild(row);
});
}

  })