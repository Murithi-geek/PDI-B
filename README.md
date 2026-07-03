# PDI Achievers Mentorship Association — Premium Website Rebuild

A complete premium rebuild of the PDI Achievers Mentorship Association website, elevated to international standard comparable to leading global organisations.

## Project Structure

```
pdi-achievers-mentorship/
├── index.html          # Main HTML — all sections, semantic markup, SEO
├── style.css           # Full design system + all component styles
├── script.js           # All JavaScript — interactions, animations, UX
├── README.md           # This file
├── PDI.jpeg            # Logo / favicon
├── Ndirangu.jpeg       # Dr. Ann Ndirangu portrait
├── ann murithi.jpeg    # Ann Murithi portrait
├── john.jpeg           # John Wachira portrait
├── Jimnah.jpeg         # Jimnah Irungu portrait
├── MK.jpeg             # Mworia Koome portrait
├── Event 1.jpeg        # Hero + Careerfit Programme image
├── Event 2.jpeg        # Tertiary Transition Programme image
├── Event 5.jpeg        # Passionstars Guidance image
├── DR.N.jpeg           # Partner logo
├── MKF01.jpeg          # Partner logo
└── WhatsApp Image 2025-08-12 at 13.27.*.jpeg  (46 gallery images)
```

## Design System

### Brand Colours
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#D32F2F` | Brand Red — CTAs, accents, highlights |
| `--color-accent`  | `#1565C0` | Brand Blue — badges, secondary accents |
| `--color-text`    | `#1a1a2e` | Body text |
| `--color-surface` | `#f7f7fc` | Section backgrounds |

### Typography
- **Display / Headings**: Playfair Display (Google Fonts) — elegant, authoritative
- **Body / UI**: Inter (Google Fonts) — clean, highly readable

### Spacing Scale
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128px`

### Breakpoints
`1280px · 1024px · 768px · 576px · 390px`

## Features

### Navigation
- Transparent over hero, solid white on scroll with smooth transition
- Active section highlighted via Intersection Observer
- Mobile slide-in menu with body scroll lock and focus management
- Escape key + overlay click to close
- Keyboard accessible throughout

### Hero Section
- Full-viewport background image with professional dark overlay
- Staggered entry animations on page load
- Rotating core values text with smooth transition
- Two CTAs: primary (Explore Programmes) + ghost (Our Mission)
- Animated scroll indicator

### Animations
- Scroll-driven Intersection Observer animations (fade-up, fade-left, fade-right, scale-in)
- Staggered delays via `data-delay` attributes
- Animated statistics counters (ease-out cubic)
- `prefers-reduced-motion` respected — all animations disabled for accessibility

### Programmes
- 7 expandable accordion cards
- Smooth max-height transition
- Featured badge on Young Managers Mentorship

### Gallery
- 46 event photos in responsive CSS Grid
- Click-to-open lightbox
- Keyboard navigation (← → Escape)
- Touch swipe support on mobile
- Animated image transition in lightbox

### Contact Form
- Floating label inputs
- Live validation on blur + debounced on input
- Success/error states with visual feedback
- Accessible error messages via `role="alert"`

### Footer
- Newsletter subscription with confirmation feedback
- 4-column layout: Brand, Quick Links, Programmes, Contact
- Core values badge strip
- Legal links (Privacy, Terms, Accessibility)

### Performance
- All images `loading="lazy"` except hero (eager + fetchpriority="high")
- External fonts loaded with `preconnect` hints
- CSS animations via GPU-composited properties (opacity, transform)
- Throttled scroll handlers (16ms)
- No external JS dependencies

### SEO
- Full meta tags (description, keywords, author, canonical)
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD Organization structured data
- Semantic HTML5 landmarks (`header`, `main`, `footer`, `nav`, `section`, `article`)
- Proper heading hierarchy (one `h1`, multiple `h2`, `h3`)
- All images have meaningful `alt` text

### Accessibility (WCAG AA)
- Skip to main content link
- All interactive elements keyboard accessible
- `aria-label` on icon-only buttons
- `aria-expanded` on accordion toggles
- `aria-live` on form success/error messages
- Focus trapping in mobile menu and lightbox
- `role="dialog"` + `aria-modal="true"` on lightbox
- Visible focus styles on all interactive elements

## Deployment

This is a static site — no build step required.

1. Upload all files to your web host root
2. Ensure all image files are included (filenames with spaces must be preserved)
3. Point your domain DNS to the hosting server
4. For HTTPS, obtain an SSL certificate (free via Let's Encrypt)

### To connect the contact form to a real email service:
Replace the `setTimeout` simulation in `script.js` (`initContactForm`) with a real form endpoint such as:
- [Formspree](https://formspree.io/)
- [EmailJS](https://www.emailjs.com/)
- Custom backend POST endpoint

## Browser Support

Chrome · Edge · Firefox · Safari · iOS Safari · Android Chrome

---

&copy; 2025 PDI Achievers Mentorship Association. All rights reserved.
