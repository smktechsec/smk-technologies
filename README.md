# SMK Technologies — Professional Security Solutions Website

A modern, responsive, high-performance corporate website for **SMK Technologies**, an authorized security systems integrator specializing in **Hikvision AX Pro Hybrid Alarm Systems**, intrusion detection, CCTV surveillance, access control, and integrated alarm infrastructures.

Designed and engineered for seamless static hosting on **GitHub Pages**, custom domains, or static web hosts with **zero build steps** and **zero runtime dependencies**.

---

## 🌟 Key Features

- **Dark Corporate Aesthetic**: High-end navy, charcoal, obsidian, and electric blue/cyan theme tailored for the cybersecurity and physical protection industry.
- **Hikvision AX Hybrid Pro Kit (433MHz)**: Dedicated showcase for model `DS-PHA64-KIT-WB(B)` featuring HTML5 MP4 video demonstration, interactive technical specifications modal, and fast quote dispatch.
- **Product Specifications Drawer/Modal**: Interactive viewer for certified hardware:
  - PIR Detector (`DS-PD2-P18CE`)
  - Wireless Keyfob (`DS-PKF1-WB`)
  - Surface-Mounted Magnetic Contact (`DS-PD1-MC-WS`)
  - Identification Tag (`DS-PT-M1`)
  - Wired LCD Keypad (`DS-PK1-LRT-HWB`)
- **Interactive Lightbox Gallery**: Categorized display of 11 authentic installation and field deployment photographs with keyboard navigation (Arrow keys, Escape) and touch swipe gestures.
- **Accessible & Responsive**: Full keyboard navigation, ARIA dialogs, focus trapping, smooth scrolling with sticky header offsets, and mobile drawer navigation.
- **Client-Side Consultation Workflow**: Static GitHub Pages-friendly email dispatch mechanism with form validation and one-click copy to clipboard.
- **Integrated Interactive Map**: Free, zero-API-key responsive Google Maps location embed for Vital Faulk Tower, Karachi, with direct navigation link.

---

## 📂 Project Architecture

```text
smk-technologies/
├── index.html                   # Primary website entry point (Semantic HTML5)
├── .nojekyll                    # Disables Jekyll processing on GitHub Pages
├── robots.txt                   # Search crawler directives
├── sitemap.xml                  # XML sitemap template
├── README.md                    # Project documentation & deployment manual
└── assets/
    ├── css/
    │   └── style.css            # Custom CSS3 design system & responsive rules
    ├── js/
    │   └── main.js              # Vanilla JavaScript controller & data store
    ├── images/
    │   ├── logo.png             # Official SMK Technologies corporate logo
    │   ├── hikvision-partner.png# Certified Hikvision Partner emblem
    │   ├── favicon.svg          # Modern cybersecurity shield favicon
    │   ├── security-solutions.png # Hero visual showcase composition
    │   ├── ax-hybrid-pro.jpg    # Featured AX Hybrid Pro showcase image
    │   ├── ax-hybrid-kit-banner.png # AX Pro system schematic banner
    │   ├── innovation.jpg       # "Our Journey of Innovation" editorial visual
    │   ├── ai-security.jpg      # Future Offering: AI Security Systems
    │   ├── smart-home.jpg       # Future Offering: Smart Home Integration
    │   ├── biometric-access.jpg # Future Offering: Biometric Access Control
    │   ├── intrusion-alarm.png  # Future Offering: Intrusion Alarm System
    │   ├── mobile-security.jpg  # Future Offering: Mobile Security Units
    │   ├── cloud-monitoring.jpg # Future Offering: Cloud-Based Monitoring
    │   ├── products/            # Individual peripheral catalog images
    │   │   ├── pir-detector.jpg
    │   │   ├── wireless-keyfob.jpg
    │   │   ├── magnetic-contact.jpg
    │   │   ├── identification-tag.jpg
    │   │   └── wired-lcd-keypad.jpg
    │   └── gallery/             # 11 field installation photographs
    │       ├── image-1.jpg
    │       └── ...
    │       └── image-11.jpg
    └── video/
        └── hikvision-product.mp4 # 1.7 MB lightweight H.264 demonstration video
```

