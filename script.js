// Tab switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.sidebar li').forEach(item => item.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const content = document.getElementById(elementId).querySelector('.output-content').innerText;
    navigator.clipboard.writeText(content).then(() => {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        alert('Copy failed — please select text and use Ctrl+C');
    });
}

// Grant Drafting AI (Mock)
function generateGrantSection(section) {
    const title = document.getElementById('project-title').value || "Resilient Agriculture Project";
    const region = document.getElementById('target-region').value || "Sahel Region";
    const summary = document.getElementById('project-summary').value || "Improving food security through climate-smart agriculture";
    
    let output = "";
    if (section === 'problem-statement') {
        output = `Despite significant investments in agricultural development, the ${region} continues to face severe food insecurity driven by climate variability, land degradation, and limited access to resilient farming inputs. Over 65% of smallholder farmers in the target communities rely on rain-fed agriculture, making them highly vulnerable to extended dry spells. Recent droughts have reduced crop yields by up to 40%, exacerbating malnutrition rates among children under five (currently at 32% GAM). Without intervention, climate projections indicate worsening conditions, threatening the livelihoods of over 15,000 households.`;
    }
    
    document.getElementById('grant-output-content').innerHTML = `<p>${output}</p>`;
}

// Budget Justification AI (Mock)
function generateBudgetJustification() {
    const justification = `This budget line supports the deployment of 10 qualified Field Officers to ensure rigorous monitoring, data collection, and community engagement across 5 target districts. Officers will conduct bi-weekly site visits to verify activity implementation, collect beneficiary feedback, and document challenges for adaptive management. Their presence is critical for maintaining data integrity (required by donor M&E framework), ensuring accountability to beneficiaries, and enabling real-time course corrections. Salaries align with local NGO salary scales and include provisions for transport, communication, and security allowances per humanitarian standards.`;
    
    document.getElementById('budget-output-content').innerHTML = `<p>${justification}</p>`;
}

// Risk Analysis AI (Mock)
function generateRiskAnalysis() {
    const risks = `
🚨 **Security Risks**: 
- *Risk*: Armed group interference in distribution points
- *Mitigation*: Coordinate with local peace committees; use decentralized "mobile distribution units"; avoid fixed locations; register all beneficiaries with community leaders

⚠️ **Logistical Risks**: 
- *Risk*: Fuel shortages delaying transport
- *Mitigation*: Pre-position 30% of seeds in regional hubs; partner with local transporters with alternative fuel sources; build 2-week buffer into timeline

🌍 **Environmental Risks**: 
- *Risk*: Early rains damaging stored seeds
- *Mitigation*: Use hermetically sealed storage; train staff on moisture monitoring; distribute moisture-test kits to lead farmers
    `;
    
    document.getElementById('risk-output-content').innerHTML = `<pre>${risks}</pre>`;
}

// Donor Matcher AI (Mock)
function analyzeDonor(donor) {
    let analysis = "";
    
    switch(donor) {
        case 'USAID':
            analysis = `✅ **Strong Alignment**: 
• Resilience focus matches USAID's "Jigawa Resilience Activity" priorities
• Localization approach aligns with USAID Policy Framework 2023
• Gender integration (40% women beneficiaries) meets minimum threshold

📌 **Key Requirements to Highlight**:
- Self-reliance transition plan (include exit strategy)
- Local partner capacity strengthening budget line (min. 15% of total)
- CLA (Collaborating, Learning, Adapting) framework integration`;
            break;
            
        case 'EU':
            analysis = `✅ **Strong Alignment**: 
• Climate adaptation component supports EU Green Deal for Africa
• Human rights-based approach (participatory design) meets EC requirements
• Gender equality plan exceeds minimum standards

📌 **Key Requirements to Highlight**:
- Do No Harm analysis (mandatory for all proposals)
- Environmental Impact Screening (attach Form EIA-1)
- Budget earmarking for disability inclusion (min. 5%)`;
            break;
            
        case 'Gates':
            analysis = `✅ **Strong Alignment**: 
• Agricultural innovation focus matches Gates' "Agricultural Development" strategy
• Smallholder farmer focus aligns with target population
• Data-driven M&E approach supports learning agenda

📌 **Key Requirements to Highlight**:
- Pathways to scale (government adoption plan)
- Cost-per-beneficiary analysis
- Gender-disaggregated outcome indicators`;
            break;
    }
    
    document.getElementById('donor-output-content').innerHTML = `<pre>${analysis}</pre>`;
}

