The googlesheet is saratoffice.in@gmail.com and the link is https://docs.google.com/spreadsheets/d/1HI5Wjjwo5OObDaS4W7QaOVc_RcqgREu8pHEQxSjYhUg/edit?gid=0#gid=0
# Interactive Work Place Location Map (Google Maps + Divi)

This project provides an **interactive Google Maps-based location map** for displaying multiple work places such as **PPCs, Rice Mills, FPS, and Godowns**.

The map is designed to handle **hundreds of locations efficiently**, with:
- Block-wise color grouping (Red, Blue, Green)
- Category labels on markers
- Search and filter controls
- Marker clustering for performance

It is optimized for **WordPress websites using the Divi Theme**.

---

## ✨ Features

- 📍 Interactive Google Map
- 🎨 Only 3 pin colors (Red, Blue, Green), auto-assigned block-wise
- 🔠 Category labels on pins (P, M, F, G)
- 🔎 Search by Block, Code, or Name
- 🗂 Marker clustering for fast loading with 400+ locations
- 📊 Data loaded dynamically from Google Sheets
- ⚡ Lightweight JavaScript (no jQuery dependency)

---

## 🗂 Data Source

Location data is fetched from a **Google Sheets document** using the Google Visualization API.

Required columns (in order):

| Column | Description |
|------|-------------|
| A | Block Name |
| B | Work Place Name |
| C | Work Place Code |
| D | Latitude |
| E | Longitude |
| F | Category (PPC / Rice Mill / FPS / Godown) |

---

## 📦 Files

- `map.js` → Main JavaScript file (Google Maps logic, markers, filters)

---

## 🔑 Prerequisites

Before installation, ensure you have:

1. **Google Maps JavaScript API Key**
   - Enable **Maps JavaScript API**
   - Restrict key to your website domain (HTTP referrer)

2. **Public Google Sheet**
   - Sheet must be published or accessible via the visualization API

---

## 🚀 Installation (WordPress + Divi)

### Step 1: Add HTML Structure (Divi)

1. Edit the page using **Divi Builder**
2. Add a **Fullwidth Section**
3. Insert a **Code Module**
4. Paste the following HTML:

```html
<div class="map-controls">
  <input list="blockList" id="blockSearch" placeholder="Type / Select Block Name">
  <datalist id="blockList"></datalist>

  <input type="text" id="codeSearch" placeholder="Search Work Place Code">
  <input type="text" id="nameSearch" placeholder="Search Work Place Name">
</div>

<div id="map" style="width:100%; height:500px;"></div>
