// Global variables
let contractText = '';
let analysisResults = null;
let contractMetadata = {};

// RED FLAG AND ORANGE FLAG DEFINITIONS
const FLAG_DEFINITIONS = {
    // RED FLAGS (CRITICAL - MUST BE ADDRESSED)
    redFlags: [
        {
            keyword: 'immunities',
            question: 'immunity',
            description: 'Clauses touching on Alliance\'s immunity',
            standard: 'No provision contained in this Agreement shall be considered a waiver, express or implied of any of the privileges and immunities granted to Bioversity International/CIAT',
            reason: 'Waiving immunity is a departure from our core identity as a PIO. Not acceptable.'
        },
        {
            keyword: 'indemnity',
            question: 'indemnity provisions',
            description: 'Indemnity provisions must follow Alliance standard',
            standard: 'Each Party shall be responsible for its own staff and indemnify the other Party against Claims arising from willful misconduct and/or negligent default. No Party shall be responsible for indirect or consequential loss.',
            reason: 'Non-standard indemnity clauses expose the Alliance to unacceptable liability.'
        },
        {
            keyword: 'liquidated damages',
            question: 'liquidated damages or penalties',
            description: 'Presence of liquidated damages or penalties clause',
            standard: 'No liquidated damages or penalties clauses should be present',
            reason: 'Liquidated damages and penalties are not acceptable.'
        },
        {
            keyword: 'donor policies',
            question: 'donor\'s internal policies',
            description: 'Agreement requires Alliance to adopt donor\'s internal policies',
            standard: 'Alliance should not be required to adopt donor\'s ethics, code of conduct, safeguarding or other internal policies that conflict with Alliance policies',
            reason: 'Imposing external policies undermines institutional autonomy and can create regulatory conflicts and compliance risks.'
        },
        {
            keyword: 'professional indemnity insurance',
            question: 'professional indemnity/liability insurance',
            description: 'Requirement for professional indemnity/liability insurance or adding funder as additional insured',
            standard: 'No professional indemnity insurance requirements. No adding funder as additional insured or waiver of subrogation rights.',
            reason: 'These are policies we cannot obtain and represent overreach by the funder.'
        }
    ],
    
    // ORANGE FLAGS (REQUIRES ATTENTION AND CASE-BY-CASE REVIEW)
    orangeFlags: [
        {
            keyword: 'applicable law',
            question: 'applicable law',
            description: 'Applicable law should be neutral international law',
            standard: 'Preference: UNIDROIT Principles. If local law required, assess case-by-case prioritizing countries with HCAs and project execution location.',
            reason: 'Local law must be assessed by legal office on case-by-case basis.'
        },
        {
            keyword: 'arbitration',
            question: 'arbitration',
            description: 'Arbitration clause should allow three-person arbitration',
            standard: 'First preference: UNCITRAL Arbitration Rules. Alternative: ICC Rules with three arbitrators. Governing law: General Principles of Law including UNIDROIT principles.',
            reason: 'Flexible arbitration rules protect Alliance interests. Deviations analyzed case-by-case.'
        },
        {
            keyword: 'intellectual property',
            question: 'intellectual property',
            description: 'IP provisions must protect background intellectual property',
            standard: 'Each party remains sole owner of background IP. Both parties make reasonable efforts to ensure public recognition of authors and joint institutional support.',
            reason: 'Non-standard IP clauses may compromise Alliance\'s research and innovation rights.'
        },
        {
            keyword: 'confidential information',
            question: 'confidential information',
            description: 'Confidentiality provisions must follow Alliance standard',
            standard: 'Standard confidentiality clause with exceptions for: public knowledge, lawful third-party disclosure, independently developed information.',
            reason: 'Non-standard confidentiality can restrict legitimate information sharing and research collaboration.'
        },
        {
            keyword: 'insurance',
            question: 'insurance provisions',
            description: 'Insurance requirements must be reasonable and funded by project',
            standard: 'Acceptable if: (1) costs covered by project funds, (2) restricted to nature of work, (3) specified in project scope. General provisions must include qualifier language.',
            reason: 'Unreasonable insurance requirements or unfunded mandates are not acceptable. Colombian contracts cannot charge insurance to project.'
        }
    ]
};

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    const uploadSection = document.getElementById('uploadSection');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadSection.addEventListener('click', function(e) {
        if (e.target !== fileInput && !e.target.classList.contains('btn')) {
            fileInput.click();
        }
    });

    // File selection
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadSection.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadSection.classList.add('dragover');
    });

    uploadSection.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadSection.classList.remove('dragover');
    });

    uploadSection.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadSection.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
});

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

