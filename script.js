// File upload handling (unchanged)
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
        
        if (name.endsWith('.pdf') || name.endsWith('.docx')) {
            text = "[File uploaded: " + file.name + "]\n\n⚠️ Browser cannot extract text from PDF/DOCX.\n→ Please copy-paste key sections below for full analysis.";
        } else if (name.endsWith('.txt')) {
            text = e.target.result;
        } else {
            text = e.target.result;
        }
        
        document.getElementById('contract-text').value = text;
        if (name.endsWith('.pdf') || name.endsWith('.docx')) {
            alert("✅ File uploaded. For full analysis, please paste relevant clauses in the text box.");
        }
    };
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
    } else {
        reader.readAsText(new Blob(['']), 'utf-8');
    }
}

// Enhanced checklist with capture logic
const CHECKLIST = [
    {
        section: "GENERAL GRANT INFORMATION",
        items: [
            { 
                q: "Donor", 
                flag: "gray", 
                detect: /(?:donor|funder|grantor)[:\s]+([A-Za-z\s\-\.\&]+?)(?:\n|\.|,|;|$)/i,
                extractor: (match) => match ? match[1].trim() : null
            },
            { 
                q: "Project title", 
                flag: "gray", 
                detect: /(?:project title|title of project|agreement title)[:\s]+"?([^\n"]+?)"?(?:\n|\.|$)/i,
                extractor: (match) => match ? match[1].trim() : null
            },
            { 
                q: "Start and end date", 
                flag: "gray", 
                detect: /(?:start date|commencement|effective date)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})[\s\S]{0,50}?(?:end date|termination|completion)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
                extractor: (match) => match ? `${match[1]} → ${match[2]}` : null
            },
            { 
                q: "Grant amount", 
                flag: "gray", 
                detect: /(?:grant amount|total funding|contract value)[:\s]+(\$|€|USD|EUR)?\s*([\d,]+(?:\.\d{1,2})?)/i,
                extractor: (match) => match ? (match[1] || 'USD') + ' ' + match[2] : null
            },
            { 
                q: "Project leader", 
                flag: "gray", 
                detect: /(?:project leader|team leader|principal investigator)[:\s]+([A-Za-z\s\.\-]+)/i,
                extractor: (match) => match ? match[1].trim() : null
            }
        ]
    },
    {
        section: "BASIC CONTRACTUAL INFORMATION",
        items: [
            { 
                q: "Whereas includes Bioversity/CIAT legal status?", 
                flag: "red",
                detect: /(Bioversity International.*1991.*revised.*2015|CIAT.*1986.*Law 29 of 1988)/i,
                extractor: (match) => match ? `"${match[1]}"` : null
            },
            { 
                q: "Proposal budget annexed?", 
                flag: "orange",
                detect: /(P\s*[-\s]?\d{4,6})|(Budget Annex\s*[:\-]?\s*Annex\s*\w+)/i,
                extractor: (match) => match ? match[0] : null
            },
            { 
                q: "Defined payment schedule?", 
                flag: "gray",
                detect: /(payment schedule|disbursement schedule|tranche\s*\d+.*\d+%)/i,
                extractor: (match) => match ? `"${match[0]}"` : null
            },
            { 
                q: "Correct bank account listed?", 
                flag: "red",
                detect: /(IBAN[:\s]*[A-Z0-9\s]{10,}|Account No[:\s]*\d{5,})/i,
                extractor: (match) => match ? match[0].trim() : null
            }
        ]
    },
    {
        section: "REPORTING REQUIREMENTS",
        items: [
            { 
                q: "Reporting deadline (days after period)", 
                flag: "red",
                detect: /report.*due.*within\s*(\d+)\s*days/i,
                extractor: (match) => match ? match[1] + ' days' : null
            },
            { 
                q: "Financial report formats specified?", 
                flag: "orange",
                detect: /(financial report template|format attached|see Annex \w+)/i,
                extractor: (match) => match ? `"${match[0]}"` : null
            }
        ]
    },
    {
        section: "FINANCIAL CONDITIONS",
        items: [
            { 
                q: "Budget flexibility (%)", 
                flag: "orange",
                detect: /budget.*flexibility.*±\s*(\d+)%/i,
                extractor: (match) => match ? `±${match[1]}%` : null
            },
            { 
                q: "Overhead rate (%)", 
                flag: "orange",
                detect: /(overhead|indirect cost).*?(\d+(?:\.\d+)?)\s*%/i,
                extractor: (match) => match ? match[2] + '%' : null
            },
            { 
                q: "Tax obligation clause", 
                flag: "red",
                detect: /(withholding tax|VAT|tax liability).*?(applicable|exempt|payable)/i,
                extractor: (match) => match ? `"${match[0]}"` : null
            }
        ]
    },
    {
        section: "LEGAL CONDITIONS",
        items: [
            { 
                q: "Immunity clause preserved?", 
                flag: "red",
                detect: /(no waiver.*privilege|immunity.*granted by.*agreement)/i,
                extractor: (match) => match ? `"${match[0]}"` : null
            },
            { 
                q: "Indemnity excludes consequential damages?", 
                flag: "red",
                detect: /indemnify.*?(no|not).*?(consequential|indirect).*?damage/i,
                extractor: (match) => match ? `"${match[0]}"` : null
            },
            { 
                q: "Insurance requirements", 
                flag: "red",
                detect: /(professional indemnity|liability insurance|coverage of \$[\d,]+)/i,
                extractor: (match) => match ? `"${match[0]}"` : null
            }
        ]
    }
];

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
            const match = item.detect ? text.match(item.detect) : null;
            const extracted = item.extractor ? item.extractor(match) : (match ? 'Detected' : null);
            
            let flagClass = '';
            let flagSymbol = '⚪';
            let detail = extracted || 'Not found';

            if (match) {
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
                    <td>${detail}</td>
                </tr>
            `;
        });
    });

    document.getElementById('checklist-body').innerHTML = html;
    document.getElementById('red-count').textContent = red;
    document.getElementById('orange-count').textContent = orange;
    document.getElementById('gray-count').textContent = gray;

    // Enhanced email with extracted details
    let email = `✅ Grant Master Review — ${new Date().toLocaleDateString()}\n\n`;
    email += `Summary: 🔴 ${red} RED | 🟠 ${orange} ORANGE | ⚪ ${gray} GRAY\n\n`;

    // Add key extracted values
    const donorMatch = text.match(/(?:donor|funder)[:\s]+([A-Za-z\s\-\.\&]+)/i);
    const titleMatch = text.match(/(?:project title)[:\s]+"?([^\n"]+)"/i);
    const amountMatch = text.match(/(?:grant amount)[:\s]+(\$|€|USD|EUR)?\s*([\d,]+)/i);
    
    if (donorMatch) email += `• Donor: ${donorMatch[1].trim()}\n`;
    if (titleMatch) email += `• Project: ${titleMatch[1].trim()}\n`;
    if (amountMatch) email += `• Amount: ${(amountMatch[1] || 'USD')} ${amountMatch[2]}\n`;
    
    if (findings.length > 0) {
        email += `\n⚠️ Action Required:\n`;
        findings.forEach(f => email += `- ${f}\n`);
    } else {
        email += `\n✅ No critical flags. Proceed with clearance.\n`;
    }

    email += `\nPrepared by Grant Master | https://camiloamercado.github.io/grantmaster`;
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
