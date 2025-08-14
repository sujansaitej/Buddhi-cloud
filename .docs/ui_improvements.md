UI/UX Improvement Plan

Principles
- Keep the dashboard’s first section as the quality bar: generous whitespace, restrained gradients, simple iconography, clear copy, and calm motion.
- Prioritize clarity over ornamentation; progressive disclosure for advanced settings; strong keyboard and screen-reader support.
- Unify spacing, typography, colors, cards, and controls across all routes.

System-wide Recommendations
- Typography
  - Use Inter (already present). Set consistent scale: 32/24/20/16/14/12 for h1/h2/h3/body/label/meta.
  - Tighten line-heights: headings 1.2, body 1.55. Limit bold text to headlines and key metrics.
- Spacing
  - Base unit: 4px. Standard paddings: cards 16–24px, sections 24–32px, page gutters 24–32px.
  - Grid gaps: 8/12/16 (sm/md/lg). Keep consistent across pages.
- Color
  - Primary: indigo → purple gradient (current). Neutrals: gray-900/700/600/500/300/200 for text, borders, muted.
  - Status tokens (bg/text/border pairs):
    - success: emerald-100/700; info: blue-100/700; warning: amber-100/700; error: red-100/700.
  - Reduce glass/blur except for subtle page headers. Prefer solid white cards with 1px border and soft shadow.
- Cards
  - Standardize: radius 12–16px, border 1px gray-200, shadow-sm by default; hover: shadow-md; consistent header/body/footer paddings.
  - Title size h3 (20px), optional subtitle in gray-600.
- Controls
  - Buttons: Primary gradient, Secondary neutral, Outline gray, Destructive red. Sizes: sm (28–32px), md (36–40px).
  - Inputs: 40px height, 12px radius, clear focus ring. Avoid global transitions on all elements.
- Motion
  - Remove global “transition: all” and use “transition-[color,opacity,transform]” on interactive elements only.
  - Respect prefers-reduced-motion. Limit background floating blobs and blur to landing/dashboard hero only.
- Accessibility
  - Ensure 4.5:1 contrast minimum for text. Provide aria-labels on icon-only buttons. Preserve focus outlines. Add skip-to-content.
- Density modes
  - Add a UI density toggle (Comfortable/Compact) to list-heavy pages (Tasks, Templates, Wallet, History).

Page-by-page Improvements

Landing (/)
- Simplify background effects: reduce blur intensity and count of gradient blobs to improve performance and readability.
- Shorten hero headline and subhead by ~15–20%; keep one strong CTA and one secondary link.
- Replace the animated feature switcher with tabs or small pills; keep motion duration <300ms.
- Unify card styling in “Product capabilities” and “Use Cases” with the standard card spec.
- Add testimonials avatars or initials consistently; align ratings row; constrain card width and line-length (~60–80 chars).
- Footer: convert icon boxes to links with clear labels; reduce 4-column grid to 3 on md screens for readability.

Dashboard (/dashboard)
- Keep the first hero section as is (reference quality).
- Product overview tiles: reduce hover elevation and animation; ensure icon sizes and label weights match spec.
- “Popular Templates” and “My Workflows/Tasks”
  - Standardize card paddings and footer actions; align badge colors with system tokens.
  - Add skeletons with consistent height; cap title to 2 lines using line-clamp.
  - Replace emoji category icons with lucide icons for consistency.
- Add quick global search input in the header (cmd/ctrl+k) for workflows, tasks, templates.

Workflows (/workflows)
- List view
  - Consolidate search and category filter into a single toolbar row; move secondary filters into a collapsible panel.
  - Normalize badge colors and sizes (status/category). Reduce shadow and saturation on cards.
  - Provide table/list density toggle; add bulk-select for delete.
- Builder view
  - Sticky top bar with: Back, Name (editable), Save (with saved/unsaved state), Execute, and secondary actions.
  - Autosave indicator and keyboard shortcuts (s to save, / to search nodes).
  - Wider canvas area with neutral background; reduce visual noise; ensure consistent empty state for tasks/variables.
- Templates subviews
  - Add preview modal (larger description, steps, estimated time) before “Use template”.

Tasks (/tasks)
- Filters
  - Convert status chips to segmented control; keep advanced filters in a collapsible drawer with clear labels.
  - Add preset ranges (Today/7d/30d) and a consistent date range picker.
- List items
  - Left-aligned status icon with color token; title + status pill; concise meta row (created, finished, output files).
  - Right-aligned actions: Details, Pause/Resume/Stop, Live URL, Download; show only applicable buttons.
- Details panel
  - Inline expandable panel beneath a row is good; add monospace for output, limit height, copy button.
  - Toasts for actions; confirmation dialogs for destructive operations.

