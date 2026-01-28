// PDF CV Data Renderer
// This file renders the CV content from data.json in a compact PDF-optimized format

let cvData = {};

// Load and render CV data
async function loadCVData() {
    try {
        // Check for query parameter to load different CV versions
        const urlParams = new URLSearchParams(window.location.search);
        const cvVersion = urlParams.get('cv') || 'default';
        
        let dataFile = 'data.json';
        if (cvVersion === 'alt') {
            dataFile = 'data-alt.json';
        }
        
        console.log('Loading CV data from:', dataFile);
        const response = await fetch(dataFile);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${dataFile}: ${response.status} ${response.statusText}`);
        }
        
        cvData = await response.json();
        console.log('CV data loaded successfully', cvData);
        renderCV();
    } catch (error) {
        console.error('Error loading CV data:', error);
        // Show error message on page
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'padding: 20px; background: #fee; color: #c00; border: 2px solid #c00; margin: 20px;';
        errorMsg.innerHTML = `<strong>Error loading CV data:</strong><br>${error.message}<br><br>Make sure you're viewing this page through a web server (not file://).`;
        document.body.insertBefore(errorMsg, document.body.firstChild);
    }
}

function renderCV() {
    console.log('Rendering CV...', cvData);
    renderHeader();
    renderAbout();
    renderExperience();
    renderProjects();
    renderSkills();
    renderEducation();
    renderHonors();
    console.log('CV rendering complete');
}

function renderHeader() {
    const profile = cvData.profile;
    const contact = cvData.contact;
    if (!profile) return;

    // Update name and title
    const nameEl = document.getElementById('name');
    const titleEl = document.getElementById('title');
    const contactHeaderEl = document.getElementById('contactHeader');
    
    if (nameEl && profile.name) nameEl.textContent = profile.name;
    if (titleEl && profile.title) titleEl.textContent = profile.title;
    
    // Render contact info in header
    if (contactHeaderEl && contact) {
        let html = '';
        if (contact.email) {
            html += `<p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>`;
        }
        if (contact.phone) {
            html += `<p><strong>Phone:</strong> ${escapeHtml(contact.phone)}</p>`;
        }
        if (contact.location) {
            html += `<p><strong>Location:</strong> ${escapeHtml(contact.location)}</p>`;
        }
        if (contact.linkedin) {
            html += `<p><strong>LinkedIn:</strong> <a href="${escapeHtml(contact.linkedin)}" target="_blank">linkedin.com/in/aaron-yingcai-sun-6658b83</a></p>`;
        }
        if (contact.website) {
            html += `<p><strong>Website:</strong> <a href="${escapeHtml(contact.website)}" target="_blank">${escapeHtml(contact.website.replace(/^https?:\/\//, ''))}</a></p>`;
        }
        contactHeaderEl.innerHTML = html;
    }
}

function renderAbout() {
    const aboutSection = document.getElementById('aboutContent');
    if (!aboutSection) {
        console.error('About section not found');
        return;
    }
    if (!cvData.about) {
        console.error('About data not found');
        return;
    }
    
    aboutSection.innerHTML = cvData.about.map(para => `<p>${escapeHtml(para)}</p>`).join('\n');
}

// Calculate duration from period string (e.g., "June 2011 - August 2012")
function calculateDuration(period) {
    if (!period || period === 'Present') return null;
    
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
    
    const parseDate = (str) => {
        const parts = str.trim().toLowerCase().split(' ');
        if (parts.length < 2) return null;
        
        const month = monthNames.indexOf(parts[0]);
        const year = parseInt(parts[parts.length - 1]);
        
        if (month === -1 || isNaN(year)) return null;
        return new Date(year, month, 1);
    };
    
    const isPresent = period.toLowerCase().includes('present');
    const parts = period.split(' - ');
    
    if (parts.length !== 2 && !isPresent) return null;
    
    const startStr = parts[0].trim();
    const endStr = isPresent ? 'present' : parts[1].trim();
    
    const startDate = parseDate(startStr);
    if (!startDate) return null;
    
    let endDate;
    if (endStr.toLowerCase() === 'present') {
        endDate = new Date();
    } else {
        endDate = parseDate(endStr);
        if (!endDate) return null;
    }
    
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    
    // Add 1 month to include both start and end months
    let totalMonths = years * 12 + months + 1;
    if (totalMonths < 0) totalMonths = 0;
    
    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    
    if (yrs === 0 && mos === 0) return 'Less than 1 mo';
    if (yrs === 0) return `${mos} ${mos === 1 ? 'mo' : 'mos'}`;
    if (mos === 0) return `${yrs} ${yrs === 1 ? 'yr' : 'yrs'}`;
    return `${yrs} ${yrs === 1 ? 'yr' : 'yrs'} ${mos} ${mos === 1 ? 'mo' : 'mos'}`;
}

