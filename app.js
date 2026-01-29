// Global variables
let contractText = '';
let analysisResults = null;
let contractMetadata = {};

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
        
        // Simulate AI analysis (in production, this would call Claude API)
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
    // Simplified analysis - in production, this would use Claude API
    const questionLower = item.question.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Simple keyword matching for demonstration
    let status = 'unclear';
    let confidence = 'medium';
    let finding = '';
    let flagType = null;
    
    // Check for key terms in the question
    const keywords = extractKeywords(item.question);
    const foundKeywords = keywords.filter(kw => textLower.includes(kw.toLowerCase()));
    
    if (foundKeywords.length > keywords.length * 0.6) {
        status = 'detected';
        confidence = 'high';
        finding = `Found relevant content mentioning: ${foundKeywords.slice(0, 3).join(', ')}`;
    } else if (foundKeywords.length > 0) {
        status = 'unclear';
        confidence = 'medium';
        finding = `Partial match found for: ${foundKeywords.join(', ')}. Manual review recommended.`;
        flagType = 'orange';
    } else {
        status = 'not-detected';
        confidence = 'low';
        finding = 'No clear evidence found in the contract text. Manual verification required.';
        if (item.escalation) {
            flagType = 'red';
        } else {
            flagType = 'orange';
        }
    }
    
    return {
        status,
        confidence,
        finding,
        flagType
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
    const detected = analysisResults.filter(r => r.status === 'detected').length;
    const redFlags = analysisResults.filter(r => r.flagType === 'red').length;
    const orangeFlags = analysisResults.filter(r => r.flagType === 'orange').length;
    const unclear = analysisResults.filter(r => r.status === 'unclear').length;
    
    const summaryHtml = `
        <h3 style="color: #667eea; margin-bottom: 10px;">📊 Analysis Summary</h3>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-number green-flag">${detected}</div>
                <div class="summary-label">Requirements Met</div>
            </div>
            <div class="summary-card">
                <div class="summary-number red-flag">${redFlags}</div>
                <div class="summary-label">Red Flags</div>
            </div>
            <div class="summary-card">
                <div class="summary-number orange-flag">${orangeFlags}</div>
                <div class="summary-label">Orange Flags</div>
            </div>
            <div class="summary-card">
                <div class="summary-number">${unclear}</div>
                <div class="summary-label">Needs Review</div>
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
        const categoryFlags = items.filter(i => i.flagType).length;
        
        html += `
            <div class="category-section">
                <div class="category-header">
                    <span>${category}</span>
                    <span class="category-badge">${items.length} items</span>
                </div>
                <div class="checklist-items">
        `;
        
        items.forEach(item => {
            const statusClass = `status-${item.status}`;
            const statusText = item.status.replace('-', ' ').toUpperCase();
            
            html += `
                <div class="checklist-item">
                    <div class="item-question">
                        ${item.question}
                        ${item.flagType ? `<span class="flag-badge flag-${item.flagType}">${item.flagType.toUpperCase()} FLAG</span>` : ''}
                    </div>
                    <div class="item-status ${statusClass}">${statusText}</div>
                    ${item.finding ? `<div class="item-details"><strong>Finding:</strong> ${item.finding}</div>` : ''}
                    ${item.notes ? `<div class="item-details"><strong>Notes:</strong> ${item.notes}</div>` : ''}
                    ${item.escalation ? `<div class="item-details"><strong>Escalate to:</strong> ${item.escalation}</div>` : ''}
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
    const detected = analysisResults.filter(r => r.status === 'detected').length;
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
Requirements Met: ${detected}/${total}
Red Flags Identified: ${redFlags.length}
Orange Flags Identified: ${orangeFlags.length}

`;

    if (redFlags.length > 0) {
        email += `\n=== RED FLAGS (CRITICAL) ===\n`;
        redFlags.forEach((item, index) => {
            email += `\n${index + 1}. ${item.question}`;
            email += `\n   Category: ${item.category}`;
            email += `\n   Finding: ${item.finding}`;
            if (item.escalation) {
                email += `\n   ACTION REQUIRED: Escalate to ${item.escalation}`;
            }
            email += `\n`;
        });
    }

    if (orangeFlags.length > 0) {
        email += `\n=== ORANGE FLAGS (REQUIRES ATTENTION) ===\n`;
        orangeFlags.forEach((item, index) => {
            email += `\n${index + 1}. ${item.question}`;
            email += `\n   Category: ${item.category}`;
            email += `\n   Finding: ${item.finding}`;
            if (item.escalation) {
                email += `\n   Recommended Escalation: ${item.escalation}`;
            }
            email += `\n`;
        });
    }

    email += `\n=== RECOMMENDATIONS ===\n`;
    if (redFlags.length > 0) {
        email += `- URGENT: ${redFlags.length} critical items require immediate attention and escalation.\n`;
    }
    if (orangeFlags.length > 0) {
        email += `- ${orangeFlags.length} items need manual review and verification.\n`;
    }
    email += `- Detailed analysis is available in the full report.\n`;
    email += `- Please review all flagged items before final contract approval.\n`;

    email += `\n=== NEXT STEPS ===\n`;
    email += `1. Review all red flags and escalate as indicated\n`;
    email += `2. Verify orange flags through manual document review\n`;
    email += `3. Update the contract or obtain necessary waivers\n`;
    email += `4. Document all decisions and approvals\n`;
    email += `5. Proceed with final clearance process\n`;

    email += `\n---\nGenerated by Grant Master Contract Review System\nDate: ${new Date().toLocaleString()}\n`;

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
