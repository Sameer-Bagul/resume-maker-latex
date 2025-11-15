# Design Guidelines: Resume Maker SaaS Application

## Design Approach

**Reference-Based Design**: Drawing inspiration from bug0.com's modern B2B SaaS aesthetic combined with productivity tools like Notion and Linear. This creates a professional, trustworthy interface that emphasizes clarity and efficiency in the resume creation workflow.

**Core Principles**:
- Clean, modern aesthetic with strong visual hierarchy
- Focus on workflow efficiency and multi-step progression
- Professional credibility through polished components
- Mobile-first responsive approach

---

## Typography System

### Font Families
- **Headlines/Important Elements**: "Space Grotesk", "Noto Sans", sans-serif
- **Body/Interface Text**: "Poppins", sans-serif

### Type Scale
- **Hero Headlines**: text-5xl to text-6xl, font-bold (Space Grotesk)
- **Section Headers**: text-3xl to text-4xl, font-bold (Space Grotesk)
- **Card/Component Titles**: text-xl to text-2xl, font-semibold (Noto Sans)
- **Body Text**: text-base, font-normal (Poppins)
- **Small Text/Labels**: text-sm, font-medium (Poppins)
- **Micro Copy**: text-xs (Poppins)

---

## Layout & Spacing System

**Tailwind Spacing Primitives**: Use units of 2, 4, 6, 8, 12, 16, 20, 24 consistently
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-24
- Card gaps: gap-6 to gap-8
- Form field spacing: space-y-4

**Container Strategy**:
- Max-width containers: max-w-7xl for full sections
- Content containers: max-w-4xl for forms/content
- Narrow content: max-w-2xl for focused reading

**Grid Systems**:
- Feature grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard sections: grid-cols-1 lg:grid-cols-2 for form splits
- Template gallery: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation
**Header**: Sticky top navigation with logo left, nav links center, auth buttons right. Height: h-16 to h-20. Semi-transparent backdrop blur on scroll.

**Dashboard Sidebar** (Desktop): Fixed left sidebar, w-64, with navigation items, progress indicator for form completion, and template quick-access.

**Mobile Navigation**: Hamburger menu transforming to full-screen overlay with large tap targets (min-h-12).

### Cards & Containers
**Primary Cards**: Rounded corners (rounded-xl), subtle border, shadow on hover. Padding: p-6 to p-8.

**Form Sections**: Each data section (Skills, Education, etc.) as expandable cards with checkbox toggle, clear visual separation.

**Template Cards**: Preview thumbnail, title, hover effect with scale transform, selection indicator.

### Forms
**Input Fields**: Rounded (rounded-lg), clear labels above, focus states with ring effect, full-width on mobile, appropriate widths on desktop.

**Checkboxes**: Custom styled, larger touch targets (w-5 h-5 minimum), clear labels, positioned left of section titles.

**Multi-step Form**: Progress bar at top showing current step (1-7 steps), step titles visible, smooth transitions between sections.

**Photo Upload**: Drag-and-drop zone with preview, max size indicator, circular crop preview for profile photo.

### Buttons
**Primary CTA**: Large (px-8 py-4), rounded-lg, font-semibold. Main actions like "Generate Resume", "Download PDF".

**Secondary**: Outlined style, same sizing, for "Preview", "Back" actions.

**Icon Buttons**: Social link inputs with icon prefixes, template selection actions.

### Data Display
**Resume Preview**: Split-screen layout on desktop (form left 40%, preview right 60%), full-screen modal on mobile. Real-time updates as user types.

**Template Switcher**: Horizontal scrollable gallery on mobile, grid on desktop, clearly showing 3-4 template options.

### Feedback Elements
**Success States**: Checkmark icons, subtle animation on section completion.

**Validation**: Inline error messages below fields, red accent for errors.

**Loading States**: Skeleton screens for resume generation, spinner for PDF download.

---

## Page-Specific Layouts

### Landing Page
**Hero Section**: Full viewport height (min-h-screen), centered content with headline, subheadline, dual CTA buttons ("Start Free" + "View Demo"), and hero image showing resume preview on right (desktop) or below (mobile).

**Feature Showcase**: 3-column grid highlighting "ATS Optimization", "Multiple Templates", "Real-time Preview". Each feature has icon, title, description.

**Process Flow**: 4-step horizontal timeline showing "Fill Details → Choose Template → Preview → Download" with connecting lines.

**Template Gallery**: Preview of 3-4 templates in cards, centered layout.

**Testimonials**: 2-column grid with user quotes, names, roles (if applicable to resume creation).

**Final CTA**: Centered section with headline and prominent signup button.

### Authentication Pages
Centered card layout (max-w-md), logo at top, form fields, social login buttons (Google, GitHub), link to toggle between login/signup. Minimal, focused design.

### Dashboard
**Multi-Step Form Layout**:
- Progress indicator at top showing 7 steps
- Current section expanded as large card
- Each section has: Section icon, title, checkbox toggle ("Include in Resume"), form fields
- Navigation: "Previous" and "Next" buttons at bottom, "Save Draft" option

**Sections**:
1. Personal Details: Name, title, contact (grid-cols-2 on desktop)
2. Skills: Tag input with add/remove, skill categories
3. Education: Repeatable card pattern for multiple entries (degree, institution, dates)
4. Projects: Repeatable cards (title, description, tech stack, links)
5. Experience: Repeatable cards (company, role, dates, responsibilities)
6. Achievements: List input with add/remove
7. Photo & Social: Upload zone + social link inputs (GitHub, LinkedIn, YouTube, Email, Phone)

### Template Selection
Grid of template cards, hover zoom effect, "Use Template" button, side panel showing template details and preview.

### Resume Generation
Split view: Final edits left, live preview right (desktop). Mobile: Tabs to switch between edit/preview. "Download PDF" button fixed at bottom.

---

## Responsive Breakpoints
- **Mobile**: < 768px - Single column, stacked sections, full-width cards
- **Tablet**: 768px - 1024px - 2-column grids, show both form and preview
- **Desktop**: > 1024px - 3-column feature grids, sidebar navigation, split-screen editing

---

## Images
**Hero Image**: Professional mockup of a generated resume on a modern device (tablet or laptop screen), positioned right side of hero on desktop, below headline on mobile. Shows sample ATS-optimized resume with clean formatting.

**Feature Section Icons**: Use Heroicons for features - DocumentTextIcon for templates, CheckCircleIcon for ATS, EyeIcon for preview.

**Template Previews**: Thumbnail images of each LaTeX template showing full resume layout, clearly displaying different design approaches.