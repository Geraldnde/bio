// WHO Partograph multi-canvas prototype
// separate canvases: cervical (800x400), contractions (800x150), bpPulse (800x300), fhr (800x200)
// time: 0-12 hours, subdivided every 30 min (24 columns)

// ----- Config -----
const HOURS_TOTAL = 12;
const HALF_HOUR_SLOTS = HOURS_TOTAL * 2; // 24
const MAX_DILATION = 10;
const CONTRACT_VERT = 5; // 0..5 contractions per 10 mins

// ----- DOM -----
const inputHour = document.getElementById('inputHour');
const inputMinute = document.getElementById('inputMinute');
const inputDilation = document.getElementById('inputDilation');
const inputEffacement = document.getElementById('inputEffacement');
const inputFHR = document.getElementById('inputFHR');
const inputPulse = document.getElementById('inputPulse');
const inputBP = document.getElementById('inputBP');
const inputContractionsNumber = document.getElementById('inputContractionsNumber');
const inputContractionType = document.getElementById('inputContractionType');
const inputContractionDuration = document.getElementById('inputContractionDuration');

const chkCervical = document.getElementById('chkCervical');
const chkContractions = document.getElementById('chkContractions');
const chkPulse = document.getElementById('chkPulse');
const chkBP = document.getElementById('chkBP');
const chkFHR = document.getElementById('chkFHR');

const btnPlotInput = document.getElementById('btnPlotInput');
const btnReset = document.getElementById('btnReset');
const btnExportAll = document.getElementById('btnExportAll');

// canvases & contexts
const cervicalCanvas = document.getElementById('cervicalCanvas');
const contractionCanvas = document.getElementById('contractionCanvas');
const bpPulseCanvas = document.getElementById('bpPulseCanvas');
const fhrCanvas = document.getElementById('fhrCanvas');

const cCtx = cervicalCanvas.getContext('2d');
const conCtx = contractionCanvas.getContext('2d');
const bpCtx = bpPulseCanvas.getContext('2d');
const fhrCtx = fhrCanvas.getContext('2d');

// canvas pixel dims (use canvas width/height attributes already set in HTML)
const C_W = cervicalCanvas.width, C_H = cervicalCanvas.height;
const CON_W = contractionCanvas.width, CON_H = contractionCanvas.height;
const BP_W = bpPulseCanvas.width, BP_H = bpPulseCanvas.height;
const FHR_W = fhrCanvas.width, FHR_H = fhrCanvas.height;

// padding and mapping
const PAD = 60;
const plotW = C_W - PAD * 2;
const plotH = C_H - PAD * 2;
const pxPerHalfHour = plotW / HALF_HOUR_SLOTS;
const pxPerHour = plotW / HOURS_TOTAL;
const pxPerCm = plotH / MAX_DILATION;

// alert/action lines (WHO): alert starts at (0,5), action starts at (4,5), slope = 1 cm/hr
const alertStart = { time: 0, dilation: 5 };
const actionStart = { time: 4, dilation: 5 };

// ----- data stores -----
let cervicalPoints = []; // {timeDecimal, dilation, effacement}
let contractionPoints = []; // {timeDecimal, num, type, duration}
let pulsePoints = []; // {timeDecimal, value}
let bpPoints = []; // {timeDecimal, systolic, diastolic}
let fhrPoints = []; // {timeDecimal, value}

// ----- helpers -----
function timeToDecimal(hour, minute) { return Math.max(0, Math.min(HOURS_TOTAL, Number(hour) + Number(minute) / 60)); }
function timeToX_inCanvas(time, canvasWidth) { // map 0..12 to PAD..PAD+plotW based on canvas
    const localPlotW = canvasWidth - PAD * 2;
    return PAD + (time / HOURS_TOTAL) * localPlotW;
}
function dilationToY_inCervical(dilation) {
    return PAD + (plotH) - (dilation / MAX_DILATION) * plotH;
}

