// script.js
const EMAIL = "wojtekvasquez@gmail.com";

const state = {
  lang: "es",
  typedTexts: [],
  typedIndex: 0,
  charIndex: 0,
  deleting: false,
  filter: "all",
  activeProjectId: null,
};

const projects = [
  {
    id: "citas",
    type: "backend",
    image: "img/projects/dashboard.png",
    gallery: [
      "img/projects/dashboard.png",
      "img/projects/registro.png",
      "img/projects/historial.png",
      "img/projects/login.png",
    ],
    title: {
      es: "Sistema de Gestión de Citas Médicas",
      en: "Medical Appointment Scheduling System"
    },
    subtitle: {
      es: "API con control de concurrencia y validación transaccional.",
      en: "API with concurrency control and transactional validation."
    },
    details: {
      es: [
        { k: "Problema", v: "Reservas duplicadas generaban conflictos en atención hospitalaria, horas en filas para agendar una cita." },
        { k: "Solución", v: "Validación transaccional en PostgreSQL + lógica backend (Node/Express) para bloquear horarios concurrentes." },
{ k: "Impacto", v: "Eliminación de doble reserva, reducción de filas largas en ventanilla y mejora de la confiabilidad operativa." },      ],
      en: [
        { k: "Problem", v: "Duplicate bookings caused scheduling conflicts in a healthcare setting." },
        { k: "Solution", v: "Transactional validation in PostgreSQL + backend logic (Node/Express) to lock time slots under concurrency." },
        { k: "Impact", v: "Removed double-booking and improved operational reliability." },
      ],
    },
    tags: ["Node.js", "Express", "PostgreSQL", "Transactions"],
    links: { repo: "https://github.com/Soldado-Lulu", demo: "" }
  },

  // Puedes borrar/editar estos ejemplos si aún no tienes imágenes
{
  id: "astronomy-data",
  type: "data",
  image: "img/projects/01_info_words_hist.png",
  gallery: [
    "img/projects/01_info_words_hist.png",
    "img/projects/02_top_descriptions.png",
    "img/projects/03_locations_scatter.png",
  ],
  title: { 
    es: "Análisis de Miradores Astronómicos", 
    en: "Astronomical Viewpoints Data Analysis" 
  },
  subtitle: { 
    es: "Exploración y visualización de datos turísticos usando Python.", 
    en: "Tourism dataset exploration and visualization using Python." 
  },
  details: {
    es: [
      { k: "Problema", v: "No existía una visión clara sobre la distribución geográfica y calidad de información de los miradores." },
      { k: "Solución", v: "Limpieza de datos, ingeniería de variables (conteo de palabras), conversión de coordenadas a lat/lon y generación de gráficos exploratorios." },
      { k: "Impacto", v: "Permite identificar cobertura por municipio, calidad descriptiva del contenido y distribución espacial para planificación turística." },
    ],
    en: [
      { k: "Problem", v: "No clear overview of geographic distribution and descriptive quality of astronomy viewpoints." },
      { k: "Solution", v: "Data cleaning, feature engineering (word count), coordinate conversion to lat/lon, and exploratory visualizations." },
      { k: "Impact", v: "Helps understand coverage by municipality, content richness, and spatial distribution for planning decisions." },
    ],
  },
  tags: ["Python", "Pandas", "Data Analysis", "Visualization"],
  links: { repo: "", demo: "" }
},
 {
  id: "olympics-analytics",
  type: "data",
  image: "img/projects/01_top_countries.png",
  gallery: [
    "img/projects/01_top_countries.png",
    "img/projects/02_medals_over_time.png",
    "img/projects/03_women_share.png",
    "img/projects/04_top_sports.png",
  ],
  title: {
    es: "Olympics Performance Analytics",
    en: "Olympics Performance Analytics"
  },
  subtitle: {
    es: "KPIs, tendencias y segmentación por país/deporte con datos históricos (1896–2014).",
    en: "KPIs, trends, and segmentation by country/sport using historical data (1896–2014)."
  },
  details: {
    es: [
      { k: "Contexto", v: "Unifiqué datasets de Juegos Olímpicos de Verano e Invierno para construir un reporte analítico con métricas accionables." },
      { k: "Problema", v: "Los datos estaban divididos por temporada y era difícil comparar rendimiento por país, deporte y género a través del tiempo." },
      { k: "Solución", v: "Limpieza y normalización (medallas/columnas), unión Summer+Winter, agregaciones por país/deporte/año y visualizaciones para tendencias y rankings." },
      { k: "Hallazgos", v: "Ranking histórico de países, evolución de medallas por año, deportes con mayor concentración y tendencia de participación femenina." },
      { k: "Impacto", v: "Dashboard base para análisis deportivo/BI: permite identificar dominancia, especialización y cambios históricos de performance." },
    ],
    en: [
      { k: "Context", v: "Merged Summer and Winter Olympics datasets to build an analytics-ready report with actionable metrics." },
      { k: "Problem", v: "Data was split by season, making it hard to compare country/sport/gender performance over time." },
      { k: "Solution", v: "Cleaned and standardized fields (medals/columns), merged datasets, built aggregations by country/sport/year, and created visuals for trends and rankings." },
      { k: "Findings", v: "All-time country leaderboard, medals trend over time, most medal-heavy sports, and women participation trend." },
      { k: "Impact", v: "A BI-style baseline dashboard to detect dominance, specialization, and long-term performance shifts." },
    ],
  },
  tags: ["Python", "Pandas", "Data Cleaning", "KPI Design", "Visualization"],
  links: { repo: "", demo: "" }
},
];