async function handleFile(file) {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (!['pdf', 'txt', 'docx'].includes(fileExtension)) {
        alert('Please upload a PDF, TXT, or DOCX file.');
        return;
    }

    // Show loading
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('loading').classList.add('active');
    updateProgress(10, 'Reading file...');

    try {
        // Read file
        const text = await readFile(file, fileExtension);
        contractText = text;
        
        updateProgress(30, 'Analyzing contract with AI...');
        
        // Analyze contract
        await analyzeContract(text);
        
        updateProgress(90, 'Generating report...');
        
        // Display results
        displayResults();
        
        updateProgress(100, 'Complete!');
        
        // Hide loading, show results
        setTimeout(() => {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('analysisSection').classList.add('active');
        }, 500);
        
    } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please try again.');
        resetApp();
    }
}

async function readFile(file, extension) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (extension === 'txt') {
                resolve(e.target.result);
            } else {
                // For PDF and DOCX, we'd need additional libraries
                // For demo purposes, we'll simulate with sample text
                resolve(`[Contract Document: ${file.name}]\n\nThis is a simulated contract text for demonstration purposes. In a production environment, this would contain the actual extracted text from PDF or DOCX files using libraries like pdf.js or mammoth.js.\n\nGrant Agreement between [Donor Name] and Organization...\n\nThe analysis will proceed based on the checklist criteria.`);
            }
        };
        
        reader.onerror = reject;
        
        if (extension === 'txt') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
}

async function analyzeContract(text) {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract basic metadata (simplified for demo)
    contractMetadata = {
        donor: extractField(text, 'donor', 'Not specified'),
        projectTitle: extractField(text, 'project', 'Not specified'),
        grantAmount: extractField(text, 'amount|budget', 'Not specified'),
        startDate: extractField(text, 'start date|effective date', 'Not specified'),
        endDate: extractField(text, 'end date|expiration', 'Not specified'),
        duration: 'Not specified'
    };
    
    // Analyze each checklist item
    analysisResults = CHECKLIST_DATA.map(item => {
        const analysis = analyzeChecklistItem(item, text);
        return {
            ...item,
            ...analysis
        };
    });
}

