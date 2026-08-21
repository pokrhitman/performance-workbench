/**
 * tab.js
 * Peformance Workbench - shared Explainer/ Interactive/ Reference tab control.
 * 
 * Implements the WAI-ARIA APG "tabs" pattern on top of the static
 * role="tablist" / role="tab" markup already on each topic page:
 * -clicking or arrow-keying between tabs updates aria-selected and a
 *  roving tabindex (only the active tab button is in the Tab order),
 * - the matching tab-panel (role="tabpanel", linked via aria-labelledby)
 *  is shown and everything else stays hidden,
 * - Left/Right move to the adjacent tab (wrapping), Home/End jump to
 *  the first/last tab.
 */
function initTabs() {
    const buttons = Array.from(document.querySelectorAll(".tab-btn"));
    const panels = document.querySelectorAll(".tab-panel");

    function activateTab(button) {
        const target = button.dataset.tab;

        buttons.forEach(b => {
            const isActive = b === button;
            b.classList.toggle("is-active", isActive);
            b.setAttribute("aria-selected", String(isActive));
            b.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        panels.forEach(panel => {
            panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
        });
    }
    
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            activateTab(button);
        });

        button.addEventListener("keydown", (event) => {
            let targetIndex = null;

            if (event.key === "ArrowRight") {
                targetIndex = (index + 1) % buttons.length;
            } else if (event.key === "ArrowLeft") {
                targetIndex = (index -1 + buttons.length) % buttons.length;
            } else if (event.key === "Home") {
                targetIndex = 0;
            } else if (event.key === "End") {
                targetIndex = buttons.length -1;
            }

            if (targetIndex !==null) {
                event.preventDefault();
                const targetButton = buttons[targetIndex];
                activateTab(targetButton);
                targetButton.focus();
            }
        });
    });
}

initTabs();