/**
 * tab.js
 * Peformance Workbench - shared Explainer/ Interactive/ Reference tab control.
 */
function initTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.tab;

            buttons.forEach(b => {
                b.classList.toggle("is-active", b === button);
                b.setAttribute("aria-selected", String(b === button));
            });

            panels.forEach(panel => {
                panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
            });
        });
    });
}

initTabs();