// contraction canvas: compute column index (0..23) from time decimal
function timeToColumnIndex(time) {
    let idx = Math.round(time * 2); // e.g. 0h -> 0, 0.5h ->1, 1h ->2, etc.
    if (idx < 0) idx = 0;
    if (idx > HALF_HOUR_SLOTS) idx = HALF_HOUR_SLOTS;
    return idx;
}

// ----- Draw Cervical Grid & Alert/Action lines -----
function drawCervical() {
    // clear
    cCtx.clearRect(0, 0, C_W, C_H);
    // background
    cCtx.fillStyle = '#fff';
    cCtx.fillRect(PAD, PAD, plotW, plotH);

    // vertical grid (every 30 min)
    cCtx.strokeStyle = '#e6eef8';
    cCtx.lineWidth = 1;
    for (let i = 0; i <= HALF_HOUR_SLOTS; i++) {
        const x = PAD + i * pxPerHalfHour;
        cCtx.beginPath(); cCtx.moveTo(x, PAD); cCtx.lineTo(x, PAD + plotH); cCtx.stroke();
    }
    // horizontal grid every 1 cm
    for (let cm = 0; cm <= MAX_DILATION; cm++) {
        const y = dilationToY_inCervical(cm);
        cCtx.beginPath(); cCtx.moveTo(PAD, y); cCtx.lineTo(PAD + plotW, y); cCtx.stroke();
    }

    // axes border
    cCtx.strokeStyle = '#0b2540';
    cCtx.lineWidth = 1.5;
    cCtx.beginPath();
    cCtx.moveTo(PAD, PAD); cCtx.lineTo(PAD, PAD + plotH); cCtx.lineTo(PAD + plotW, PAD + plotH);
    cCtx.stroke();

    // labels X
    cCtx.fillStyle = '#0b2540'; cCtx.font = '12px Arial';
    for (let h = 0; h <= HOURS_TOTAL; h++) {
        const x = timeToX_inCanvas(h, C_W);
        cCtx.fillText(h + 'h', x - 10, PAD + plotH + 20);
    }
    // labels Y
    for (let cm = 0; cm <= MAX_DILATION; cm++) {
        const y = dilationToY_inCervical(cm);
        cCtx.fillText(cm + ' cm', PAD - 44, y + 4);
    }

    // alert line (red)
    cCtx.strokeStyle = '#e53935'; cCtx.lineWidth = 2;
    cCtx.beginPath();
    let started = false;
    for (let t = 0; t <= HOURS_TOTAL; t += 0.1) {
        const d = alertStart.dilation + (t - alertStart.time); // slope 1 cm/hr
        if (d < 0 || d > MAX_DILATION) continue;
        const x = timeToX_inCanvas(t, C_W);
        const y = dilationToY_inCervical(d);
        if (!started) { cCtx.moveTo(x, y); started = true; } else cCtx.lineTo(x, y);
    }
    cCtx.stroke();

    // action line (orange), starts at time=4
    cCtx.strokeStyle = '#fb8c00'; cCtx.lineWidth = 2;
    cCtx.beginPath(); started = false;
    for (let t = actionStart.time; t <= HOURS_TOTAL; t += 0.1) {
        const d = actionStart.dilation + (t - actionStart.time);
        if (d < 0 || d > MAX_DILATION) continue;
        const x = timeToX_inCanvas(t, C_W);
        const y = dilationToY_inCervical(d);
        if (!started) { cCtx.moveTo(x, y); started = true; } else cCtx.lineTo(x, y);
    }
    cCtx.stroke();

    // draw cervical points connecting by time
    if (cervicalPoints.length) {
        const sorted = cervicalPoints.slice().sort((a, b) => a.time - b.time);
        cCtx.strokeStyle = '#1e88e5'; cCtx.lineWidth = 2;
        cCtx.beginPath();
        sorted.forEach((p, idx) => {
            const x = timeToX_inCanvas(p.time, C_W), y = dilationToY_inCervical(p.dilation);
            if (idx === 0) cCtx.moveTo(x, y); else cCtx.lineTo(x, y);
        });
        cCtx.stroke();

        // markers
        sorted.forEach(p => {
            const x = timeToX_inCanvas(p.time, C_W), y = dilationToY_inCervical(p.dilation);
            cCtx.beginPath(); cCtx.fillStyle = '#1e88e5'; cCtx.arc(x, y, 6, 0, Math.PI * 2); cCtx.fill();
            cCtx.strokeStyle = '#063a66'; cCtx.lineWidth = 1; cCtx.stroke();
        });
    }
}

