# Seu Crédito — Funil de simulação (modelo demonstrativo)

Site estático, responsivo, em português do Brasil. Criado como um **modelo próprio inspirado em fluxos de atendimento digital**, não como cópia integral verificada de um site de terceiros. Não utiliza marcas, textos protegidos, logotipos ou integrações do site de referência.

## Telas

1. Boas-vindas e botão Continuar.
2. Objetivo do empréstimo.
3. Valor, prazo e cálculo ilustrativo de parcelas.
4. Perfil geral e aceite dos Termos.
5. Resultado com resumo, botão de cópia e contato opcional.

## Como testar

Abra `index.html` no navegador. Não precisa instalar dependências nem executar um servidor. É compatível com hospedagem estática como Netlify ou GitHub Pages.

## Ativar o botão de WhatsApp

Edite `app.js`, alterando `const WHATSAPP_NUMBER = "";` para seu número comercial no formato internacional, usando somente dígitos, por exemplo `5511999999999`. O visitante decide se quer abrir o WhatsApp e enviar o resumo. Por padrão, nenhum contato está configurado.

## Personalização

- Nome e textos da marca: `index.html`.
- Cores e layout: `styles.css`.
- Taxa mensal **ilustrativa**: constante `MONTHLY_RATE` no `app.js`, hoje em 2,49% ao mês.
- Valor permitido: entre R$ 500 e R$ 50.000; prazos de 6 a 48 meses.

## Atenção para uso comercial real

Este projeto **não coleta CPF, documento, conta bancária, senha ou dados de cartão; não envia informações a banco de dados; não analisa crédito; não gera aprovação; não libera empréstimos e não cobra taxas**.

Antes de usar comercialmente: informe razão social, CNPJ, canais verificáveis de atendimento, instituição financeira/parceiros quando aplicável, política de privacidade real, dados de CET e condições contratuais exigíveis e providencie revisão jurídica/LGPD. Nunca indique aprovação garantida nem exija pagamento antecipado para liberação de empréstimo.

O link do GitHub exibe os **arquivos do site**, não necessariamente um site já hospedado. Para um domínio acessível, faça o deploy da pasta `simulador-credito` em uma hospedagem estática.