function renderExperience() {
    const experienceSection = document.getElementById('experienceContent');
    if (!experienceSection) {
        console.error('Experience section not found');
        return;
    }
    if (!cvData.experience) {
        console.error('Experience data not found');
        return;
    }
    
    // Group experiences by company
    const grouped = {};
    cvData.experience.forEach(exp => {
        if (!grouped[exp.company]) {
            grouped[exp.company] = [];
        }
        grouped[exp.company].push(exp);
    });
    
    // Helper function to parse date from period string
    const parseDateFromPeriod = (str) => {
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                           'july', 'august', 'september', 'october', 'november', 'december'];
        const parts = str.trim().toLowerCase().split(' ');
        if (parts.length < 2) return null;
        const month = monthNames.indexOf(parts[0]);
        const year = parseInt(parts[parts.length - 1]);
        if (month === -1 || isNaN(year)) return null;
        return new Date(year, month, 1);
    };
    
    // Calculate total duration for each company
    const companyTotals = {};
    Object.keys(grouped).forEach(company => {
        const positions = grouped[company];
        if (positions.length === 1) {
            companyTotals[company] = null;
        } else {
            // Find earliest start and latest end
            let earliestStart = null;
            let latestEnd = null;
            let hasPresent = false;
            
            positions.forEach(pos => {
                const period = pos.period;
                const isPresent = period.toLowerCase().includes('present');
                const parts = period.split(' - ');
                
                if (parts.length >= 1) {
                    const startStr = parts[0].trim();
                    const startDate = parseDateFromPeriod(startStr);
                    if (startDate && (!earliestStart || startDate < earliestStart)) {
                        earliestStart = startDate;
                    }
                    
                    if (isPresent) {
                        hasPresent = true;
                        latestEnd = new Date();
                    } else if (parts.length >= 2) {
                        const endStr = parts[1].trim();
                        const endDate = parseDateFromPeriod(endStr);
                        if (endDate && (!latestEnd || endDate > latestEnd)) {
                            latestEnd = endDate;
                        }
                    }
                }
            });
            
            if (earliestStart && latestEnd) {
                const years = latestEnd.getFullYear() - earliestStart.getFullYear();
                const months = latestEnd.getMonth() - earliestStart.getMonth();
                let totalMonths = years * 12 + months;
                if (totalMonths < 0) totalMonths = 0;
                
                const yrs = Math.floor(totalMonths / 12);
                const mos = totalMonths % 12;
                
                if (yrs === 0 && mos === 0) {
                    companyTotals[company] = 'Less than 1 mo';
                } else if (yrs === 0) {
                    companyTotals[company] = `${mos} ${mos === 1 ? 'mo' : 'mos'}`;
                } else if (mos === 0) {
                    companyTotals[company] = `${yrs} ${yrs === 1 ? 'yr' : 'yrs'}`;
                } else {
                    companyTotals[company] = `${yrs} ${yrs === 1 ? 'yr' : 'yrs'} ${mos} ${mos === 1 ? 'mo' : 'mos'}`;
                }
            }
        }
    });
    
    // Render grouped experiences
    let html = '';
    Object.keys(grouped).forEach(company => {
        const positions = grouped[company];
        const totalDuration = companyTotals[company];
        
        // Get company URL from first position
        const companyUrl = positions[0].companyUrl;
        
        if (positions.length > 1) {
            // Group header
            const companyDisplay = companyUrl 
                ? `<a href="${escapeHtml(companyUrl)}" target="_blank" rel="noopener noreferrer" class="company-name">${escapeHtml(company)}</a>`
                : `<span class="company-name">${escapeHtml(company)}</span>`;
            
            html += `
                <div class="experience-group">
                    <div class="company-header">
                        ${companyDisplay}
                        ${totalDuration ? `<span class="company-duration">${totalDuration}</span>` : ''}
                    </div>`;
        }
        
        // Render each position
        positions.forEach(exp => {
            const duration = calculateDuration(exp.period);
            const periodDisplay = duration ? `${escapeHtml(exp.period)} · ${duration}` : escapeHtml(exp.period);
            
            const companyDisplay = positions.length === 1 
                ? (exp.companyUrl 
                    ? `<a href="${escapeHtml(exp.companyUrl)}" target="_blank" rel="noopener noreferrer" class="company">${escapeHtml(exp.company)}</a>`
                    : `<span class="company">${escapeHtml(exp.company)}</span>`)
                : '';
            
            html += `
                <div class="experience-item">
                    <div class="experience-header">
                        <h3>${escapeHtml(exp.title)}</h3>
                        ${companyDisplay}
                        <span class="period">${periodDisplay}</span>
                    </div>
                    <p class="location-text">${escapeHtml(exp.location)}</p>
                    <div class="experience-content">`;
            
            if (exp.description) {
                html += `<p>${escapeHtml(exp.description)}</p>`;
            }
            
            if (exp.bullets && exp.bullets.length > 0) {
                html += `<ul>`;
                exp.bullets.forEach(bullet => {
                    html += `<li>${escapeHtml(bullet)}</li>`;
                });
                html += `</ul>`;
            }
            
            if (exp.technologies) {
                html += `<p class="tech-stack"><strong>Technologies:</strong> ${escapeHtml(exp.technologies)}</p>`;
            }
            
            html += `
                    </div>
                </div>`;
        });
        
        if (positions.length > 1) {
            html += `</div>`;
        }
    });
    
    experienceSection.innerHTML = html;
}