---

## 🚀 GitHub Pages Deployment Guide

Deploying this website to **GitHub Pages** takes less than 2 minutes.

### Step 1: Initialize Git Repository
In your local project folder (`SMK` or `smk-technologies`):

```bash
git init
git add .
git commit -m "Initial release of SMK Technologies website"
```

### Step 2: Push to GitHub
Create a new GitHub repository (for example `smk-technologies` or `SMK`) under your account, then link and push:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
git push -u origin main
```

### Step 3: Enable GitHub Pages in Repository Settings
1. Open your repository on **GitHub.com**.
2. Click on **Settings** (gear icon near top right).
3. In the left navigation menu, click **Pages**.
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main`.
   - **Folder**: Select `/ (root)`.
5. Click **Save**.

### Step 4: Access Your Live Website
- GitHub will initiate the deployment workflow.
- In 1 to 2 minutes, refresh the Pages tab to view your published URL:
  ```text
  https://YOUR_USERNAME.github.io/REPOSITORY_NAME/
  ```
- Because all asset references in `index.html`, `style.css`, and `main.js` use **strict relative paths** (`assets/...`), the website works seamlessly under project sub-paths without broken images, styles, or scripts.

### Step 5: Updating the Website
Whenever you update code or replace images:
```bash
git add .
git commit -m "Update product specifications and photos"
git push origin main
```
GitHub Pages will automatically rebuild and deploy the new version in under 60 seconds.

---

## ⚠️ Important GitHub Pages Technical Considerations

1. **Static Hosting Environment**:
   - GitHub Pages serves purely static client-side files (`HTML`, `CSS`, `JS`, media).
   - It does not run PHP, Node.js servers, or MySQL databases.
   - The consultation form is configured with a zero-backend workflow: it validates user input, prepares an encrypted RFC 6068 `mailto:` payload to `info@smktechnologies.com`, and simultaneously copies the plain text inquiry to the clipboard.
   - If server-side form forwarding is desired later, you can integrate a free endpoint provider such as Formspree, Formkeep, or Web3Forms without modifying the visual layout.
2. **Video & Asset Size Limits**:
   - GitHub imposes a soft 100 MB per-file limit and recommend keeping repositories under 1 GB.
   - The bundled `hikvision-product.mp4` is optimized to **1.7 MB**, ensuring instantaneous buffering on mobile networks while staying far below repository quotas.
3. **Nojekyll File**:
   - The `.nojekyll` file at the root prevents GitHub's Jekyll engine from ignoring files or directories starting with underscores or special characters.

---

## 📋 Asset Replacement & Maintenance Guide

All original files provided for this project have been organized into the `assets/` directory.

If you ever wish to replace or update specific media:
- **Logo**: Replace `assets/images/logo.png` (transparent PNG, recommended height ~100px).
- **Badge**: Replace `assets/images/hikvision-partner.png`.
- **Product Images**: Place updated hardware images into `assets/images/products/`.
- **Gallery Images**: Add or replace photos in `assets/images/gallery/image-1.jpg` through `image-11.jpg`.
- **Video**: Replace `assets/video/hikvision-product.mp4` with any standard H.264 MP4 clip.

---

## 📞 Company Contact & Attribution

- **Company**: SMK Technologies
- **Email**: [info@smktechnologies.com](mailto:info@smktechnologies.com)
- **Direct Phone**: [+92 335 8550888](tel:+923358550888) | [+92 333 3449912](tel:+923333449912)
- **Address**: Suit # 801, 8th Floor, Vital Faulk Tower, Shahrah-e-Faisal, Karachi, Pakistan
- **Website Designer**: [Murtuza Developer](https://murtuzadeveloper.github.io/)

```text
Copyright SMK TECHNOLOGIES © 2026 SMK Technologies | Design by Murtuza Developer
```
