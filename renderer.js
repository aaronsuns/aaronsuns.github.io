// CV Data Renderer
// This file renders the CV content from data.json

let cvData = {};

// Load and render CV data
async function loadCVData() {
    try {
        const response = await fetch('data.json');
        cvData = await response.json();
        renderCV();
    } catch (error) {
        console.error('Error loading CV data:', error);
    }
}

function renderCV() {
    renderProfile();
    renderAbout();
    renderExperience();
    renderProjects();
    renderSkills();
    renderEducation();
    renderContact();
    
    // Trigger animations after content is rendered
    if (window.setupAnimations) {
        setTimeout(window.setupAnimations, 50);
    }
}

function renderProfile() {
    const profile = cvData.profile;
    if (!profile) return;

    // Update header
    document.querySelector('header h1').textContent = profile.name;
    document.querySelector('.subtitle').textContent = profile.title;
    document.querySelector('.location').textContent = profile.location;
    
    // Update social links
    const githubLink = document.querySelector('.social-links a[aria-label="GitHub"]');
    const linkedinLink = document.querySelector('.social-links a[aria-label="LinkedIn"]');
    const emailLink = document.querySelector('.social-links a[aria-label="Email"]');
    
    if (githubLink) githubLink.href = profile.social.github;
    if (linkedinLink) linkedinLink.href = profile.social.linkedin;
    if (emailLink) emailLink.href = profile.social.email;
}

function renderAbout() {
    const aboutSection = document.querySelector('#about .content');
    if (!aboutSection || !cvData.about) return;
    
    aboutSection.innerHTML = cvData.about.map(para => `<p>${para}</p>`).join('\n                    ');
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
    
    let totalMonths = years * 12 + months;
    if (totalMonths < 0) totalMonths = 0;
    
    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    
    if (yrs === 0 && mos === 0) return 'Less than 1 mo';
    if (yrs === 0) return `${mos} ${mos === 1 ? 'mo' : 'mos'}`;
    if (mos === 0) return `${yrs} ${yrs === 1 ? 'yr' : 'yrs'}`;
    return `${yrs} ${yrs === 1 ? 'yr' : 'yrs'} ${mos} ${mos === 1 ? 'mo' : 'mos'}`;
}

function renderExperience() {
    const experienceSection = document.querySelector('#experience');
    if (!experienceSection || !cvData.experience) return;
    
    const experienceContainer = experienceSection.querySelector('h2').nextElementSibling || 
                                 document.createElement('div');
    if (!experienceSection.querySelector('h2').nextElementSibling) {
        experienceSection.appendChild(experienceContainer);
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
            companyTotals[company] = null; // No grouping needed
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
                        latestEnd = new Date(); // Use current date for "Present"
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
        
        // Get company URL from first position (all positions in a group should have same URL)
        const companyUrl = positions[0].companyUrl;
        
        if (positions.length > 1) {
            // Group header
            const companyDisplay = companyUrl 
                ? `<a href="${escapeHtml(companyUrl)}" target="_blank" rel="noopener noreferrer" class="company-link">${escapeHtml(company)}</a>`
                : escapeHtml(company);
            
            html += `
                <div class="experience-group">
                    <div class="company-header">
                        <h3 class="company-name">${companyDisplay}</h3>
                        ${totalDuration ? `<span class="company-duration">${totalDuration}</span>` : ''}
                    </div>`;
        }
        
        // Render each position
        positions.forEach(exp => {
            const duration = calculateDuration(exp.period);
            const periodDisplay = duration ? `${escapeHtml(exp.period)} · ${duration}` : escapeHtml(exp.period);
            
            const companyDisplay = positions.length === 1 
                ? (exp.companyUrl 
                    ? `<a href="${escapeHtml(exp.companyUrl)}" target="_blank" rel="noopener noreferrer" class="company-link">${escapeHtml(exp.company)}</a>`
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
    
    experienceContainer.innerHTML = html;
}

function renderProjects() {
    const projectsSection = document.querySelector('#projects');
    if (!projectsSection || !cvData.projects) return;
    
    const projectsContainer = projectsSection.querySelector('h2').nextElementSibling || 
                             document.createElement('div');
    if (!projectsSection.querySelector('h2').nextElementSibling) {
        projectsSection.appendChild(projectsContainer);
    }
    
    projectsContainer.innerHTML = cvData.projects.map(project => {
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
    }).join('\n                ');
}

function renderSkills() {
    const skillsSection = document.querySelector('#skills .skills-grid');
    if (!skillsSection || !cvData.skills) return;
    
    skillsSection.innerHTML = cvData.skills.map(skill => `
                    <div class="skill-category">
                        <h3>${escapeHtml(skill.category)}</h3>
                        <p>${escapeHtml(skill.items)}</p>
                    </div>`).join('\n                ');
}

function renderEducation() {
    const educationSection = document.querySelector('#education');
    if (!educationSection || !cvData.education) return;
    
    const educationContainer = educationSection.querySelector('h2').nextElementSibling || 
                               document.createElement('div');
    if (!educationSection.querySelector('h2').nextElementSibling) {
        educationSection.appendChild(educationContainer);
    }
    
    educationContainer.innerHTML = cvData.education.map(edu => `
                <div class="education-item">
                    <h3>${escapeHtml(edu.degree)}</h3>
                    <p class="school">${escapeHtml(edu.school)}</p>
                    <p class="period">${escapeHtml(edu.period)}</p>
                </div>`).join('\n            ');
}

function renderContact() {
    const contactSection = document.querySelector('#contact .contact-info');
    if (!contactSection || !cvData.contact) return;
    
    const contact = cvData.contact;
    contactSection.innerHTML = `
                    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>
                    <p><strong>Location:</strong> ${escapeHtml(contact.location)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(contact.phone)}</p>
                    <p><strong>LinkedIn:</strong> <a href="${escapeHtml(contact.linkedin)}" target="_blank" rel="noopener noreferrer">linkedin.com/in/aaron-yingcai-sun-6658b83</a></p>`;
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