// Report Generator AI (Mock)
function generateReport() {
    const report = `**Progress Update: Weeks 10-12**

✅ **Achievements**:
- Distributed drought-resistant millet and sorghum seeds to 1,275 households (85% of target)
- Completed 6 farmer field schools training 320 participants (65% women)
- Established 15 village savings groups with 450 members

⚠️ **Challenges & Adaptive Actions**:
- Fuel shortages delayed truck deliveries in Region X (Week 11). *Response*: Partnered with local cooperative for motorcycle transport; redistributed 30% of seeds via community leaders.
- Low male participation in trainings (28%). *Response*: Launched evening sessions; engaged religious leaders as champions.

📈 **Next Steps**:
- Begin soil testing in 5 pilot villages (Week 13)
- Conduct midline survey (Week 14)
- Submit quarterly financial report to donor`;
    
    document.getElementById('report-output-content').innerHTML = `<pre>${report}</pre>`;
}

// SDG Analyzer AI (Mock)
function analyzeSDG() {
    const sdgAnalysis = `🎯 **Primary SDG Alignment**:
• SDG 5 (Gender Equality): Directly empowers women with technical skills & income generation
• SDG 7 (Affordable & Clean Energy): Expands renewable energy access in rural communities
• SDG 8 (Decent Work): Creates green jobs in maintenance & sales

📊 **Relevant Indicators**:
- 5.b: Proportion of women with access to technology
- 7.1.1: Access to electricity (% population)
- 8.5.1: Average hourly earnings (by gender)

💡 **Co-benefits**:
- SDG 13 (Climate Action): Solar reduces kerosene dependence → lower emissions
- SDG 3 (Health): Reduced indoor air pollution from kerosene lamps`;
    
    document.getElementById('sdg-output-content').innerHTML = `<pre>${sdgAnalysis}</pre>`;
}

// ===== CONTRACT IQ MODULE =====

// Sample agreement for demo
const SAMPLE_AGREEMENT = `The Recipient shall maintain Comprehensive General Liability insurance ($5M), Professional Indemnity ($2M), and War Risk insurance for field staff in high-risk zones. Governing law: English law. Disputes resolved via ICC arbitration in Paris (English language). Late narrative reports incur penalty of 0.5% of installment per week. Financial reports due quarterly within 30 days; audit required annually. Payments disbursed in 4 tranches (25% upfront, 25% mid-term, 40% on delivery, 10% post-audit). Recipient liable for third-party harm caused by staff negligence. Data breaches must be reported within 72h per GDPR. USAID ADS 303 compliance required.`;

function loadSample() {
    document.getElementById('contract-text').value = SAMPLE_AGREEMENT;
}

function resetContractAnalysis() {
    document.getElementById('contract-text').value = '';
    document.getElementById('file-input').value = '';
    document.getElementById('contract-results').style.display = 'none';
    ['insurance', 'legal', 'arbitration', 'penalty'].forEach(id => 
        document.getElementById(`${id}-count`).textContent = '0'
    );
}

// Simulate file upload
document.getElementById('file-input').addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        alert(`📄 Uploaded: ${e.target.files[0].name}\n\n✅ For demo, using sample text.\nIn production: PDF/DOCX text extraction would run here.`);
        document.getElementById('contract-text').value = SAMPLE_AGREEMENT;
    }
});

// Drag & drop setup
const dropArea = document.getElementById('drop-area');
if (dropArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.style.borderColor = '#2563eb';
            dropArea.style.backgroundColor = '#f0f9ff';
        }, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.style.borderColor = '#cbd5e1';
            dropArea.style.backgroundColor = 'white';
        }, false);
    });
    dropArea.addEventListener('drop', function(e) {
        preventDefaults(e);
        if (e.dataTransfer.files.length) {
            document.getElementById('file-input').files = e.dataTransfer.files;
            document.getElementById('file-input').dispatchEvent(new Event('change'));
        }
    }, false);
}