// ---------- Helpers ----------
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }
function safeLink(a) { return a && typeof a === "string" && a.trim().length > 0; }

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL);
    const msg = window.I18N?.[state.lang]?.toastEmailCopied || "Copied!";
    showToast(msg);
  } catch {
    showToast("Copy failed");
  }
}

// Marca orientación para que CSS decida contain/cover
function markOrientation(imgEl) {
  if (!imgEl) return;
  imgEl.classList.remove("is-landscape");

  // si aún no cargó, no hay naturalWidth
  const w = imgEl.naturalWidth || 0;
  const h = imgEl.naturalHeight || 0;
  if (w > 0 && h > 0 && w >= h) imgEl.classList.add("is-landscape");
}

// Aplica markOrientation cuando cargue
function markOrientationWhenReady(imgEl) {
  if (!imgEl) return;
  if (imgEl.complete) {
    markOrientation(imgEl);
    return;
  }
  imgEl.addEventListener("load", () => markOrientation(imgEl), { once: true });
}

// ---------- Language ----------
function applyLanguage(lang) {
  state.lang = lang;

  const dict = window.I18N?.[lang] || window.I18N?.es || {};
  const pill = $("#langPill");
  if (pill) pill.textContent = dict.langPill || (lang === "en" ? "EN" : "ES");

  $all("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (dict[key]) el.innerHTML = dict[key];
  });

  state.typedTexts = dict.typedTexts || [];
  state.typedIndex = 0;
  state.charIndex = 0;
  state.deleting = false;

  renderProjects();

  // Si modal abierto, refrescar idioma del modal
  if (state.activeProjectId) {
    const p = projects.find(x => x.id === state.activeProjectId);
    if (p) openProjectModal(p, true);
  }
}

function toggleLanguage() {
  const next = state.lang === "es" ? "en" : "es";
  localStorage.setItem("lang", next);
  applyLanguage(next);
}

// ---------- Typewriter ----------
function tickTypewriter() {
  const out = $("#typed-text");
  if (!out || state.typedTexts.length === 0) return;

  const full = state.typedTexts[state.typedIndex];

  if (!state.deleting) {
    state.charIndex++;
    out.textContent = full.slice(0, state.charIndex);

    if (state.charIndex >= full.length) {
      state.deleting = true;
      setTimeout(tickTypewriter, 1200);
      return;
    }
  } else {
    state.charIndex--;
    out.textContent = full.slice(0, state.charIndex);

    if (state.charIndex <= 0) {
      state.deleting = false;
      state.typedIndex = (state.typedIndex + 1) % state.typedTexts.length;
    }
  }

  setTimeout(tickTypewriter, state.deleting ? 40 : 70);
}

// ---------- Filters + Projects grid ----------
function projectMatchesFilter(p) {
  if (state.filter === "all") return true;
  return p.type === state.filter;
}

function setFilter(filter) {
  state.filter = filter;
  $all(".filter-btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filter === filter);
  });
  renderProjects();
}