// ----- Draw Contractions (24 columns, 5 vertical boxes) -----
function drawContractions() {
    conCtx.clearRect(0, 0, CON_W, CON_H);
    // white background and grid
    conCtx.fillStyle = '#fff';
    conCtx.fillRect(PAD, 0, CON_W - PAD * 1.2, CON_H); // smaller left PAD for labels if needed

    // draw 24 columns evenly across width (use PAD left)
    const left = PAD;
    const right = CON_W - PAD / 1.2;
    const totalCols = HALF_HOUR_SLOTS; //24
    const colW = (right - left) / totalCols;
    const boxTop = 10;
    const boxHeight = CON_H - 20;
    // vertical column lines
    conCtx.strokeStyle = '#e6eef8';
    for (let i = 0; i <= totalCols; i++) {
        const x = left + i * colW;
        conCtx.beginPath(); conCtx.moveTo(x, boxTop); conCtx.lineTo(x, boxTop + boxHeight); conCtx.stroke();
    }
    // horizontal small divisions: 5 vertical boxes stacked (height per count)
    const perUnitH = boxHeight / CONTRACT_VERT;
    for (let r = 0; r <= CONTRACT_VERT; r++) {
        const y = boxTop + r * perUnitH;
        conCtx.beginPath(); conCtx.moveTo(left, y); conCtx.lineTo(right, y); conCtx.stroke();
    }

    // draw contraction points/columns (confined to column)
    contractionPoints.forEach(p => {
        const col = timeToColumnIndex(p.time);
        const xStart = left + col * colW;
        const xCenter = xStart + colW / 2;
        const heightUnits = Math.max(0, Math.min(CONTRACT_VERT, p.num));
        const fillTop = boxTop + (CONTRACT_VERT - heightUnits) * perUnitH;
        const fillH = heightUnits * perUnitH;

        if (p.type === 'weak') {
            // vertical strokes in the confined rectangle
            conCtx.strokeStyle = '#2b6cb0';
            conCtx.lineWidth = 2;
            // draw several vertical short strokes across the column width
            const strokes = 4;
            for (let s = 0; s < strokes; s++) {
                const sx = xStart + 2 + s * (colW - 6) / strokes;
                conCtx.beginPath(); conCtx.moveTo(sx, fillTop); conCtx.lineTo(sx, fillTop + fillH); conCtx.stroke();
            }
        } else if (p.type === 'mild') {
            // oblique hatch (diagonal) confined to the box rectangle
            conCtx.save();
            conCtx.beginPath();
            conCtx.rect(xStart + 2, fillTop, colW - 4, fillH);
            conCtx.clip();
            conCtx.strokeStyle = '#1b8a49';
            conCtx.lineWidth = 1.6;
            // draw diagonal lines across clipped area
            const step = 8;
            for (let sx = xStart - 60; sx < xStart + colW + 200; sx += step) {
                conCtx.beginPath();
                conCtx.moveTo(sx, fillTop - 40);
                conCtx.lineTo(sx + 40, fillTop + fillH + 40);
                conCtx.stroke();
            }
            conCtx.restore();
        } else if (p.type === 'strong') {
            // solid fill confined
            conCtx.fillStyle = 'rgba(220,50,50,0.9)';
            conCtx.fillRect(xStart + 2, fillTop, colW - 4, fillH);
        }

        // draw thin border around column fill
        conCtx.strokeStyle = 'rgba(10,20,30,0.06)';
        conCtx.lineWidth = 1;
        conCtx.strokeRect(xStart + 2, fillTop, colW - 4, fillH);
    });

    // small labels: left y (0..5)
    conCtx.fillStyle = '#0b2540'; conCtx.font = '12px Arial';
    for (let u = 0; u <= CONTRACT_VERT; u++) {
        const y = boxTop + u * perUnitH;
        // label only at leftmost row for clarity: number reversed
        const val = CONTRACT_VERT - u;
        conCtx.fillText(val, 8, y + 6);
    }
}

