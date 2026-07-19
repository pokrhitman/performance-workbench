const SIDEBAR_DATA = [
    {
        tier: "beginner",
        label: "Beginner",
        groups: [
            {
                name: "Introduction",
                items: [
                    { id: "why-numbers-disagree", label: "Why Numbers Disagree", path: "beginner/introduction/why-numbers-disagree/index.html", comingSoon: false },
                    { id: "what-a-return-measures", label: "What a Return Measures", path: "beginner/introduction/what-a-return-measures/index.html", comingSoon: false },
                    { id: "method-is-a-choice", label: "Method is a Choice", path: "beginner/introduction/method-is-a-choice/index.html", comingSoon: false  },                    
                ]
            },
            {
                name: "Foundations",
                items: [
                    { id: "simple-return", label: "Simple Return", path: "beginner/foundations/simple-return/index.html", comingSoon: true  },
                    { id: "cash-flows-break-simple-return", label: "Cash Flows Break Simple Return", path: "beginner/foundations/cash-flows-break-simple-return/index.html", comingSoon: true  },
                    { id: "compounding-and-linking", label: "Compounding and Linking", path: "beginner/foundations/compounding-and-linking/index.html", comingSoon: true  },
                    { id: "annualizing", label: "Annualizing", path: "beginner/foundations/annualizing/index.html", comingSoon: true  },
                    { id: "return-conventions", label: "Return Conventions", path: "beginner/foundations/return-convetions/index.html", comingSoon: true  },
                ]
            }
        ]
    },
    {
        tier: "intermediate",
        label: "Intermediate",
        groups: [
            {
                name: null,
                items: [
                    { id: "time-weighted-returns", label: "Time-Weighted Return", path: "intermediate/time-weighted-return/index.html", comingSoon: true  },
                    { id: "cash-flow-timing", label: "Cash-Flow Timing", path: "intermediate/cash-flow-timing/index.html", comingSoon: true  },
                    { id: "money-weighted-return", label: "Money-Weighted Return", path: "intermediate/money-weighted-return/index.html", comingSoon: true  },
                    { id: "modified-dietz", label: "Modified Dietz", path: "intermediate/modified-dietz/index.html", comingSoon: true  },
                    { id: "fund-units-non-etf", label: "Performance for Fund Units (Non-ETF", path: "intermediate/fund-units-non-etf/index.html", comingSoon: true },
                    { id: "fund-units-etf", label:"Performance for Fund Units (ETF)", path: "intermediate/fund-units-etf/index.html", comingSoon: true }, 
                    { id: "choosing-the-right-lens", label: "Choosing the Right Lens", path: "intermediate/choosing-the-right-lens/index.html", comingSoon: true  },
                ]
            }
        ]
    },
    {
        tier: "advanced",
        label: "Advanced",
        groups: [
            {
                name: null, 
                items: [
                    { id: "gross-vs-net", label: "Gross vs. Net", path: "advanced/gross-vs-net/index.html", comingSoon: true },
                    { id: "gips-overview", label: "GIPS Overview", path: "advanced/gips-overview/index.html", comingSoon: true },
                    { id: "composite-construction", label: "Composite Construction", path: "advanced/composite-construction/index.html", comingSoon: true },
                    { id: "benchmark-comparison", label: "Benchmark Comparison", path: "advanced/benchmark-comparison/index.html", comingSoon: true },

                ]
            }
        ]
    }
];

/* --- Returns true if this tier contains the current page, in any of its groups --- */
function tierContainsCurrentPage(tier) {
    return tier.groups.some(group =>
        group.items.some(item => item.id === CURRENT_PAGE)
    );
}

/* --- Builds one item <li>, as a link (built) or plain badge text (coming soon) --- */
function buildItemElement(item) {
    const li = document.createElement("li");

    if (item.comingSoon) {
        li.className = "sidebar-item-pending";

        const span = document.createElement("span");
        span.className = "sidebar-item-label";
        span.textContent = item.label;
        li.appendChild(span);

        const badge = document.createElement("span");
        badge.className = "coming-soon-badge";
        badge.textContent = "Coming soon";
        li.appendChild(badge);
    } else {
        const a = document.createElement("a");
        a.href = SITE_ROOT + item.path;
        a.textContent = item.label;
        if (item.id === CURRENT_PAGE) {
            a.classList.add("active");
            a.setAttribute("aria-current", "page");
        }
        li.appendChild(a);
    }

    return li;
}

