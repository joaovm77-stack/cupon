/* Google Analytics 4 — ativado somente após consentimento do visitante. */
(function () {
  "use strict";
  const measurementId = "G-EGEGHLLPWM";
  const storageKey = "seu-credito-consentimento-analytics-v1";
  const banner = document.getElementById("analyticsBanner");
  const accept = document.getElementById("analyticsAccept");
  const decline = document.getElementById("analyticsDecline");
  const settings = document.getElementById("analyticsSettings");
  let loaded = false;
  let lastStep = null;

  function getChoice() {
    try { return localStorage.getItem(storageKey); }
    catch (_) { return null; }
  }
  function storeChoice(value) {
    try { localStorage.setItem(storageKey, value); }
    catch (_) { /* Sem armazenamento disponível: a escolha vale apenas nesta visita. */ }
  }
  function showBanner(show) {
    if (banner) banner.hidden = !show;
  }
  function trackStep(step) {
    if (!loaded || !Number.isInteger(step) || step < 0 || step > 30 || step === lastStep) return;
    lastStep = step;
    window.gtag("event", "etapa_funil", { etapa_numero: step });
  }
  function trackWhatsapp() {
    if (!loaded) return;
    window.gtag("event", "clique_whatsapp", { origem: "funil_simulacao" });
  }
  window.__analyticsTrackStep = trackStep;
  window.__analyticsTrackWhatsapp = trackWhatsapp;

  function enableAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(tag);
    const currentStep = Number(document.body.dataset.step);
    if (Number.isInteger(currentStep)) trackStep(currentStep);
  }
  function setChoice(value) {
    const wasLoaded = loaded;
    storeChoice(value);
    showBanner(false);
    if (value === "aceito") enableAnalytics();
    else if (wasLoaded) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
      // Recarregar evita novas medições após revogar o consentimento.
      window.location.reload();
    }
  }
  if (accept) accept.addEventListener("click", function () { setChoice("aceito"); });
  if (decline) decline.addEventListener("click", function () { setChoice("recusado"); });
  if (settings) settings.addEventListener("click", function () { showBanner(true); });
  if (getChoice() === "aceito") {
    enableAnalytics();
    showBanner(false);
  } else {
    showBanner(getChoice() !== "recusado");
  }
})();