function renderProjects() {
  const grid = $("#projectsGrid");
  if (!grid) return;

  const lang = state.lang;
  const filtered = projects.filter(projectMatchesFilter);

  grid.innerHTML = filtered.map(p => {
    const title = p.title?.[lang] || p.title?.en || "Project";
    const desc = p.subtitle?.[lang] || p.subtitle?.en || "";
    return `
      <article class="project" data-id="${p.id}" tabindex="0" role="button" aria-label="${title}">
        <div class="project__media">
          <img class="project__img" src="${p.image}" alt="${title}" onerror="this.src='img/mejor.png'; this.onerror=null;">
        </div>
        <div class="project__body">
          <div class="project__top">
            <h3 class="project__title">${title}</h3>
            <span class="project__type">${p.type.toUpperCase()}</span>
          </div>
          <p class="project__desc">${desc}</p>
          <div class="project__tags">
            ${(p.tags || []).slice(0,4).map(t => `<span class="tag">${t}</span>`).join("")}
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Detectar orientación en las imágenes de cards
  $all(".project__img").forEach(img => markOrientationWhenReady(img));

  // handlers
  $all(".project").forEach(card => {
    const open = () => {
      const id = card.dataset.id;
      const p = projects.find(x => x.id === id);
      if (p) openProjectModal(p);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });
}

// ---------- Modal ----------
function openProjectModal(project, keepOpen = false) {
  const modal = $("#projectModal");
  if (!modal) return;

  state.activeProjectId = project.id;

  const lang = state.lang;
  const title = project.title?.[lang] || project.title?.en || "Project";
  const subtitle = project.subtitle?.[lang] || project.subtitle?.en || "";
  const details = project.details?.[lang] || project.details?.en || [];
  const type = (project.type || "project").toUpperCase();

  $("#modalType").textContent = type;
  $("#modalTitle").textContent = title;
  $("#modalSubtitle").textContent = subtitle;

  const gallery = (project.gallery && project.gallery.length) ? project.gallery : [project.image];
  const mainImg = gallery[0];

  $("#modalGallery").innerHTML = `
    <div class="gallery__main">
      <img id="galleryMainImg" src="${mainImg}" alt="${title}" onerror="this.src='img/mejor.png'; this.onerror=null;">
    </div>
    <div class="gallery__thumbs">
      ${gallery.slice(0, 8).map((src, idx) => `
        <div class="gallery__thumb" data-src="${src}">
          <img class="gallery__thumbImg" src="${src}" alt="${title} ${idx+1}" onerror="this.src='img/mejor.png'; this.onerror=null;">
        </div>
      `).join("")}
    </div>
  `;

  // Orientación: main + thumbs
  const mainEl = $("#galleryMainImg");
  markOrientationWhenReady(mainEl);
  $all(".gallery__thumbImg").forEach(img => markOrientationWhenReady(img));

  // Click thumbs: actualizar main + recalcular orientación
  $all(".gallery__thumb").forEach(t => {
    t.addEventListener("click", () => {
      const src = t.dataset.src;
      if (!src) return;

      const main = $("#galleryMainImg");
      main.src = src;
      // cuando cambie src, re-evaluar al cargar
      markOrientationWhenReady(main);
    });
  });

  // Details
  $("#modalDetails").innerHTML = details.map(d => `<p><b>${d.k}:</b> ${d.v}</p>`).join("");

  // Tags
  $("#modalTags").innerHTML = (project.tags || []).map(t => `<span class="tag">${t}</span>`).join("");

  // Links
  const repo = safeLink(project.links?.repo) ? `<a href="${project.links.repo}" target="_blank" rel="noreferrer">Repo</a>` : "";
  const demo = safeLink(project.links?.demo) ? `<a href="${project.links.demo}" target="_blank" rel="noreferrer">Demo</a>` : "";
  $("#modalLinks").innerHTML = `${repo}${demo}` || "";

  if (!keepOpen) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeProjectModal() {
  const modal = $("#projectModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  state.activeProjectId = null;
}

function bindModalEvents() {
  const modal = $("#projectModal");
  if (!modal) return;

  $all("[data-close='true']").forEach(el => {
    el.addEventListener("click", closeProjectModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeProjectModal();
    }
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const saved = localStorage.getItem("lang");
  const initial = (saved === "en" || saved === "es") ? saved : "es";
  applyLanguage(initial);

  $("#langToggle")?.addEventListener("click", toggleLanguage);
  $("#btnCopyEmail")?.addEventListener("click", copyEmail);
  $("#btnCopyEmail2")?.addEventListener("click", copyEmail);

  $all(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
  });

  bindModalEvents();
  tickTypewriter();
});