function extractField(text, pattern, defaultValue) {
    const regex = new RegExp(`(${pattern})\\s*:?\\s*([^\\n.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[2].trim() : defaultValue;
}

function analyzeChecklistItem(item, text) {
    const questionLower = item.question.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Check for RED FLAGS first
    let flagType = null;
    let flagReason = '';
    
    for (const redFlag of FLAG_DEFINITIONS.redFlags) {
        if (questionLower.includes(redFlag.question.toLowerCase()) || 
            questionLower.includes(redFlag.keyword.toLowerCase())) {
            
            // Check if the concerning term is in the contract
            const concerningTerms = [
                redFlag.keyword.toLowerCase(),
                ...redFlag.description.toLowerCase().split(' ').filter(w => w.length > 4)
            ];
            
            const foundConcerningTerms = concerningTerms.filter(term => 
                textLower.includes(term)
            );
            
            if (foundConcerningTerms.length > 0) {
                flagType = 'red';
                flagReason = redFlag.reason;
                
                return {
                    status: 'not-detected',
                    confidence: 'high',
                    finding: `🚨 RED FLAG: ${redFlag.description}. ${redFlag.reason}`,
                    flagType: 'red',
                    flagReason: flagReason,
                    standard: redFlag.standard
                };
            }
        }
    }
    
    // Check for ORANGE FLAGS
    for (const orangeFlag of FLAG_DEFINITIONS.orangeFlags) {
        if (questionLower.includes(orangeFlag.question.toLowerCase()) || 
            questionLower.includes(orangeFlag.keyword.toLowerCase())) {
            
            // Check if standard language is present
            const standardTerms = orangeFlag.standard.toLowerCase().split(' ')
                .filter(w => w.length > 5)
                .slice(0, 5);
            
            const foundStandardTerms = standardTerms.filter(term => 
                textLower.includes(term)
            );
            
            if (foundStandardTerms.length < standardTerms.length * 0.5) {
                flagType = 'orange';
                flagReason = orangeFlag.reason;
                
                return {
                    status: 'unclear',
                    confidence: 'medium',
                    finding: `⚠️ ORANGE FLAG: ${orangeFlag.description}. ${orangeFlag.reason}`,
                    flagType: 'orange',
                    flagReason: flagReason,
                    standard: orangeFlag.standard
                };
            } else {
                return {
                    status: 'detected',
                    confidence: 'high',
                    finding: `✓ Standard language detected for ${orangeFlag.description}.`,
                    flagType: null,
                    standard: orangeFlag.standard
                };
            }
        }
    }
    
    // INFORMATIONAL ANALYSIS for all other items (no flags, just report what's found)
    const keywords = extractKeywords(item.question);
    const foundKeywords = keywords.filter(kw => textLower.includes(kw.toLowerCase()));
    
    let status, confidence, finding;
    
    if (foundKeywords.length > keywords.length * 0.6) {
        status = 'detected';
        confidence = 'high';
        finding = `✓ Information found: Contract contains references to ${foundKeywords.slice(0, 3).join(', ')}. Please review for completeness.`;
    } else if (foundKeywords.length > 0) {
        status = 'partial';
        confidence = 'medium';
        finding = `ℹ️ Partial information found: Some references to ${foundKeywords.join(', ')}. Manual review recommended to verify completeness.`;
    } else {
        status = 'not-found';
        confidence: 'low';
        finding = `ℹ️ No clear information found in contract text regarding this requirement. Please verify manually.`;
    }
    
    // For informational items, we don't set flags - just inform the user
    return {
        status,
        confidence,
        finding,
        flagType: null,  // No flags for informational items
        flagReason: '',
        isInformational: true  // Mark as informational
    };
}

function extractKeywords(question) {
    // Remove common words and extract meaningful terms
    const commonWords = ['is', 'the', 'are', 'does', 'do', 'has', 'have', 'in', 'to', 'a', 'an', 'and', 'or', 'of', 'for', 'with', 'any', 'all'];
    const words = question.toLowerCase()
        .replace(/[?.,]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
    
    return [...new Set(words)].slice(0, 5);
}

function displayResults() {
    // Display contract info
    displayContractInfo();
    
    // Display summary
    displaySummary();
    
    // Display detailed results by category
    displayDetailedResults();
    
    // Generate email report
    generateEmailReport();
}

function displayContractInfo() {
    const infoHtml = `
        <h3>📑 Contract Information</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Donor</span>
                <span class="info-value">${contractMetadata.donor}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Project Title</span>
                <span class="info-value">${contractMetadata.projectTitle}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Grant Amount</span>
                <span class="info-value">${contractMetadata.grantAmount}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Start Date</span>
                <span class="info-value">${contractMetadata.startDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">End Date</span>
                <span class="info-value">${contractMetadata.endDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Duration</span>
                <span class="info-value">${contractMetadata.duration}</span>
            </div>
        </div>
    `;
    
    document.getElementById('contractInfo').innerHTML = infoHtml;
}

function displaySummary() {
    const totalItems = analysisResults.length;
    const redFlags = analysisResults.filter(r => r.flagType === 'red').length;
    const orangeFlags = analysisResults.filter(r => r.flagType === 'orange').length;
    const informationalFound = analysisResults.filter(r => r.isInformational && r.status === 'detected').length;
    const informationalPartial = analysisResults.filter(r => r.isInformational && r.status === 'partial').length;
    const informationalMissing = analysisResults.filter(r => r.isInformational && r.status === 'not-found').length;
    
    const summaryHtml = `
        <h3 style="color: #667eea; margin-bottom: 10px;">📊 Analysis Summary</h3>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-number red-flag">${redFlags}</div>
                <div class="summary-label">Red Flags (Critical)</div>
            </div>
            <div class="summary-card">
                <div class="summary-number orange-flag">${orangeFlags}</div>
                <div class="summary-label">Orange Flags (Review)</div>
            </div>
            <div class="summary-card">
                <div class="summary-number green-flag">${informationalFound}</div>
                <div class="summary-label">Information Found</div>
            </div>
            <div class="summary-card">
                <div class="summary-number" style="color: #6c757d;">${informationalPartial + informationalMissing}</div>
                <div class="summary-label">Needs Verification</div>
            </div>
        </div>
    `;
    
    document.getElementById('summarySection').innerHTML = summaryHtml;
}

function displayDetailedResults() {
    // Group by category
    const categories = [...new Set(analysisResults.map(r => r.category))];
    
    let html = '<h3 style="color: #667eea; margin-bottom: 20px;">🔍 Detailed Analysis</h3>';
    
    categories.forEach(category => {
        if (!category) return;
        
        const items = analysisResults.filter(r => r.category === category);
        const categoryRedFlags = items.filter(i => i.flagType === 'red').length;
        const categoryOrangeFlags = items.filter(i => i.flagType === 'orange').length;
        
        let categoryBadge = `${items.length} items`;
        if (categoryRedFlags > 0) {
            categoryBadge += ` • ${categoryRedFlags} 🚨`;
        }
        if (categoryOrangeFlags > 0) {
            categoryBadge += ` • ${categoryOrangeFlags} ⚠️`;
        }
        
        html += `
            <div class="category-section">
                <div class="category-header">
                    <span>${category}</span>
                    <span class="category-badge">${categoryBadge}</span>
                </div>
                <div class="checklist-items">
        `;
        
        items.forEach(item => {
            // Different styling for informational items vs flagged items
            let statusClass, statusText, statusBadge;
            
            if (item.flagType === 'red') {
                statusClass = 'status-critical';
                statusText = 'CRITICAL ISSUE';
                statusBadge = '<span class="flag-badge flag-red">🚨 RED FLAG - CRITICAL</span>';
            } else if (item.flagType === 'orange') {
                statusClass = 'status-warning';
                statusText = 'NEEDS REVIEW';
                statusBadge = '<span class="flag-badge flag-orange">⚠️ ORANGE FLAG - REVIEW</span>';
            } else if (item.isInformational) {
                // Informational items - just show what was found
                if (item.status === 'detected') {
                    statusClass = 'status-info-found';
                    statusText = 'INFORMATION FOUND';
                    statusBadge = '';
                } else if (item.status === 'partial') {
                    statusClass = 'status-info-partial';
                    statusText = 'PARTIAL INFORMATION';
                    statusBadge = '';
                } else {
                    statusClass = 'status-info-missing';
                    statusText = 'VERIFY MANUALLY';
                    statusBadge = '';
                }
            } else {
                statusClass = `status-${item.status}`;
                statusText = item.status.replace('-', ' ').toUpperCase();
                statusBadge = '';
            }
            
            html += `
                <div class="checklist-item ${item.isInformational ? 'informational-item' : ''}">
                    <div class="item-question">
                        ${item.question}
                        ${statusBadge}
                    </div>
                    <div class="item-status ${statusClass}">${statusText}</div>
                    ${item.finding ? `<div class="item-details"><strong>${item.isInformational ? 'Analysis:' : 'Finding:'}</strong> ${item.finding}</div>` : ''}
                    ${item.standard ? `<div class="item-details"><strong>${item.flagType ? 'Required Standard:' : 'Reference:'}</strong> ${item.standard}</div>` : ''}
                    ${item.notes ? `<div class="item-details"><strong>Notes:</strong> ${item.notes}</div>` : ''}
                    ${item.escalation && item.flagType ? `<div class="item-details"><strong>Escalate to:</strong> ${item.escalation}</div>` : ''}
                    ${item.escalation && !item.flagType ? `<div class="item-details"><strong>Contact for clarification:</strong> ${item.escalation}</div>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    document.getElementById('resultsContainer').innerHTML = html;
}

function generateEmailReport() {
    const redFlags = analysisResults.filter(r => r.flagType === 'red');
    const orangeFlags = analysisResults.filter(r => r.flagType === 'orange');
    const informationalItems = analysisResults.filter(r => r.isInformational);
    const informationalFound = informationalItems.filter(r => r.status === 'detected').length;
    const informationalPartial = informationalItems.filter(r => r.status === 'partial').length;
    const informationalMissing = informationalItems.filter(r => r.status === 'not-found').length;
    const total = analysisResults.length;
    
    let email = `Subject: Grant Contract Review Report - ${contractMetadata.projectTitle || 'Contract Analysis'}

Dear Team,

Please find below the automated contract review analysis for the grant agreement.

=== CONTRACT INFORMATION ===
Donor: ${contractMetadata.donor}
Project Title: ${contractMetadata.projectTitle}
Grant Amount: ${contractMetadata.grantAmount}
Period: ${contractMetadata.startDate} to ${contractMetadata.endDate}

=== SUMMARY ===
Total Checklist Items Reviewed: ${total}
🚨 Red Flags Identified (CRITICAL): ${redFlags.length}
⚠️ Orange Flags Identified (REQUIRES REVIEW): ${orangeFlags.length}
ℹ️ Informational Items: ${informationalItems.length} (${informationalFound} found, ${informationalPartial} partial, ${informationalMissing} needs verification)

`;

    if (redFlags.length > 0) {
        email += `\n=== 🚨 RED FLAGS (CRITICAL - IMMEDIATE ACTION REQUIRED) ===\n`;
        email += `These are deal-breaker issues that compromise Alliance's core principles and must be addressed before signing.\n`;
        redFlags.forEach((item, index) => {
            email += `\n${index + 1}. ${item.question}`;
            email += `\n   Category: ${item.category}`;
            email += `\n   Issue: ${item.flagReason}`;
            email += `\n   Finding: ${item.finding}`;
            if (item.standard) {
                email += `\n   Required Standard: ${item.standard}`;
            }
            if (item.escalation) {
                email += `\n   ⚠️ MANDATORY ESCALATION: ${item.escalation}`;
            }
            email += `\n   STATUS: MUST BE RESOLVED BEFORE CONTRACT APPROVAL`;
            email += `\n`;
        });
    }

    if (orangeFlags.length > 0) {
        email += `\n=== ⚠️ ORANGE FLAGS (REQUIRES CASE-BY-CASE REVIEW) ===\n`;
        email += `These items require legal review and may need negotiation or case-by-case approval.\n`;
        orangeFlags.forEach((item, index) => {
            email += `\n${index + 1}. ${item.question}`;
            email += `\n   Category: ${item.category}`;
            email += `\n   Concern: ${item.flagReason}`;
            email += `\n   Finding: ${item.finding}`;
            if (item.standard) {
                email += `\n   Recommended Standard: ${item.standard}`;
            }
            if (item.escalation) {
                email += `\n   Recommended Escalation: ${item.escalation}`;
            }
            email += `\n   STATUS: REQUIRES LEGAL REVIEW AND APPROVAL`;
            email += `\n`;
        });
    }

    // Add informational summary (only items needing attention)
    const informationalNeedsAttention = informationalItems.filter(r => 
        r.status === 'partial' || r.status === 'not-found'
    );
    
    if (informationalNeedsAttention.length > 0) {
        email += `\n=== ℹ️ INFORMATIONAL ITEMS REQUIRING MANUAL VERIFICATION ===\n`;
        email += `These items are not red/orange flags but need manual review to ensure completeness.\n`;
        informationalNeedsAttention.forEach((item, index) => {
            email += `\n${index + 1}. ${item.question}`;
            email += `\n   Category: ${item.category}`;
            email += `\n   Status: ${item.finding}`;
            if (item.escalation) {
                email += `\n   Contact for clarification: ${item.escalation}`;
            }
            email += `\n`;
        });
    }

    email += `\n=== FLAG DEFINITIONS ===\n`;
    email += `🚨 RED FLAGS are critical issues that:\n`;
    email += `   - Compromise Alliance's immunity and privileges\n`;
    email += `   - Expose Alliance to unacceptable liability\n`;
    email += `   - Undermine institutional autonomy\n`;
    email += `   - Cannot be accepted under any circumstances\n`;
    email += `   ➜ MUST be removed or contract cannot be signed\n\n`;
    
    email += `⚠️ ORANGE FLAGS are issues that:\n`;
    email += `   - May be acceptable with proper review and approval\n`;
    email += `   - Require case-by-case legal assessment\n`;
    email += `   - Need negotiation or specific justification\n`;
    email += `   ➜ Require legal office review before proceeding\n\n`;
    
    email += `ℹ️ INFORMATIONAL ITEMS are:\n`;
    email += `   - Standard checklist requirements (not flagged as critical)\n`;
    email += `   - Reported as found/partial/missing for your review\n`;
    email += `   - Should be verified manually for completeness\n`;
    email += `   ➜ Part of standard due diligence process\n`;

    email += `\n=== RECOMMENDATIONS ===\n`;
    if (redFlags.length > 0) {
        email += `❌ CRITICAL: ${redFlags.length} RED FLAG(S) DETECTED - CONTRACT CANNOT BE APPROVED IN CURRENT STATE\n`;
        email += `   Action Required: Immediate negotiation with donor to remove/revise flagged clauses\n`;
        email += `   Timeline: Must be resolved before any signature\n\n`;
    }
    if (orangeFlags.length > 0) {
        email += `⚠️ ATTENTION: ${orangeFlags.length} ORANGE FLAG(S) REQUIRE REVIEW\n`;
        email += `   Action Required: Legal office review and case-by-case approval\n`;
        email += `   Timeline: Review before final clearance\n\n`;
    }
    if (informationalNeedsAttention.length > 0) {
        email += `ℹ️ NOTE: ${informationalNeedsAttention.length} informational items need manual verification\n`;
        email += `   Action Required: Standard review of contract completeness\n`;
        email += `   Timeline: Part of normal clearance process\n\n`;
    }
    if (redFlags.length === 0 && orangeFlags.length === 0) {
        email += `✅ No critical flags detected. Proceed with standard review process.\n`;
        email += `   Continue with manual verification of all informational items.\n\n`;
    }

    email += `\n=== NEXT STEPS ===\n`;
    if (redFlags.length > 0) {
        email += `1. 🚨 PRIORITY: Negotiate removal/revision of all RED FLAG clauses\n`;
        email += `2. Escalate to indicated departments immediately\n`;
        email += `3. Do NOT proceed to signature until red flags are resolved\n`;
    }
    if (orangeFlags.length > 0) {
        email += `${redFlags.length > 0 ? '4' : '1'}. Submit orange flag items to Legal Office for review\n`;
        email += `${redFlags.length > 0 ? '5' : '2'}. Obtain case-by-case approvals as needed\n`;
        email += `${redFlags.length > 0 ? '6' : '3'}. Document all waivers and approvals\n`;
    }
    const nextStep = redFlags.length > 0 ? (orangeFlags.length > 0 ? '7' : '4') : (orangeFlags.length > 0 ? '4' : '1');
    email += `${nextStep}. Complete manual verification of all informational checklist items\n`;
    email += `${parseInt(nextStep) + 1}. Review contract completeness with relevant departments\n`;
    email += `${parseInt(nextStep) + 2}. Obtain all required clearances per GMU Manual\n`;
    email += `${parseInt(nextStep) + 3}. Proceed with final approval process\n`;

    email += `\n---\nGenerated by Grant Master Contract Review System\nDate: ${new Date().toLocaleString()}\n`;
    email += `\nIMPORTANT: This is an automated analysis. Final decisions require human review and legal judgment.\n`;

    document.getElementById('emailPreview').textContent = email;
}

function copyEmailReport() {
    const emailText = document.getElementById('emailPreview').textContent;
    
    navigator.clipboard.writeText(emailText).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    });
}

function resetApp() {
    contractText = '';
    analysisResults = null;
    contractMetadata = {};
    
    document.getElementById('fileInput').value = '';
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('analysisSection').classList.remove('active');
    document.getElementById('loading').classList.remove('active');
    
    updateProgress(0, '');
}

function updateProgress(percent, text) {
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = text;
}
