// File upload handling
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.style.borderColor = '#0d3b5e';
    dropArea.style.backgroundColor = '#eef6ff';
}

function unhighlight() {
    dropArea.style.borderColor = '#dee2e6';
    dropArea.style.backgroundColor = '#f8f9fa';
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
        processFile(files[0]);
    }
}

fileInput.addEventListener('change', function() {
    if (this.files.length) {
        processFile(this.files[0]);
    }
});

function processFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        let text = '';
        const name = file.name.toLowerCase();
        
        if (name.endsWith('.pdf')) {
            text = "[PDF uploaded — text extraction not available in browser demo. Paste text manually or use desktop tool.]";
        } else if (name.endsWith('.docx')) {
            text = "[DOCX uploaded — text extraction not available in browser demo. Paste text manually.]";
        } else if (name.endsWith('.txt')) {
            text = e.target.result;
        } else {
            text = e.target.result;
        }
        
        document.getElementById('contract-text').value = text;
        alert(`✅ File loaded: ${file.name}\n\nFor PDF/DOCX: Please copy-paste key sections manually for full analysis.`);
    };
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
    } else {
        reader.readAsText(new Blob(['']), 'utf-8'); // dummy for non-txt
    }
}

// Checkpoint data (matches your GMU template)
const CHECKLIST = [
    {
        section: "GENERAL GRANT INFORMATION",
        items: [
            { q: "Donor", flag: "gray", key: "donor", detect: /donor[:\s]+([\w\s\-]+)/i },
            { q: "Lead donor (if any)", flag: "gray", detect: /lead donor|back[\s\-]funder/i },
            { q: "Project title", flag: "gray", detect: /project title[:\s]+([^\n]+)/i },
            { q: "Start/end date; duration", flag: "gray", detect: /start.*date|end.*date|duration.*month/i },
            { q: "Grant amount and currency", flag: "gray", detect: /\$[\d,]+|€[\d,]+|USD|grant amount/i },
            { q: "Project leader", flag: "gray", detect: /project leader|sub[\s\-]lever/i },
            { q: "GMU Reviewer", flag: "gray", detect: /gmu reviewer/i }
        ]
    },
    {
        section: "BASIC CONTRACTUAL INFORMATION",
        items: [
            { q: "TOR aligned with proposal?", flag: "orange", detect: /terms of reference|tor.*align/i },
            { q: "Whereas includes Bioversity/CIAT legal status?", flag: "red", detect: /bioversity.*1991|ciat.*1986|host country agreement/i },
            { q: "Proposal budget annexed?", flag: "orange", detect: /budget annex|P number/i },
            { q: "Defined payment schedule?", flag: "gray", detect: /payment schedule|tranche/i },
            { q: "Intra-Alliance Grant?", flag: "orange", detect: /intra[\s\-]alliance/i },
            { q: "Project period matches proposal?", flag: "orange", detect: /project period|start.*end date/i },
            { q: "Correct bank account listed?", flag: "red", detect: /bank account|iban/i }
        ]
    },
    {
        section: "REPORTING REQUIREMENTS",
        items: [
            { q: "Reporting schedule ≥60 days?", flag: "red", detect: /report.*due.*\d+\s*days/i },
            { q: "Financial report formats reasonable?", flag: "orange", detect: /financial report.*format/i },
            { q: "Project audits budgeted?", flag: "orange", detect: /project audit/i }
        ]
    },
    {
        section: "FINANCIAL CONDITIONS",
        items: [
            { q: "Budget flexibility ≥±10%?", flag: "orange", detect: /budget.*flexibility|±\s*\d+%/i },
            { q: "Overhead/CSP allowed? (15% / 2.04%)", flag: "orange", detect: /overhead|CSP|indirect cost/i },
            { q: "Donor procurement rules differ?", flag: "red", detect: /donor procurement/i },
            { q: "Record retention ≤10 years?", flag: "red", detect: /retain.*record.*\d+\s*year/i },
            { q: "Tax obligations clarified?", flag: "red", detect: /tax|VAT|withholding/i },
            { q: "Interest clause acceptable?", flag: "red", detect: /interest|unspent funds/i }
        ]
    },
    {
        section: "LEGAL CONDITIONS",
        items: [
            { q: "Immunities preserved? (No waiver)", flag: "red", detect: /immunity|waiver.*privilege/i },
            { q: "IP provisions acceptable?", flag: "orange", detect: /intellectual property|background IP/i },
            { q: "Indemnity clause acceptable?", flag: "red", detect: /indemnify|consequential damage/i },
            { q: "Liquidated damages/penalties?", flag: "red", detect: /penalty|liquidated damage/i },
            { q: "Donor policies imposed?", flag: "red", detect: /comply with.*donor policy/i },
            { q: "Insurance provisions acceptable?", flag: "red", detect: /insurance|professional indemnity/i }
        ]
    }
];