function renderProjects() {
    const projectsSection = document.getElementById('projectsContent');
    if (!projectsSection) {
        console.error('Projects section not found');
        return;
    }
    if (!cvData.projects) {
        console.error('Projects data not found');
        return;
    }
    
    projectsSection.innerHTML = cvData.projects.map(project => {
        let html = `
                <div class="project-item">
                    <div class="project-header">
                        <h3>${escapeHtml(project.title)}</h3>
                        <span class="project-period">${escapeHtml(project.period)}</span>
                    </div>
                    <div class="project-content">`;
        
        const descriptions = Array.isArray(project.description) ? project.description : [project.description];
        descriptions.forEach(desc => {
            html += `<p>${escapeHtml(desc)}</p>`;
        });
        
        if (project.technologies) {
            html += `<p class="tech-stack"><strong>Technologies:</strong> ${escapeHtml(project.technologies)}</p>`;
        }
        
        html += `
                    </div>
                </div>`;
        return html;
    }).join('\n');
}

function renderSkills() {
    const skillsSection = document.getElementById('skillsContent');
    if (!skillsSection) {
        console.error('Skills section not found');
        return;
    }
    if (!cvData.skills) {
        console.error('Skills data not found');
        return;
    }
    
    skillsSection.innerHTML = `
        <div class="skills-grid">
            ${cvData.skills.map(skill => `
                <div class="skill-category">
                    <h3>${escapeHtml(skill.category)}</h3>
                    <p>${escapeHtml(skill.items)}</p>
                </div>`).join('\n')}
        </div>`;
}

function renderEducation() {
    const educationSection = document.getElementById('educationContent');
    if (!educationSection) {
        console.error('Education section not found');
        return;
    }
    if (!cvData.education) {
        console.error('Education data not found');
        return;
    }
    
    educationSection.innerHTML = cvData.education.map(edu => `
                <div class="education-item">
                    <h3>${escapeHtml(edu.degree)}</h3>
                    <p class="school">${escapeHtml(edu.school)}</p>
                    <p class="period">${escapeHtml(edu.period)}</p>
                </div>`).join('\n');
}

function renderHonors() {
    const honorsSection = document.getElementById('honorsContent');
    if (!honorsSection) {
        console.error('Honors section not found');
        return;
    }
    if (!cvData.honors) {
        console.error('Honors data not found');
        return;
    }
    
    honorsSection.innerHTML = cvData.honors.map(honor => {
        let html = `
                <div class="honor-item">
                    <h3>${escapeHtml(honor.title)}</h3>
                    <p class="honor-details">Issued by ${escapeHtml(honor.issuer)} · ${escapeHtml(honor.date)}</p>`;
        
        if (honor.associatedWith) {
            html += `<p class="honor-association">Associated with ${escapeHtml(honor.associatedWith)}</p>`;
        }
        
        if (honor.description) {
            html += `<p class="honor-description">${escapeHtml(honor.description)}</p>`;
        }
        
        html += `</div>`;
        return html;
    }).join('\n');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCVData);
} else {
    loadCVData();
}
