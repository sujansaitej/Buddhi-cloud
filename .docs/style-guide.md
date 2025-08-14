# Buddhi Flow - Style Guide

This document provides comprehensive styling guidelines for the Buddhi Flow application, ensuring consistency across the UI and reinforcing the brand identity.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Component Styling](#component-styling)
4. [Spacing System](#spacing-system)
5. [Motion & Animation](#motion--animation)
6. [Dark Mode Variants](#dark-mode-variants)

## Color Palette

Buddhi Flow's color palette is designed to be modern and professional, with a focus on a glassmorphism style that allows content to shine. We use a combination of cool blues and clean grays to create a sense of trust and stability, while strategic accent colors guide the user's attention to key actions and feedback.

### Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary Navy** | `#171E2D` | Deep, rich navy used for main backgrounds, dark mode surfaces, and for creating depth |
| **Primary Gray** | `#F3F4F6` | Soft, light gray that provides a clean, neutral background for most of the application, ensuring high readability and a spacious feel |

### Secondary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Secondary Blue** | `#3B82F6` | Vibrant blue that serves as the main brand color, used for primary buttons, active states, and interactive elements |
| **Secondary Blue Light** | `#BFDBFE` | Lighter tint of the secondary blue, perfect for subtle hover states, selections, and background highlights |

### Accent Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Accent Teal** | `#2DD4BF` | Bright, refreshing teal used for important notifications, new feature highlights, and to draw attention to critical information |
| **Accent Orange** | `#F59E0B` | Warm, eye-catching orange used for warnings, alerts, and to indicate cautionary states |

### Functional Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Success Green** | `#10B981` | Friendly green for success messages, confirmations, and positive feedback |
| **Error Red** | `#EF4444` | Clear, bold red for error messages, destructive actions, and critical alerts |
| **Neutral Gray** | `#6B7280` | Medium gray for secondary text, disabled elements, and dividers |
| **Dark Gray** | `#374151` | Deep gray used for primary text to ensure optimal readability on light backgrounds |

### Background Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Background White** | `#FFFFFF` | Pure white, used for cards and content areas to provide a crisp, clean surface |
| **Background Light Gray** | `#F9FAFB` | Very subtle off-white for the main application background, offering a touch of softness and visual separation from cards |
| **Background Dark** | `#1F2937` | A slightly lighter version of the primary navy, this is the main background for dark mode |

## Typography

The typography for Buddhi Flow focuses on clarity and readability, using a modern, sans-serif font family. The hierarchy is designed to quickly guide the user's eye to the most important information, reducing cognitive load.

### Font Family

**Primary Font**: Inter

Inter is a highly legible and versatile font, optimized for screens, making it an ideal choice for a data-heavy application.

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Text Styles

#### Headings

| Style | Size/Line Height | Weight | Letter Spacing | Usage |
|-------|------------------|--------|---------------|-------|
| **H1** | 28px/36px | Bold (700) | -0.5px | Main screen titles and major sections |
| **H2** | 24px/32px | Semibold (600) | -0.5px | Sub-headers and card titles |
| **H3** | 20px/28px | Semibold (600) | -0.25px | Minor headers and important text within components |

#### Body Text

| Style | Size/Line Height | Weight | Letter Spacing | Usage |
|-------|------------------|--------|---------------|-------|
| **Body Large** | 16px/24px | Regular (400) | 0px | Primary reading text for long-form content and descriptions |
| **Body** | 14px/20px | Regular (400) | 0px | Standard text for most UI elements and detailed information |
| **Body Small** | 12px/16px | Regular (400) | 0.25px | Supporting text, metadata, and captions |

#### Special Text

| Style | Size/Line Height | Weight | Letter Spacing | Color | Usage |
|-------|------------------|--------|---------------|-------|-------|
| **Button Text** | 14px/20px | Medium (500) | 0.25px | Varies by button type | All interactive buttons |
| **Link Text** | 14px/20px | Medium (500) | 0px | Secondary Blue (#3B82F6) | Clickable text that stands out from surrounding content |

## Component Styling

Consistent and intuitive component styling is key to a frictionless experience. We use clean lines, subtle effects, and clear state changes to inform the user.

### Buttons

Buttons are designed with a generous height and rounded corners for a soft, approachable feel.

#### Primary Button

- **Background**: Secondary Blue (`#3B82F6`)
- **Text**: White (`#FFFFFF`)
- **Height**: 44px
- **Corner Radius**: 8px
- **Hover**: Background darkens slightly
- **Usage**: Main calls to action, primary user flows

#### Secondary Button

- **Background**: Transparent
- **Border**: 1.5px Secondary Blue (`#3B82F6`)
- **Text**: Secondary Blue (`#3B82F6`)
- **Height**: 44px
- **Corner Radius**: 8px
- **Hover**: Background fills with a soft blue tint (`#BFDBFE`)
- **Usage**: Alternative actions, secondary options

#### Text Button

- **Text**: Secondary Blue (`#3B82F6`)
- **Background**: None
- **Border**: None
- **Height**: 40px
- **Hover**: Text color darkens slightly
- **Usage**: Tertiary actions, subtle options, inline actions

### Cards

Cards are a primary visual element, using a glassmorphism effect to create a sense of layering and hierarchy.

- **Background**: White (`#FFFFFF`) with a very subtle backdrop blur
- **Border**: 1px solid Primary Gray (`#E5E7EB`)
- **Shadow**: Y-offset 4px, Blur 16px, Opacity 5%, Color Primary Navy (`#171E2D`)
- **Corner Radius**: 16px
- **Padding**: 24px
- **Usage**: Content containers, grouping related information, interactive modules

### Input Fields

Input fields are clean and simple, with clear visual feedback for different states.

- **Height**: 48px
- **Corner Radius**: 8px
- **Border**: 1px Neutral Gray (`#D1D5DB`)
- **Active Border**: 2px Secondary Blue (`#3B82F6`)
- **Background**: White (`#FFFFFF`)
- **Text**: Dark Gray (`#374151`)
- **Placeholder Text**: Neutral Gray (`#9CA3AF`)
- **Usage**: Forms, search fields, user input areas

### Icons

Icons are designed to be simple, using a two-pixel stroke for clarity.

- **Primary Icons**: 24x24px
- **Small Icons**: 20x20px
- **Primary Color**: Secondary Blue (`#3B82F6`) for interactive and active icons
- **Secondary Color**: Neutral Gray (`#9CA3AF`) for inactive or decorative icons
- **Usage**: Navigation, actions, status indicators, visual cues

## Spacing System

A systematic spacing system ensures a clean and balanced layout, creating "cognitive breathing room" for the user. We use an 8px grid.

| Size | Value | Usage |
|------|-------|-------|
| **XS** | 4px | Micro spacing (between closely related elements like an icon and text) |
| **S** | 8px | Small spacing (internal padding, spacing between items in a list) |
| **M** | 16px | Default spacing (standard margins, padding within cards) |
| **L** | 24px | Medium spacing (between major sections) |
| **XL** | 32px | Large spacing (separation between content blocks) |
| **XXL** | 48px | Extra-large spacing (main screen padding and major UI separations) |

## Motion & Animation

Motion is used purposefully to provide feedback and guide the user's attention without being distracting. Animations are subtle and based on real-world physics.

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| **Standard Transition** | 200ms | cubic-bezier(0.4, 0, 0.2, 1) | Most state changes, like hover effects and icon color changes |
| **Emphasis Transition** | 300ms | cubic-bezier(0.68, -0.55, 0.27, 1.55) | Subtle spring effect for important actions like a card expanding |
| **Microinteractions** | 150ms | ease-in-out | Quick, responsive feedback for small interactions, such as button clicks and form field focus |
| **Page Transitions** | 350ms | ease-out | Smooth, graceful transition between different screens |

## Dark Mode Variants

Buddhi Flow offers a beautiful, low-light viewing experience that maintains visual hierarchy and accessibility.

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Main Background** | Background Light Gray (`#F9FAFB`) | Dark Background (`#121212`) |
| **Surface/Cards** | Background White (`#FFFFFF`) | Dark Surface (`#1E1E1E`) |
| **Primary Color** | Primary Navy (`#171E2D`) | Dark Primary Navy (`#C5D9F2`) |
| **Primary Text** | Dark Gray (`#374151`) | Dark Text Primary (`#E5E7EB`) |
| **Secondary Text** | Neutral Gray (`#6B7280`) | Dark Text Secondary (`#9CA3AF`) |

### Implementation Notes

When implementing dark mode:
- Ensure sufficient contrast for all text elements
- Adjust shadows to be less pronounced but still provide depth
- Maintain the same visual hierarchy as light mode
- Test all interactive elements for clear state changes
- Preserve brand colors where appropriate, but adjust for better contrast 