// Main analysis function
function analyzeContract() {
    const text = document.getElementById('contract-text').value.trim();
    if (!text) {
        alert("⚠️ Please paste agreement text or upload a file.");
        return;
    }

    let html = '';
    let red = 0, orange = 0, gray = 0;
    let findings = [];

    CHECKLIST.forEach(group => {
        html += `<tr class="section-header"><td colspan="3">${group.section}</td></tr>`;
        
        group.items.forEach(item => {
            let detected = item.detect ? text.match(item.detect) : false;
            let flagClass = '';
            let flagSymbol = '⚪';
            let comment = detected ? '✅ Yes' : '❌ No';

            if (detected) {
                if (item.flag === 'red') { flagClass = 'flag-red'; flagSymbol = '🔴'; red++; }
                else if (item.flag === 'orange') { flagClass = 'flag-orange'; flagSymbol = '🟠'; orange++; }
                else { flagClass = 'flag-gray'; flagSymbol = '⚪'; gray++; }
            } else {
                if (item.flag === 'red') { flagClass = 'flag-red'; flagSymbol = '🔴'; red++; findings.push(`🔴 RED: ${item.q}`); }
                else if (item.flag === 'orange') { flagClass = 'flag-orange'; flagSymbol = '🟠'; orange++; findings.push(`🟠 ORANGE: ${item.q}`); }
                else { flagClass = 'flag-gray'; flagSymbol = '⚪'; gray++; }
            }

            html += `
                <tr>
                    <td>${item.q}</td>
                    <td><span class="${flagClass}">${flagSymbol}</span></td>
                    <td>${comment}</td>
                </tr>
            `;
        });
    });

    document.getElementById('checklist-body').innerHTML = html;
    document.getElementById('red-count').textContent = red;
    document.getElementById('orange-count').textContent = orange;
    document.getElementById('gray-count').textContent = gray;

    // Generate email
    let email = `✅ Grant Master Review — ${new Date().toLocaleDateString()}\n\n`;
    email += `Summary: 🔴 ${red} RED | 🟠 ${orange} ORANGE | ⚪ ${gray} GRAY\n\n`;
    
    if (findings.length > 0) {
        email += `⚠️ Action Required:\n`;
        findings.forEach(f => email += `- ${f}\n`);
    } else {
        email += `✅ No critical flags. Proceed with standard clearance.\n`;
    }

    email += `\nNext:\n`;
    email += `- RED: Escalate to Legal + PLANS\n`;
    email += `- ORANGE: Flag in clearance email for PI awareness\n`;
    email += `- Verify missing docs (budget, logframe) in PBI`;

    document.getElementById('email-draft').textContent = email;
    document.getElementById('results').style.display = 'block';
}

function copyEmail() {
    const text = document.getElementById('email-draft').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.btn-copy');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }).catch(err => {
        alert('Copy failed. Select text manually and use Ctrl+C.');
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Optional: load sample text for demo
    // document.getElementById('contract-text').value = "Sample donor agreement text with Bioversity International 1991... payment schedule... etc.";
});