/* --- Builds the sidebar content and injects it into #sidebar --- */
function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return; 

    const tree = document.createElement("div");
    tree.className = "sidebar-tree";

    SIDEBAR_DATA.forEach(tier => {
        const tierBlock = document.createElement("div");
        tierBlock.className ="sidebar-tier sidebar-tier--" + tier.tier;

        const isExpanded = tierContainsCurrentPage(tier);
        const bodyId = "sidebar-body-" + tier.tier;

        // --- Header row: label (link or text) + collapse/expand togglet ---
        const header = document.createElement("button");
        header.type = "button";
        header.className = "sidebar-tier-header";
        header.setAttribute("aria-expanded", String(isExpanded));
        header.setAttribute("aria-controls", bodyId);

        const toggleIcon = document.createElement("span");
        toggleIcon.className = "sidebar-tier-toggle";
        toggleIcon.setAttribute("aria-hidden", "true");
        toggleIcon.textContent = isExpanded ? "\u25BE" : "\u25B8";
        header.appendChild(toggleIcon);

        const tierLabel = document.createElement("span");
        tierLabel.className = "sidebar-tier-label";
        tierLabel.textContent = tier.label;
        header.appendChild(tierLabel);

        tierBlock.appendChild(header);

        // --- Body: groups + items, hidden entirely when collapsed ---
        const body = document.createElement("div");
        body.id = bodyId;
        body.className = "sidebar-tier-body";
        if (!isExpanded) {
            body.classList.add("is-collapsed");
        }

        tier.groups.forEach(group => {
            if (group.name) {
                const groupHeading = document.createElement("p");
                groupHeading.className = "sidebar-group-label";
                groupHeading.textContent = group.name;
                body.appendChild(groupHeading);
            }

            const list = document.createElement("ul");
            list.className = "sidebar-list";

            group.items.forEach(item => {
                list.appendChild(buildItemElement(item));
            });

            body.appendChild(list);
        });

        tierBlock.appendChild(body);

        // --- Toggle behavior ---
        header.addEventListener("click", () => {
            const nowCollapsed = body.classList.toggle("is-collapsed");
            header.setAttribute("aria-expanded", String(!nowCollapsed));
            toggleIcon.textContent = nowCollapsed ? "\u25B8" : "\u25BE";
        });
        
        tree.appendChild(tierBlock);
    });

    sidebar.appendChild(tree);
}

/* --- Finds the tier/group/item matching CURRENT_PAGE, for the breadcrumb --- */
function findCurrentPageLocation() {
    for (const tier of SIDEBAR_DATA) {
        for (const group of tier.groups) {
            const item = group.items.find(i => i.id === CURRENT_PAGE);
            if (item) {
                return { tier, group, item };
            }
        }
    }
    return null;
}

/* -- Builds breadcrumb trail and injects it into #breadcrumb --- */
function renderBreadcrumb() {
    const breadcrumb = document.getElementById("breadcrumb");
    if (!breadcrumb) return;

    const location = findCurrentPageLocation();
    if (!location) return;

    const crumbs = [];

    const home = document.createElement("a");
    home.href = SITE_ROOT + "index.html";
    home.textContent = "Home";
    crumbs.push(home);

    const tierText = document.createElement("span");
    tierText.textContent = location.tier.label;
    crumbs.push(tierText);

    if (location.group.name) {
        const groupText = document.createElement("span");
        groupText.textContent = location.group.name;
        crumbs.push(groupText);
    }

    const currentText = document.createElement("span");
    currentText.className = "breadcrumb-current";
    currentText.textContent = location.item.label;
    crumbs.push(currentText);

    crumbs.forEach((crumb, index) => {
        breadcrumb.appendChild(crumb);
        if (index < crumbs.length - 1) {
            const separator = document.createElement("span");
            separator.className = "breadcrumb-separator";
            separator.textContent = "\u203A"; 
            breadcrumb.appendChild(separator);
        }
    });
}

renderSidebar();
renderBreadcrumb();