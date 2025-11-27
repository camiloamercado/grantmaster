// ===== Grant Master — Minimal Fix (camiloamercado/grantmaster) =====
// Goal: Show actual findings (donor, clauses, dates) in results table

function analyzeContract() {
    const text = document.getElementById('contract-text')?.value?.trim() || '';
    if (!text) {
        alert("⚠️ Please paste the agreement text first.");
        return;
    }

    // Simple but effective extraction rules — focused on your checklist
    const findings = {
        donor: /(?:donor|funder|grantor)\s*[:\-]?\s*([A-Za-z\s\&\.]+)/i,
        title: /(?:project title|title)\s*[:\-]?\s*"([^"\n]+)"/i,
        amount: /(?:grant amount|total value)\s*[:\-]?\s*(\$|€|USD|EUR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
        dates: /(?:start|effective).*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}).*?(?:end|completion).*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
        bioversityClause: /(Bioversity International.*?1991.*?revised.*?2015)/is,
        ciatClause: /(CIAT.*?1986.*?Law 29 of 1988)/is,
        bankAccount: /(IBAN[:\s]*[A-Z0-9]{10,}|Account\s*No[:\s]*\d{5,})/i,
        paymentSchedule: /(payment schedule|tranche\s*\d+.*?\d+%)/i,
        reportingDeadline: /report.*?due.*?within\s*(\d+)\s*days/i,
        overheadRate: /(overhead|indirect cost).*?(\d+(?:\.\d+)?)\s*%/i,
        insurance: /(professional indemnity|liability insurance)/i,
        immunity: /(no waiver.*?immunity|privileges and immunities granted)/is
    };

    let red = 0, orange = 0, gray = 0;
    let rows = '';

    // Helper to add a row
    function addRow(label, flag, detail) {
        let flagSymbol = '⚪', flagClass = 'flag-gray';
        if (flag === 'red') { flagSymbol = '🔴'; flagClass = 'flag-red'; red++; }
        else if (flag === 'orange') { flagSymbol = '🟠'; flagClass = 'flag-orange'; orange++; }
        else { gray++; }

        rows += `
            <tr>
                <td>${label}</td>
                <td><span class="${flagClass}">${flagSymbol}</span></td>
                <td>${detail}</td>
            </tr>
        `;
    }

    // === Extract & Display ===
    let donor = text.match(findings.donor);
    let title = text.match(findings.title);
    let amount = text.match(findings.amount);
    let dates = text.match(findings.dates);

    addRow("Donor", "gray", donor ? `✅ ${donor[1].trim()}` : "❌ Not found");
    addRow("Project Title", "gray", title ? `✅ "${title[1]}"` : "❌ Not found");
    addRow("Grant Amount", "gray", amount ? `✅ ${(amount[1] || 'USD')} ${amount[2]}` : "❌ Not found");
    addRow("Dates (Start → End)", "gray", dates ? `✅ ${dates[1]} → ${dates[2]}` : "❌ Not found");

    // Contractual
    let bio = text.match(findings.bioversityClause);
    let ciat = text.match(findings.ciatClause);
    let legalStatus = bio || ciat;
    addRow("Bioversity/CIAT Legal Status Clause", "red", 
        legalStatus ? `✅ Found: "${legalStatus[0].substring(0,60)}…"` : "❌ Missing — RED FLAG");

    let bank = text.match(findings.bankAccount);
    addRow("Bank Account Listed", "red", bank ? `✅ ${bank[0]}` : "❌ Missing — RED FLAG");

    let payment = text.match(findings.paymentSchedule);
    addRow("Payment Schedule", "gray", payment ? `✅ "${payment[0]}"` : "⚠️ Not specified");

    // Reporting
    let deadline = text.match(findings.reportingDeadline);
    addRow("Reporting Deadline", "red", 
        deadline ? `✅ ${deadline[1]} days` : "❌ Not ≥60 days — RED FLAG");

    // Financial
    let overhead = text.match(findings.overheadRate);
    addRow("Overhead Rate", "orange", overhead ? `✅ ${overhead[2]}%` : "⚠️ Not specified");

    // Legal
    let ins = text.match(findings.insurance);
    addRow("Insurance Requirements", "red", ins ? `✅ "${ins[0]}"` : "❌ Not found — RED FLAG");

    let imm = text.match(findings.immunity);
    addRow("Immunity Preserved", "red", imm ? `✅ "${imm[0].substring(0,50)}…"` : "❌ Waiver risk — RED FLAG");

    // Update UI
    if (document.getElementById('checklist-body')) {
        document.getElementById('checklist-body').innerHTML = rows;
    }

    document.getElementById('red-count').textContent = red;
    document.getElementById('orange-count').textContent = orange;
    document.getElementById('gray-count').textContent = gray;

    // Email draft
    let email = `✅ Grant Master Review — ${new Date().toLocaleDateString()}\n\n`;
    email += `Summary: 🔴 ${red} RED | 🟠 ${orange} ORANGE | ⚪ ${gray} GRAY\n\n`;

    if (donor) email += `• Donor: ${donor[1].trim()}\n`;
    if (title) email += `• Project: ${title[1]}\n`;
    if (amount) email += `• Amount: ${(amount[1] || 'USD')} ${amount[2]}\n`;
    if (dates) email += `• Period: ${dates[1]} to ${dates[2]}\n`;

    if (red > 0) {
        email += `\n🚨 RED FLAGS — Escalate to Legal + PLANS:\n`;
        if (!legalStatus) email += `- Missing Bioversity/CIAT legal status clause\n`;
        if (!bank) email += `- Bank account not specified\n`;
        if (!deadline || parseInt(deadline?.[1]) < 60) email += `- Reporting deadline <60 days\n`;
        if (!imm) email += `- Immunity clause risk\n`;
    }

    email += `\nPrepared by Grant Master | https://camiloamercado.github.io/grantmaster`;
    document.getElementById('email-draft').textContent = email;

    // Show results
    const results = document.getElementById('results');
    if (results) results.style.display = 'block';
}

// Copy email
function copyEmail() {
    const el = document.getElementById('email-draft');
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => {
        const btn = document.querySelector('.btn-copy');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = orig, 2000);
    });
}

// File upload (lightweight)
document.getElementById('file-input')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        alert(`📎 Uploaded: ${file.name}\n\n⚠️ For PDF/DOCX: Please copy-paste key clauses below for analysis.`);
    }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Optional: demo text for quick test
    // document.getElementById('contract-text').value = `Donor: USAID\nProject Title: "Climate-Resilient Seeds for Sahel"\nGrant Amount: USD 1,250,000\nStart: 01/03/2025 → End: 28/02/2027\nWhereas: Bioversity International, legally known as..., 1991, revised 2015...\nReporting due within 30 days.\nOverhead: 15%.\nProfessional indemnity insurance required.`;
});
