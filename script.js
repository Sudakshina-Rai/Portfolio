const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll(".page-panel")];
const projectList = document.querySelector("#project-list");
const projectDetail = document.querySelector("#project-detail");
const detailContent = document.querySelector("#detail-content");
const backToProjects = document.querySelector("#back-to-projects");

const projects = {
    portfolio: {
        category: "WEB DESIGN / 2026",
        title: "Personal portfolio",
        description: "A personal portfolio designed to introduce me, share what I’m learning, and make it easy to explore my work or get in touch. This is the site you’re looking at now.",
        focus: [
            "Created a responsive layout that adapts from desktop to mobile.",
            "Added keyboard-friendly tab navigation and focused project detail views.",
            "Used a consistent color palette, clear type hierarchy, and custom CSS illustrations."
        ],
        stack: ["HTML5", "CSS3", "JavaScript"]
    },
    goodday: {
        category: "LANDING PAGE CONCEPT / 2026",
        title: "Goodday concept",
        description: "A practice landing-page concept for a fictional feel-good brand. The goal was to create an upbeat first impression using warm color, expressive type, and a layout that stays clear on small screens.",
        focus: [
            "Designed a clear hero area with a direct call to action.",
            "Explored a warm, coordinated color palette and simple visual composition.",
            "Practiced responsive layout techniques with CSS Flexbox."
        ],
        stack: ["HTML5", "CSS3", "Flexbox"]
    }
};

function showTab(tabName, updateHistory = true) {
    const selectedTab = tabs.find((tab) => tab.dataset.tab === tabName);
    if (!selectedTab) return;

    tabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.classList.toggle("is-active", isSelected);
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
        panel.hidden = panel.id !== `panel-${tabName}`;
    });

    if (tabName === "projects") showProjectList();
    if (updateHistory) history.replaceState(null, "", `#${tabName}`);
}

function showProjectList() {
    projectDetail.hidden = true;
    projectList.hidden = false;
}

function showProject(projectName) {
    const project = projects[projectName];
    if (!project) return;

    detailContent.innerHTML = `
        <p class="eyebrow"><span class="section-index">${project.category}</span></p>
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <h3>What I focused on</h3>
        <ul>${project.focus.map((item) => `<li>${item}</li>`).join("")}</ul>
        <div class="detail-tags" aria-label="Technologies used">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
    `;
    projectList.hidden = true;
    projectDetail.hidden = false;
    backToProjects.focus();
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
        const currentIndex = tabs.indexOf(tab);
        let nextIndex;

        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;

        if (nextIndex !== undefined) {
            event.preventDefault();
            tabs[nextIndex].focus();
            showTab(tabs[nextIndex].dataset.tab);
        }
    });
});

document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.go));
});

document.querySelectorAll("[data-tab-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        showTab(link.dataset.tabLink);
        document.querySelector("#panel-home").focus();
    });
});

document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.project));
});

backToProjects.addEventListener("click", () => {
    showProjectList();
    document.querySelector('[data-project="portfolio"]').focus();
});

const initialTab = window.location.hash.slice(1);
showTab(tabs.some((tab) => tab.dataset.tab === initialTab) ? initialTab : "home", false);

window.addEventListener("hashchange", () => {
    const requestedTab = window.location.hash.slice(1);
    if (tabs.some((tab) => tab.dataset.tab === requestedTab)) showTab(requestedTab, false);
});
