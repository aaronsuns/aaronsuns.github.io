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

function renderExperience() {
    const experienceSection = document.querySelector('#experience');
    if (!experienceSection || !cvData.experience) return;
    
    const experienceContainer = experienceSection.querySelector('h2').nextElementSibling || 
                                 document.createElement('div');
    if (!experienceSection.querySelector('h2').nextElementSibling) {
        experienceSection.appendChild(experienceContainer);
    }
    
    experienceContainer.innerHTML = cvData.experience.map(exp => {
        let html = `
                <div class="experience-item">
                    <div class="experience-header">
                        <h3>${escapeHtml(exp.title)}</h3>
                        <span class="company">${escapeHtml(exp.company)}</span>
                        <span class="period">${escapeHtml(exp.period)}</span>
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
        return html;
    }).join('\n                ');
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

