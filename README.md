# Brahmaputra International University (BIU) Cover Page Generator

An authentic, zero-friction web application designed for all students of **Brahmaputra International University (BIU)** to generate official, pixel-perfect cover pages for **Lab Reports**, **Assignments**, **Project Reports**, **Term Papers**, **Internships**, and **Theses**.

---

## ✨ Features

- **100% Online • Zero File Upload Required**: No need to upload docx or template files—students simply type their information into the interactive form or click the live A4 preview to edit directly.
- **Official University Crest & Watermark**: Includes the authentic, circular BIU emblem with an enlarged high-resolution page watermark and official royal blue `#0070C0` typography hierarchy.
- **Universal Multi-Document Presets**:
  - 🔬 Lab Report (with Experiment No. & Experiment Name)
  - 📝 Assignment (Course Code, Title, Topic)
  - 📊 Project Report
  - 📄 Term Paper
  - 💼 Internship Report
  - 🎓 Thesis & Dissertation
- **One-Click Student Profile Manager**: Students can save their Name, ID, Batch, and Department to local browser storage to autofill any future cover page with a single click.
- **All University Departments Supported**: Quick preset dropdown for CSE, EEE, Civil, BBA, English, Law, and other faculties.
- **Inline Click-to-Edit Live Preview**: Click directly on any text on the A4 page preview to make instant live adjustments.
- **Vector PDF & Print Ready**: Export clean, print-ready A4 PDFs via `html2pdf.js` or standard browser print (`Cmd+P` / `Ctrl+P`) with exact `210mm × 297mm` geometry.
- **Dark / Light Mode**: Sleek modern UI with instant dark and light theme toggle.

---

## 🚀 Live Demo & Deployment on GitHub Pages

This project is 100% static (HTML5, CSS3, Vanilla JavaScript) with no external server or build step required.

### Quick Deployment Guide:
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: initial commit for BIU Cover Page Generator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** (top navigation).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**:
     - Select **GitHub Actions** (the included `.github/workflows/pages.yml` will automatically deploy on every push), **OR**
     - Select **Deploy from a branch** -> branch `main` -> folder `/ (root)` -> Click **Save**.
   - Your site will be live at:
     ```
     https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY>/
     ```

---

## 🛠️ Local Development

To run locally without an internet connection:
```bash
# Using Python
python3 -m http.server 8085

# Or using Node.js npx
npx serve .
```
Then open [http://localhost:8085](http://localhost:8085) in your web browser.

---

## 📂 Project Structure

```text
├── index.html                 # Main web application structure & preview
├── style.css                  # Design system, A4 print rules & responsive styles
├── app.js                     # Two-way data binding, profile storage & PDF export
├── assets/
│   ├── biu_logo.png           # Transparent official circular BIU crest
│   └── logo_data.js           # Base64 embedded crest for zero-CORS PDF export
├── vendor/
│   └── html2pdf.bundle.min.js # Local offline client-side PDF export engine
├── .github/workflows/
│   └── pages.yml              # Automated GitHub Pages CI/CD workflow
├── .gitignore                 # Excludes system scratch and temporary files
└── README.md                  # Documentation and deployment instructions
```

---

## 📄 License
Created for Brahmaputra International University students and academic community.
