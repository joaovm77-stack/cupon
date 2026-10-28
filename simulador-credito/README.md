# Seu Crédito — simulador informativo

Funil independente em português brasileiro, com identidade visual própria, organizado em etapas guiadas e conversa automática.

## Como funciona

O site apresenta a tela de boas-vindas, seleção do valor, identificação local, perguntas sobre renda, finalidade, ocupação, escolaridade e situação de crédito informada pelo visitante. Em seguida, uma conversa interativa reúne preferências de conta bancária, modalidade de recebimento, prazo para começar a pagar e valor do crédito.

Depois, oferece um comparativo matemático de parcelas, resumo informativo, orientações sobre contratação, condições da simulação, contatos opcionais e informações gerais sobre seguro prestamista, terminando com um botão para conversar via WhatsApp.

Os campos de CPF, nome, nascimento, telefone e e-mail não são enviados a servidores pelo código do aplicativo, nem incluídos na mensagem de WhatsApp. O número informado é verificado apenas pelos dígitos matemáticos. Os campos de identidade são apagados ao avançar da identificação inicial; telefone e e-mail opcionais são apagados ao sair da etapa de contato. Não existe login, cadastro persistido ou análise de crédito neste projeto.

## Observações importantes

- **Não é uma oferta de crédito**, nem aprovação ou pré-aprovação de empréstimo.
- **Não consulta Serasa, SCR, Receita Federal ou instituições financeiras.**
- **Não faz transferências PIX, gera comprovantes bancários ou contratos assinados.**
- **Não cobra taxa antecipada nem oferece seguro como requisito para liberar dinheiro.**
- A taxa de **2,49% ao mês** é puramente ilustrativa, sem IOF, seguro ou tarifas; portanto, o total não representa o CET de uma proposta real.
- A conversa é **automática**, não uma pessoa online.
- Todas as informações são demonstrativas. Antes de usar comercialmente, é necessário verificar a instituição responsável, a LGPD e a comunicação contratual adequada.

## Configuração e publicação

Arquivos ativos: `index.html`, `flow.css`, `flow-app.js`. O WhatsApp é configurado na constante `WA` dentro de `flow-app.js` e só recebe resumo da simulação após clique do visitante.

O site já se encontra na pasta `simulador-credito/` da branch `main` do repositório `cupon`, com uma cópia independente na branch `site-simulador-credito`. Para abrir o endereço do GitHub Pages, use `https://joaovm77-stack.github.io/cupon/simulador-credito/`, desde que a publicação do GitHub Pages esteja ativa.
