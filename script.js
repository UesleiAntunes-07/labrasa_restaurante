/* =========================================================
   La Brasa – link da bio
   ---------------------------------------------------------
   CONFIGURAÇÃO: tudo o que pode precisar ser trocado está aqui.
   ========================================================= */
const CONFIG = {
  // ID do Meta Pixel (Gerenciador de Eventos da Meta). Deixe "" para desligar.
  META_PIXEL_ID: "1436832781408855",

  // Evento enviado em cada botão (o nome em data-track="..." no index.html).
  // standard: true  -> evento padrão da Meta (fbq "track")
  // standard: false -> evento personalizado (fbq "trackCustom")
  EVENTOS: {
    delivery:  { nome: "ClickDelivery",  standard: false },
    whatsapp:  { nome: "Contact",        standard: true  },
    maps:      { nome: "ClickMaps",      standard: false },
    instagram: { nome: "ClickInstagram", standard: false },
    facebook:  { nome: "ClickFacebook",  standard: false },
  },

  // Parâmetros UTM lidos da URL e enviados junto com os eventos.
  UTM_KEYS: ["utm_source", "utm_medium", "utm_campaign", "utm_content"],

  // Horário de funcionamento (usado no aviso "Aberto agora").
  // Dias: 0 = domingo, 1 = segunda ... 6 = sábado.
  HORARIO: { dias: [1, 2, 3, 4, 5, 6], abre: "10:30", fecha: "14:00" },
  FUSO: "America/Sao_Paulo",

  // Espera (ms) antes de abrir o link, para o evento chegar à Meta.
  ESPERA_NAVEGACAO_MS: 250,
};

/* ---------------- Meta Pixel ---------------- */
(function initPixel() {
  if (!CONFIG.META_PIXEL_ID) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq("init", CONFIG.META_PIXEL_ID);
  window.fbq("track", "PageView", getUtms());
})();

/* ---------------- UTMs ---------------- */
function getUtms() {
  const out = {};
  let params;
  try { params = new URLSearchParams(window.location.search); } catch (e) { return out; }

  CONFIG.UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 100);
  });

  // Guarda na sessão: se a pessoa recarregar a página sem os parâmetros, eles continuam valendo.
  try {
    if (Object.keys(out).length) {
      sessionStorage.setItem("labrasa_utms", JSON.stringify(out));
    } else {
      const saved = JSON.parse(sessionStorage.getItem("labrasa_utms") || "{}");
      Object.assign(out, saved);
    }
  } catch (e) { /* navegador sem storage: segue sem */ }

  return out;
}

/* ---------------- Cliques nos botões ---------------- */
function trackClick(key) {
  const evento = CONFIG.EVENTOS[key];
  if (!evento || typeof window.fbq !== "function") return;
  const params = Object.assign({ botao: key, pagina: "link-bio" }, getUtms());
  window.fbq(evento.standard ? "track" : "trackCustom", evento.nome, params);
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-track]");
  if (!link) return;

  trackClick(link.dataset.track);

  // Abre em nova aba / com tecla modificadora: o navegador cuida, a página continua viva.
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === "_blank") return;

  // Mesma aba: segura um instante para o evento ser enviado antes de sair da página.
  e.preventDefault();
  const href = link.href;
  setTimeout(() => { window.location.href = href; }, CONFIG.ESPERA_NAVEGACAO_MS);
});

/* ---------------- Facebook: esconde o botão enquanto não houver link ---------------- */
document.querySelectorAll('a[data-track="facebook"]').forEach((a) => {
  if (!/^https?:\/\//i.test(a.getAttribute("href") || "")) a.hidden = true;
});

/* ---------------- Aberto agora / fechado ---------------- */
(function openStatus() {
  const el = document.getElementById("status");
  if (!el) return;

  const NOMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const { dias, abre, fecha } = CONFIG.HORARIO;

  let dia, minutos;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.FUSO, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    minutos = Number(get("hour")) * 60 + Number(get("minute"));
  } catch (e) {
    return; // navegador muito antigo: não mostra o aviso
  }

  const abreHoje = dias.includes(dia);
  let texto, aberto = false;

  if (abreHoje && minutos >= toMin(abre) && minutos < toMin(fecha)) {
    aberto = true;
    texto = `Aberto agora · até ${fecha}`;
  } else if (abreHoje && minutos < toMin(abre)) {
    texto = `Fechado · abre hoje às ${abre}`;
  } else {
    let proximo = (dia + 1) % 7;
    while (!dias.includes(proximo)) proximo = (proximo + 1) % 7;
    const quando = proximo === (dia + 1) % 7 ? "amanhã" : NOMES[proximo];
    texto = `Fechado · abre ${quando} às ${abre}`;
  }

  el.textContent = texto;
  el.classList.toggle("status--open", aberto);
  el.hidden = false;
})();

/* ---------------- Ano do rodapé ---------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