Scheduled Tasks (/scheduled-tasks)
- Surface schedule type and cadence with consistent iconography; show “Next run” prominently with timezone.
- Provide bulk actions (activate/deactivate/delete). Add sorting (Next run, Created, Status).
- Edit/create flow: wizard-like steps for schedule, workflow, runtime settings; preview next 5 runs with timezone.

Templates (/templates)
- Toolbar: search field, category/difficulty selects, and Filter button aligned; ensure selects are same height.
- Cards: unify badges (difficulty/category) to tokens; trim gradient usage; cap at 3 tags with “+N” overflow.
- Add “Quick view” modal with fuller description, steps, author, and Use buttons.

Wallet (/wallet)
- Groups grid
  - Unify card head: icon, title, meta (count, category). Reduce decorative backgrounds.
  - Expand/collapse affordance: rotate chevron; persist state per group; add keyboard support.
- Credentials list
  - Use font-mono for values; conceal secrets with “•”; copy feedback is good—ensure tooltip and aria-live.
  - Group actions as icon buttons with tooltips: reveal, copy, edit, delete; respect permission scopes.
- Add filters by type (api_key, token, password) and category; add sort by name/updated.

History (/history)
- Change list to a vertical timeline grouped by day; sticky subheaders for date clusters.
- Event rows: icon with color token, title, concise description, meta (user, time, severity badge).
- Filters: convert to toolbar; keep type/severity/date as compact selects; add “Clear filters”.

Browser Profiles (/browser-profiles)
- Cards: keep info density; reduce gradients; align feature rows; ensure copy-ID stays compact and consistent.
- Add filters (proxy on/off, adblock, persistence) and sorting (recent, name).
- Provide a quick action to set default profile; show country with code and flag in a pill.

Settings (/settings)
- Reorganize into a left-side section nav and right content area (2-column layout on lg): Overview, Health, Alerts, Performance, Task, Workflow, Schedule, UI, Notifications.
- Replace multiple cards with definition lists and segmented controls where suitable.
- Add sticky save bar that appears on change with “Save/Discard” and unsaved indicator; avoid modals for core actions.
- Add “Reset to defaults” confirmation modal and contextual help links.

Navigation & Headers
- Sidebar
  - Keep collapse behavior; add tooltips on hover for collapsed state; ensure active state contrast meets accessibility.
  - Group items with section labels (Core, Build, Monitor, Admin). Add an always-visible “Create” button at bottom.
- Page Header
  - Make sticky; keep icon, title, subtitle; move actions to the right; minimize blur to improve text contrast.
- Global Header
  - Consider a global search; keep credits pill; align brand with Sidebar avatar style.

Visual Hierarchy & Consistency
- Use consistent heading sizes per page: Page title (24px), Section title (20px), Card title (16–18px).
- Keep one primary action per view; secondary actions are outline/neutral.
- Avoid mixed emoji and icons; standardize on lucide icons (16–20px at rest).

Accessibility & Internationalization
- Provide aria-labels for icon-only controls in cards and lists.
- Ensure keyboard access to dropdown menus and modals; focus trap and Esc to close.
- Date/time: display in user timezone with absolute time on hover; support i18n later (labels via config).

Performance
- Remove global “transition: all” from globals.css; scope transitions to specific properties on interactive elements only.
- Reduce heavy blur and backdrop-filter layers; prefer solid backgrounds for long lists.
- Lazy-load below-the-fold sections; skeletons consistent across pages.

Component Library Notes
- Buttons: primary (gradient), secondary (gray), outline, destructive; keep rounded-xl and height 40px defaults.
- Inputs/selects: consistent radius and focus ring; placeholder gray-500.
- Badges: use tokenized variants for status, severity, category, difficulty; keep text-xs with medium weight.
- Cards: no inner borders; use dividers only when needed; prefer 12–16px radius.

Employee-focused vs General-user Modes
- Employee (Operator/Builder)
  - Show advanced filters by default, density set to Compact, expose bulk actions, show IDs and technical meta.
  - Keyboard shortcuts for common actions (save, execute, search, copy ID).
- General user
  - Comfortable density, simplified filters, hide IDs by default, more descriptive labels and helper text.
  - Guide rails: primary CTA, help links, contextual tips.

Implementation Checklist (high-level)
- Remove global transition-all; scope transitions; reduce backdrop-blur usage.
- Extract shared tokens (spacing, colors, shadows) and apply to cards/headers.
- Normalize PageHeader and list toolbars across pages; add sticky behavior.
- Replace emoji category icons with lucide; unify icon sizes (16–20px).
- Add compact/comfortable density switch to Tasks/Templates/Wallet/History.
- Refine filters into segmented controls + collapsible advanced options.
- Add quick-view modals for Templates and clearer preview for Workflows.
- Add tooltips and aria labels for all icon-only buttons; ensure focus states.
- Introduce global cmd/ctrl+k search and page-level search harmonization.