// ----- BP & Pulse combined (REPLACEMENT) -----
function drawBPPulse() {
    bpCtx.clearRect(0, 0, BP_W, BP_H);

    // Plot area margins
    const left = PAD;
    const right = BP_W - PAD;
    const top = PAD / 2;
    const bottom = BP_H - PAD / 2;
    const localW = right - left;
    const localH = bottom - top;

    // BP axis calibration (explicit)
    const minBP = 60;
    const maxBP = 180;

    // background
    bpCtx.fillStyle = '#fff';
    bpCtx.fillRect(left, top, localW, localH);

    // horizontal grid lines and labels every 10 mmHg (but label every 20 for readability)
    bpCtx.strokeStyle = '#eef6ff';
    bpCtx.lineWidth = 1;
    bpCtx.font = '12px Arial';
    bpCtx.fillStyle = '#0b2540';
    for (let val = minBP; val <= maxBP; val += 10) {
        // y position: higher BP -> smaller y (top)
        const y = top + (1 - (val - minBP) / (maxBP - minBP)) * localH;
        bpCtx.beginPath(); bpCtx.moveTo(left, y); bpCtx.lineTo(right, y); bpCtx.stroke();

        // label every 20 mmHg to avoid clutter
        if (val % 20 === 0) {
            bpCtx.fillText(val + ' mmHg', 8, y + 4); // left-of-chart labels
        }
    }

    // border
    bpCtx.strokeStyle = '#0b2540';
    bpCtx.lineWidth = 1.2;
    bpCtx.strokeRect(left, top, localW, localH);

    // draw X axis hour ticks (0..12 hours every hour)
    bpCtx.fillStyle = '#0b2540';
    for (let h = 0; h <= HOURS_TOTAL; h++) {
        const x = timeToX_inCanvas(h, BP_W);
        // small tick
        bpCtx.beginPath(); bpCtx.moveTo(x, bottom); bpCtx.lineTo(x, bottom + 6); bpCtx.stroke();
        bpCtx.fillText(h + 'h', x - 10, bottom + 20);
    }

    // Plot BP arrows (systolic to diastolic) for each entry
    bpPoints.forEach(p => {
        // clamp values to axis range for display
        const s = Math.max(minBP, Math.min(maxBP, p.systolic));
        const d = Math.max(minBP, Math.min(maxBP, p.diastolic));
        const x = timeToX_inCanvas(p.time, BP_W);
        const sY = top + (1 - (s - minBP) / (maxBP - minBP)) * localH;
        const dY = top + (1 - (d - minBP) / (maxBP - minBP)) * localH;

        // vertical connector line
        bpCtx.strokeStyle = '#2e7d32';
        bpCtx.lineWidth = 2;
        bpCtx.beginPath(); bpCtx.moveTo(x, sY); bpCtx.lineTo(x, dY); bpCtx.stroke();

        // systolic arrowhead (upwards triangle)
        bpCtx.fillStyle = '#2e7d32';
        bpCtx.beginPath();
        bpCtx.moveTo(x - 6, sY + 8);
        bpCtx.lineTo(x + 6, sY + 8);
        bpCtx.lineTo(x, sY - 6);
        bpCtx.closePath();
        bpCtx.fill();

        // diastolic arrowhead (downwards triangle)
        bpCtx.beginPath();
        bpCtx.moveTo(x - 6, dY - 8);
        bpCtx.lineTo(x + 6, dY - 8);
        bpCtx.lineTo(x, dY + 6);
        bpCtx.closePath();
        bpCtx.fill();

        // small label near arrows
        bpCtx.fillStyle = '#074';
        bpCtx.font = '11px Arial';
        bpCtx.fillText(`${s}/${d}`, x + 8, (sY + dY) / 2 + 4);
    });

    // Plot maternal pulse on same area (pink). Map expected pulse 30..220 to localH.
    if (pulsePoints.length) {
        const sorted = pulsePoints.slice().sort((a, b) => a.time - b.time);
        bpCtx.strokeStyle = '#ff66a8';
        bpCtx.lineWidth = 2;
        bpCtx.beginPath();
        sorted.forEach((p, idx) => {
            const x = timeToX_inCanvas(p.time, BP_W);
            // Map pulse range to chart area (let minPulse=30 maxPulse=220)
            const minPulse = 30, maxPulse = 220;
            const y = top + (1 - (p.value - minPulse) / (maxPulse - minPulse)) * localH;
            if (idx === 0) bpCtx.moveTo(x, y); else bpCtx.lineTo(x, y);
        });
        bpCtx.stroke();

        // markers
        sorted.forEach(p => {
            const x = timeToX_inCanvas(p.time, BP_W);
            const minPulse = 30, maxPulse = 220;
            const y = top + (1 - (p.value - minPulse) / (maxPulse - minPulse)) * localH;
            bpCtx.beginPath(); bpCtx.fillStyle = '#ff66a8'; bpCtx.arc(x, y, 5, 0, Math.PI * 2); bpCtx.fill();
            bpCtx.strokeStyle = '#7b1fa2'; bpCtx.lineWidth = 1; bpCtx.stroke();
        });
    }
}


