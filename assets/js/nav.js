const SIDEBAR_DATA = [
    {
        tier: "introduction",
        label: "Introduction",
        indexPath: null, // no standalone index page for this tier
        groups: [
            {
                name: null,
                items: [
                    { id: "why-numbers-disagree", label: "Why Numbers Disagree", path: "beginner/introduction/why-numbers-disagree/index.html" },
                    { id: "what-a-return-measure", label: "What a Return Measures", path: "beginner/introduction/what-a-return-measures/index.html" },
                    { id: "method-is-a-choice", label: "Method is a Choice", path: "beginner/introduction/method-is-a-choice/index.html" },                    
                ]            
            }
        ]
    },
    {
        tier: "beginner",
        label: "Beginner",
        indexPath: "beginner/index.html",
        groups: [
            {
                name: "Introduction",
                items: [
                    { id: "why-numbers-disagree", label: "Why Numbers Disagree", path: "beginner/introduction/why-numbers-disagree/index.html" },
                    { id: "what-a-return-measure", label: "What a Return Measures", path: "beginner/introduction/what-a-return-measures/index.html" },
                    { id: "method-is-a-choice", label: "Method is a Choice", path: "beginner/introduction/method-is-a-choice/index.html" },                    
                ]
            },
            {
                name: "Foundations",
                items: [
                    { id: "simple-return", label: "Simple Return", path: "beginner/foundations/simple-return/index.html" },
                    { id: "cash-flow-breaks-simple-return", label: "Cash Flow Breaks Simple Return", path: "beginner/foundations/cash-flow-break-simple-return/index.html" },
                    { id: "compounding-and-linking", label: "Compounding and Linking", path: "beginner/foundations/compounding-and-linking/index.html" },
                    { id: "annualizing", label: "Annualizing", path: "beginner/foundations/annualizing/index.html" },
                    { id: "return-conventions", label: "Return Conventions", path: "beginner/foundations/return-convetions/index.html" },
                ]
            }
        ]
    },
    {
        tier: "intermediate",
        label: "Intermediate",
        indexPath: "intermediate/index.html",
        groups: [
            {
                name: null,
                items: [
                    { id: "time-weighted-returns", label: "Time-Weighted Return", path: "intermediate/time-weighted-return/index.html" },
                    { id: "cash-flow-timing", label: "Cash-Flow Timing", path: "intermediate/cash-flow-timing/index.html" },
                    { id: "money-weighted-return", label: "Money-Weighted Return", path: "intermediate/money-weighted-return/index.html" },
                    { id: "modified-dietz", label: "Modified Dietz", path: "intermediate/modified-dietz/index.html" },
                    { id: "bvi-method", label: "The BVI Method", path: "intermediate/bvi-method/index.html" },
                    { id: "choosing-the-right-lens", label: "Choosing the Right Lens", path: "intermediate/choosing-the-right-lens/index.html" },
                ]
            }
        ]
    },
    {
        tier: "advanced",
        label: "Advanced",
        indexPath: "advanced/index.html",
        groups: [
            {
                name: null, 
                items: [
                    { id: "gross-vs-net", label: "Gross vs. Net", path: "advanced/gross-vs-net/index.html"},
                    { id: "gips-overview", label: "GIPS Overview", path: "advanced/gips-overview/index.html"},
                    { id: "composite-construction", label: "Composite Construction", path: "advanced/composite-construction/index.html"},
                    { id: "benchmark-comparison", label: "Benchmark Comparison", path: "advanced/benchmark-comparison/index.html"},

                ]
            }
        ]
    }
];

/* --- Builds the sidebar content and injects it into #sidebar --- */
function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return; 

    const tree = document.createElement("div");
    tree.className = "sidebar-tree";

    SIDEBAR_DATA.forEach(tier => {
        const tierBlock = document.createElement("div");
        tierBlock.className ="sidebar-tier";

        if (tier.indexPath) {
            const tierLink = document.createElement("a");
            tierLink.className = "sidebar-tier-label";
            tierLink.href = SITE_ROOT +  tier.indexPath;
            tierLink.textContent = tier.label;
            tierBlock.appendChild(tierLink);
        } else {
            const tierHeading = document.createElement("p");
            tierHeading.className = "sidebar-tier-label";
            tierHeading.textContent = tier.label;
            tierBlock.appendChild(tierHeading);
        }

        tier.groups.forEach(group => {
            if (group.name) {
                const groupHeading = document.createElement("p");
                groupHeading.className = "sidebar-group-label";
                groupHeading.textContent = group.name;
                tierBlock.appendChild(groupHeading);
            }

            const list = document.createElement("ul");
            list.className = "sidebar-list";

            group.items.forEach(item => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = SITE_ROOT + item.path;
                a.textContent = item.label;
                if (item.id === CURRENT_PAGE) {
                    a.classList.add("active");
                    a.setAttribute("aria-current", "page");
                }
                li.appendChild(a);
                list.appendChild(li);
            });

            tierBlock.appendChild(list);
        });
        
        tree.appendChild(tierBlock);
    });

    sidebar.appendChild(tree);
}

renderSidebar();