// Main analysis function (mock AI logic)
function analyzeContract() {
    const text = document.getElementById('contract-text').value.trim();
    
    if (!text) {
        alert("⚠️ Please paste agreement text or upload a file.");
        return;
    }

    document.getElementById('contract-results').style.display = 'block';
    
    // Insurance detection
    const insurance = [];
    if (text.match(/liability insurance|general liability/i)) 
        insurance.push("✅ Comprehensive General Liability ($5M minimum)");
    if (text.match(/professional indemnity|errors and omissions/i)) 
        insurance.push("✅ Professional Indemnity ($2M minimum)");
    if (text.match(/war risk|kidnap and ransom|high-risk zone/i)) 
        insurance.push("✅ War Risk / K&R for field staff");
    if (text.match(/directors and officers|d&o/i)) 
        insurance.push("✅ Directors & Officers (D&O) Insurance");
    
    const insuranceHTML = insurance.length 
        ? `<ul>${insurance.map(i => `<li>${i}</li>`).join('')}</ul>`
        : `<p>No specific insurance requirements detected. <em>Recommendation: Verify donor standard requirements (e.g., USAID requires $1M GL).</em></p>`;
    document.getElementById('insurance-output').innerHTML = insuranceHTML;
    document.getElementById('insurance-count').textContent = insurance.length;

    // Legal norms
    const legal = [];
    if (text.match(/governing law|english law|new york law/i)) 
        legal.push("⚖️ Governing Law: English law");
    if (text.match(/far|federal acquisition regulation/i)) 
        legal.push("📜 Compliance: FAR Subpart 252.225-7040 (Contractor Personnel in Host Nations)");
    if (text.match(/omb|office of management and budget/i)) 
        legal.push("📜 Compliance: OMB Uniform Guidance (2 CFR 200)");
    if (text.match(/gdpr|data protection/i)) 
        legal.push("🛡️ GDPR compliance required for EU beneficiaries");
    if (text.match(/ads 303|aidar/i)) 
        legal.push("📜 USAID ADS Chapter 303 / AIDAR compliance");
    
    const legalHTML = legal.length 
        ? `<ul>${legal.map(l => `<li>${l}</li>`).join('')}</ul>`
        : `<p>No explicit legal norms detected. <em>Caution: Standard donor clauses may apply.</em></p>`;
    document.getElementById('legal-output').innerHTML = legalHTML;
    document.getElementById('legal-count').textContent = legal.length;

    // Arbitration
    const arbitration = [];
    if (text.match(/icc arbitration|paris/i)) 
        arbitration.push("🏛️ ICC Rules, Paris seat");
    if (text.match(/uncitral|united nations/i)) 
        arbitration.push("🏛️ UNCITRAL Rules");
    if (text.match(/english|french|arabic/i) && text.match(/language/i)) 
        arbitration.push("🗣️ Proceedings in English");
    if (text.match(/mediation|negotiation/i)) 
        arbitration.push("🤝 Mandatory mediation before arbitration");
    
    const arbitrationHTML = arbitration.length 
        ? `<ul>${arbitration.map(a => `<li>${a}</li>`).join('')}</ul>`
        : `<p>No arbitration clause found. <em>Disputes may be subject to local courts.</em></p>`;
    document.getElementById('arbitration-output').innerHTML = arbitrationHTML;
    document.getElementById('arbitration-count').textContent = arbitration.length;

    // Penalties
    const penalties = [];
    if (text.match(/penalty|liquidated damages|0\.5%/i)) 
        penalties.push("⚠️ Late reporting: 0.5% of installment/week");
    if (text.match(/performance failure|breach/i)) 
        penalties.push("⚠️ Performance shortfall: 2% of total grant");
    if (text.match(/audit finding|material weakness/i)) 
        penalties.push("⚠️ Unresolved audit findings: Withholding of next tranche");
    
    const penaltyHTML = penalties.length 
        ? `<ul>${penalties.map(p => `<li>${p}</li>`).join('')}</ul>`
        : `<p>No financial penalties specified. <em>Standard donor penalties may apply.</em></p>`;
    document.getElementById('penalty-output').innerHTML = penaltyHTML;
    document.getElementById('penalty-count').textContent = penalties.length;

    // Reporting & Payment Schedules
    const schedule = [];
    if (text.match(/quarterly.*30 days|financial reports/i)) 
        schedule.push("📅 Financial Reports: Quarterly, within 30 days of period end");
    if (text.match(/narrative report|progress report/i)) 
        schedule.push("📅 Narrative Reports: Quarterly, within 30 days");
    if (text.match(/audit|annual audit/i)) 
        schedule.push("📅 External Audit: Annually, within 90 days of FY end");
    if (text.match(/25% upfront|tranche/i)) 
        schedule.push("💰 Disbursement: 4 tranches (25% upfront, 25% mid-term, 40% on delivery, 10% post-audit)");
    
    const scheduleHTML = schedule.length 
        ? `<ul>${schedule.map(s => `<li>${s}</li>`).join('')}</ul>`
        : `<p>No explicit schedules found. <em>Assume standard donor timelines (e.g., USAID: 30-day reporting).</em></p>`;
    document.getElementById('schedule-output').innerHTML = scheduleHTML;

    // Funder Requirements
    const funderReqs = [];
    if (text.match(/ads 303|aidar/i)) 
        funderReqs.push("🎯 USAID: ADS 303 (Procurement), 576 (Suspension/Debarment)");
    if (text.match(/srmr|strategic risk management/i)) 
        funderReqs.push("🎯 FCDO: SRMR compliance + Safeguarding Policy");
    if (text.match(/eutf|eu trust fund/i)) 
        funderReqs.push("🎯 EUTF: Dual signatures for >€50k expenditures");
    if (text.match(/gates foundation|gfo/i)) 
        funderReqs.push("🎯 Gates: GFO reporting templates + gender-disaggregated data");
    
    const funderHTML = funderReqs.length 
        ? `<ul>${funderReqs.map(f => `<li>${f}</li>`).join('')}</ul>`
        : `<p>No funder-specific requirements identified. <em>Always verify donor Standard Provisions.</em></p>`;
    document.getElementById('funder-output').innerHTML = funderHTML;

    // Liabilities
    const liabilities = [];
    if (text.match(/third-party harm|negligence/i)) 
        liabilities.push("🛡️ Recipient liable for staff negligence causing third-party harm");
    if (text.match(/data breach|72h/i)) 
        liabilities.push("🛡️ Mandatory 72h reporting of data breaches (GDPR)");
    if (text.match(/force majeure|unforeseen circumstances/i)) 
        liabilities.push("🛡️ Force majeure: suspension (not termination) allowed");
    if (text.match(/indemnify|hold harmless/i)) 
        liabilities.push("🛡️ Recipient indemnifies funder against claims arising from project activities");
    
    const liabilityHTML = liabilities.length 
        ? `<ul>${liabilities.map(l => `<li>${l}</li>`).join('')}</ul>`
        : `<p>No liability allocation specified. <em>Standard: Recipient bears operational risk.</em></p>`;
    document.getElementById('liability-output').innerHTML = liabilityHTML;
}

// Helper: copy section
function copySection(sectionId) {
    const content = document.getElementById(sectionId).innerText;
    navigator.clipboard.writeText(content).then(() => {
        const btn = event.target.closest('button');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => btn.innerHTML = orig, 1500);
    }).catch(err => {
        alert('Copy failed — select text manually');
    });
}

// Export (mock)
function exportContractSummary() {
    alert("✅ Export summary to DOCX ready!\n\n📌 In real deployment:\n- Generates Word doc with all clauses\n- Includes compliance checklist\n- Syncs deadlines to calendar\n\nWant me to add real DOCX export? Just ask!");
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    switchTab('dashboard');
});