// ----- redraw all -----
function redrawAll() {
    drawCervical();
    drawContractions();
    drawBPPulse();
    drawFHR();
}

// ----- add point from inputs (only plot to selected charts) -----
function addPointFromInputs() {
    const hour = Number(inputHour.value || 0);
    const minute = Number(inputMinute.value || 0);
    const time = timeToDecimal(hour, minute);

    if (isNaN(time)) return alert('Invalid time');

    // Cervical
    if (chkCervical.checked) {
        const dilation = Math.max(0, Math.min(MAX_DILATION, Number(inputDilation.value || 0)));
        cervicalPoints.push({ time, dilation, effacement: Number(inputEffacement.value || 0) });
    }

    // Contractions
    if (chkContractions.checked) {
        const num = Math.max(0, Math.min(CONTRACT_VERT, parseInt(inputContractionsNumber.value || 0, 10)));
        const type = inputContractionType.value;
        const duration = Number(inputContractionDuration.value || 0);
        contractionPoints.push({ time, num, type, duration });
    }

    // Pulse
    if (chkPulse.checked) {
        const pulseVal = Number(inputPulse.value || 0);
        pulsePoints.push({ time, value: pulseVal });
    }

    // BP
    if (chkBP.checked) {
        const bpRaw = (inputBP.value || '').trim();
        let syst = 0, dias = 0;
        if (bpRaw.includes('/')) {
            const parts = bpRaw.split('/').map(x => parseInt(x, 10));
            syst = parts[0] || 0; dias = parts[1] || 0;
        } else {
            // assume systolic only fallback
            syst = parseInt(bpRaw || 120, 10);
            dias = Math.max(40, Math.round(syst - 40));
        }
        bpPoints.push({ time, systolic: syst, diastolic: dias });
    }

    // FHR
    if (chkFHR.checked) {
        const fhrVal = Number(inputFHR.value || 0);
        fhrPoints.push({ time, value: fhrVal });
    }

    redrawAll();
}

// ----- UI button handlers -----
btnPlotInput.addEventListener('click', () => {
    addPointFromInputs();
});

btnReset.addEventListener('click', () => {
    if (!confirm('Reset all plotted data?')) return;
    cervicalPoints = []; contractionPoints = []; pulsePoints = []; bpPoints = []; fhrPoints = [];
    redrawAll();
});

btnExportAll.addEventListener('click', () => {
    // export cervical as example
    const dataURL = cervicalCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'partograph_cervical.png';
    document.body.appendChild(a); a.click(); a.remove();
});

// Initial draw
redrawAll();
