/* CONFIGURAÇÃO: adicione um número autorizado de atendimento com DDI e DDD, apenas dígitos.
   Ex.: const WHATSAPP_NUMBER = "5511999999999"; Sem um número, o botão mostra instruções.
   Os dados respondidos neste demonstrador não são enviados a servidores. */
"use strict";
const WHATSAPP_NUMBER = "";
const MONTHLY_RATE = 0.0249; // Taxa fixa usada somente no exemplo matemático, NÃO é oferta de crédito.
const state = { step: 0, purpose: "", amount: 5000, months: 12, income: "", occupation: "" };
const $ = (id) => document.getElementById(id);
const brl = (number) => new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(number);
const steps = [...document.querySelectorAll(".step")];
const alertBox = $("alert");

function message(text) {
  alertBox.textContent = text;
  alertBox.hidden = false;
  alertBox.scrollIntoView({block:"nearest",behavior:"smooth"});
}
function clearMessage() { alertBox.hidden = true; alertBox.textContent = ""; }
function showStep(index) {
  state.step = index;
  document.body.classList.toggle("welcome-mode",index === 0);
  steps.forEach((el) => { const active = Number(el.dataset.step) === index; el.hidden = !active; el.classList.toggle("is-active",active); });
  $("progressLabel").textContent = index ? "Sua simulação" : "Bem-vindo";
  $("progressFraction").textContent = index ? "Etapa " + index + " de 4" : "Início";
  $("progressFill").style.width = (index * 25) + "%";
  $("progressBar").setAttribute("aria-valuenow", String(index));
  clearMessage();
  if(index === 2) updateEstimate();
  if(index === 4) renderResult();
  window.scrollTo({top:0,behavior:"smooth"});
  const title=steps[index].querySelector("h1");
  if(title) { title.setAttribute("tabindex","-1"); title.focus({preventScroll:true}); }
}
function sanitizeAmount(value) {
  const n=Number(String(value).replace(",","."));
  return Number.isFinite(n)?n:NaN;
}
function payment(amount, months) {
  const pow=Math.pow(1 + MONTHLY_RATE, months);
  return amount * (MONTHLY_RATE * pow)/(pow-1);
}
function updateEstimate() {
  const a = sanitizeAmount($("amountInput").value);
  const valid = Number.isFinite(a) && a>=500 && a<=50000;
  $("miniPayment").textContent = valid ? brl(payment(a,state.months)) + "/mês" : "—";
}
function setAmount(value, fromRange=false) {
  const num=sanitizeAmount(value);
  if(fromRange && Number.isFinite(num)) {
    $("amountInput").value=String(num);
    state.amount=num;
  }
  if(Number.isFinite(num) && num>=500 && num<=50000){
    state.amount=num;
    $("amountRange").value=String(num);
  }
  updateEstimate();
}
function summary() {
  const p=payment(state.amount,state.months);
  return [
    "Simulação ilustrativa — Seu Crédito",
    "Objetivo: " + state.purpose,
    "Valor: " + brl(state.amount),
    "Prazo: " + state.months + " meses",
    "Parcela estimada: " + brl(p),
    "Total matemático estimado: " + brl(p * state.months),
    "Taxa de exemplo: 2,49% ao mês",
    "Sem IOF, tarifas e seguros. Não representa proposta, CET, análise nem aprovação de crédito."
  ].join("\n");
}
function renderResult() {
  const p=payment(state.amount,state.months);
  $("resultPayment").textContent=brl(p);
  $("resultMonths").textContent=state.months + " parcelas ilustrativas";
  $("resultAmount").textContent=brl(state.amount);
  $("resultTotal").textContent=brl(p * state.months);
  $("resultPurpose").textContent=state.purpose;
}
$("startBtn").addEventListener("click",()=>showStep(1));
document.querySelectorAll("[data-back]").forEach((button)=>button.addEventListener("click",()=>showStep(Math.max(0,state.step-1))));
document.querySelectorAll("[data-purpose]").forEach((button)=>button.addEventListener("click",()=>{
  state.purpose=button.dataset.purpose;
  document.querySelectorAll("[data-purpose]").forEach((b)=>{const selected=b===button;b.classList.toggle("selected",selected);b.setAttribute("aria-pressed",String(selected));});
  clearMessage();
}));
$("purposeNext").addEventListener("click",()=>{
  if(!state.purpose) return message("Selecione um objetivo para continuar.");
  showStep(2);
});
$("amountRange").addEventListener("input",(event)=>setAmount(event.target.value,true));
$("amountInput").addEventListener("input",(event)=>setAmount(event.target.value,false));
document.querySelectorAll("[data-months]").forEach((button)=>button.addEventListener("click",()=>{
  state.months=Number(button.dataset.months);
  document.querySelectorAll("[data-months]").forEach((b)=>{const selected=b===button;b.classList.toggle("selected",selected);b.setAttribute("aria-pressed",String(selected));});
  updateEstimate();
}));
$("valuesNext").addEventListener("click",()=>{
  const a=sanitizeAmount($("amountInput").value);
  if(!Number.isFinite(a)||a<500||a>50000) return message("Informe um valor entre R$ 500 e R$ 50.000.");
  state.amount=a; showStep(3);
});
$("profileNext").addEventListener("click",()=>{
  if(!$("income").value) return message("Selecione uma faixa de renda ou a opção 'Prefiro não informar'.");
  if(!$("occupation").value) return message("Selecione uma ocupação ou a opção 'Prefiro não informar'.");
  if(!$("adultConfirm").checked) return message("Para seguir, confirme que você tem 18 anos ou mais.");
  if(!$("termsConfirm").checked) return message("Leia e aceite os Termos de Uso para continuar.");
  state.income=$("income").value;
  state.occupation=$("occupation").value;
  showStep(4);
});
$("restartBtn").addEventListener("click",()=>{
  state.purpose="";state.amount=5000;state.months=12;state.income="";state.occupation="";
  $("amountInput").value="5000";$("amountRange").value="5000";$("income").value="";$("occupation").value="";
  $("adultConfirm").checked=false;$("termsConfirm").checked=false;
  document.querySelectorAll("[data-purpose]").forEach(b=>{b.classList.remove("selected");b.setAttribute("aria-pressed","false")});
  document.querySelectorAll("[data-months]").forEach(b=>{const selected=b.dataset.months==="12";b.classList.toggle("selected",selected);b.setAttribute("aria-pressed",String(selected))});
  showStep(0);
});
$("copyBtn").addEventListener("click",async()=>{
  const txt=summary();
  try {
    if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(txt);
    else {const a=document.createElement("textarea");a.value=txt;document.body.appendChild(a);a.select();if(!document.execCommand("copy")) throw new Error("Falha");a.remove();}
    const btn=$("copyBtn"),previous=btn.textContent;
    btn.textContent="✓ Copiado!";
    setTimeout(()=>btn.textContent=previous,2400);
  }catch{openInfo("Resumo da simulação",txt.replaceAll("\n","<br>"));}
});
$("contactBtn").addEventListener("click",()=>{
  if(/^\d{11,15}$/.test(WHATSAPP_NUMBER)) {
    const text=encodeURIComponent(summary()+"\n\nGostaria de conversar sobre opções de crédito.");
    window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+text,"_blank","noopener,noreferrer");
  } else {
    openInfo("Atendimento ainda não conectado","Este é um modelo demonstrativo. Para ativar o atendimento via WhatsApp, adicione o número comercial autorizado na variável <strong>WHATSAPP_NUMBER</strong> do arquivo <strong>app.js</strong>. Enquanto isso, você pode copiar o resumo da simulação.");
  }
});
const legal={
  termos:{
    title:"Termos de Uso",
    html:"<p><strong>Natureza da ferramenta.</strong> Este site é um modelo demonstrativo de simulação financeira e não representa instituição financeira, banco ou correspondente bancário. Não são oferecidos, concedidos ou intermediados empréstimos por esta versão.</p><p><strong>Estimativas.</strong> Os valores são calculados com taxa hipotética de 2,49% ao mês, pelo sistema de prestações constantes. O cálculo não inclui IOF, tarifas, seguro ou outros encargos e não representa CET. Qualquer oferta real dependerá de avaliação e de informações contratuais da instituição responsável.</p><p><strong>Sem garantias.</strong> Não há análise cadastral ou consulta de CPF; a ferramenta não gera aprovação, pré-aprovação ou direito a crédito. Nunca faça pagamento antecipado para obter empréstimo.</p><p><strong>Uso permitido.</strong> Utilize este simulador para fins informativos. A contratação de crédito deve ocorrer exclusivamente por canais oficiais da instituição de sua escolha.</p>"
  },
  privacidade:{
    title:"Privacidade",
    html:"<p><strong>Dados locais.</strong> Esta versão funciona diretamente no navegador. Finalidade, faixa de renda e ocupação são usadas apenas para navegar pelas etapas. Não há cadastro, analytics, cookies de rastreamento ou envio de respostas a servidores configurados neste projeto.</p><p><strong>Contato externo.</strong> Se um responsável pelo site configurar o botão de WhatsApp, ao acioná-lo você sairá da página e poderá compartilhar voluntariamente um resumo com o destinatário configurado. Revise sempre o número de destino e os termos do serviço externo.</p><p><strong>Hospedagem.</strong> O serviço que hospedar o site poderá registrar dados técnicos de acesso conforme a sua própria política. Antes de disponibilizar uma operação comercial, substitua este texto pela política real do operador, com identificação, finalidades, base legal, retenção e canal de privacidade aplicáveis à LGPD.</p>"
  }
};
const dialog=$("infoDialog");
function openInfo(title,html){$("dialogTitle").textContent=title;$("dialogContent").innerHTML=html;if(!dialog.open)dialog.showModal();}
document.querySelectorAll("[data-legal]").forEach((b)=>b.addEventListener("click",()=>{
  const item=legal[b.dataset.legal];openInfo(item.title,item.html);
}));
function closeDialog(){dialog.close();}
$("dialogClose").addEventListener("click",closeDialog);
$("dialogOk").addEventListener("click",closeDialog);
dialog.addEventListener("click",(e)=>{if(e.target===dialog)closeDialog();});
$("year").textContent=String(new Date().getFullYear());
showStep(0);
