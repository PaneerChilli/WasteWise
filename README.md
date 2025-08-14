# WasteWise ♻️

**Find the right bin — keep recyclables clean & dry**  
WasteWise is a lightweight web app that helps people dispose of waste correctly — covering wet waste, dry recyclables, non‑recyclables, e‑waste, and biomedical — with clear **Do / Avoid** tips for each category.

---

## 🌍 Problem
Many households and workplaces mix waste incorrectly due to unclear or confusing recycling rules.  
This contamination reduces recycling success rates and increases landfill waste, harming both the environment and resource recovery efforts.

---

## 💡 Solution
WasteWise provides instant, accurate disposal guidance:
- **Search** any waste item.
- See its **category**, **verdict**, and **correct bin**.
- Get clear **Do / Avoid** tips to prevent contamination.
- Mobile‑friendly, fast, and works offline if installed as a PWA.
- Handles tricky/disputed items like oily pizza boxes, tetra packs, metal foil pouches, and biomedical waste.

---

## 🚀 Features
- Full‑width responsive **header** with logo + tagline.
- Fast **search** with quick category **chips**.
- Detailed **item pages** with verdict, destination bin, and disposal rules.
- Graceful **Item not found** fallback message with back link.
- **PWA‑ready** manifest and favicon/logo.
- Clean, consistent **responsive design**.

---

## 📂 Project Structure
index.html → Main search page
item.html → Item details page
reminders.html → (Future use — checklist/reminder features)
styles.css → Styling
app.js → Main logic & rendering
items.json → Waste item data & rules
manifest.webmanifest → PWA metadata
icons/logo.png → Favicon & app icon

---

## 🔮 reminders.html (Future Scope)
This page is a placeholder for future enhancements.  
It is intended to store **checklists, user reminders, and waste‑sorting tips** that may be developed into an interactive reminder/notification feature later.  

Currently, `reminders.html` is **not linked** in the main application flow and is excluded from the core submission functionality, but is retained in the repository for future development plans.

---

## 🔗 Live Links
- **Live site:** [https://paneerchilli.github.io/WasteWise](https://paneerchilli.github.io/WasteWise)  
- **Repository:** [https://github.com/PaneerChilli/WasteWise](https://github.com/PaneerChilli/WasteWise)

---

## 🎥 Demo Video
https://drive.google.com/file/d/1iG1BLQfjJaSCP5TPMwZZO8qKGeLXjM0C/view?usp=sharing
---

## 📅 Future Enhancements
- Interactive reminders & disposal checklists.
- AI/Camera‑based waste item recognition.
- Multi‑language aliases for better accessibility.
- Local city‑specific disposal rules.

---

## 🛠 How to Run Locally
1. **Clone the repo:**
   git clone https://github.com/PaneerChilli/WasteWise.git
cd WasteWise
2. **Open `index.html`** directly in a browser  
OR  
**Serve using a local server** (recommended for PWA features):

