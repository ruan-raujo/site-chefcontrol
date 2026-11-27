GATE: PASS

Verificação realizada em 26 de novembro de 2026, no horário de São Paulo.
O verificador visual terminou sem falhas bloqueantes, com cinco exceções
documentadas em `.taste-skill/waivers.json`.

## Resultado

- Navegação e layout conferidos em 1440, 1024, 820, 768, 390 e 320 px.
- Nenhum erro de JavaScript, recurso quebrado ou rolagem horizontal.
- Título principal em até três linhas em todas as larguras testadas.
- Abas do produto verificadas com clique e setas do teclado.
- Simulador conferido para 30 g, 100 g e diferentes percentuais de ganho.
- Menu móvel, tecla Escape, foco e instruções de instalação verificados.
- Conteúdo e download acessíveis sem JavaScript; movimento reduzido respeitado.
- Instalador real, resposta HTTP Range 206, tamanho de 317.683.829 bytes e
  assinatura de arquivo executável conferidos.
- SHA-256 idêntico ao original:
  `EFD4B0076077B66951A653C977753B71EFC0967CB29B40029F54EF2838434E9A`.
- Build estático concluído em `dist`, incluindo o instalador.

## Desempenho

A medição local da skill terminou com zero FAIL e dois WARN, ambos sobre a
classificação do pequeno ícone da marca como imagem abaixo da dobra.

| Medida | Desktop | Celular emulado |
| --- | --- | --- |
| Transferência da página completa | 597,4 KiB | 596,8 KiB |
| Fontes | 53,5 KiB / 2 arquivos | 53,5 KiB / 2 arquivos |
| Imagens | 498,8 KiB | 498,8 KiB |
| Deslocamento de layout (CLS) | 0 | 0 |
| Tempo de bloqueio | 0 ms | 0 ms |
| Contextos WebGL | 0 | 0 |

O instalador não é pré-carregado. Os valores de tempo foram medidos localmente
em Chrome headless e não equivalem a dados de usuários em redes móveis.

## Exceções do verificador

1. O painel da calculadora é uma simulação, não um produto à venda. Os controles
   são as ações; um botão de compra seria incorreto.
2. A seção de precificação explica custos de receitas. Os valores em reais não
   são planos ou assinaturas do ChefControl.
3. A heurística de tabelas de preço confundiu a margem do simulador. A posição
   real do título, confirmada no navegador, é de 24 px no celular.
4. O teste de estresse altera artificialmente o título. O texto final cabe nas
   três linhas previstas em todas as seis larguras.
5. No celular, a seção de dados e perguntas cresce com o conteúdo. A escolha
   evita centenas de pixels vazios para forçar múltiplos da altura da tela.

## Avisos de composição

O verificador registrou 23 avisos sem bloqueio. Os detalhes originais estão em
`.taste-skill/gate.json`. Os grupos e as decisões são:

| Aviso | Decisão |
| --- | --- |
| `no-visual` | A seção de dados prioriza as respostas; o diagrama de pasta permanece menor que as telas do produto. |
| `heading-scale` (2) | Variação de títulos e valores numéricos mantém a hierarquia editorial; valores da calculadora são UI. |
| `section-gaps` (2) | Espaçamentos respondem à composição de cada seção. |
| `links` | Download no rodapé é o destino real da navegação. |
| `nav-labels` (5) | Rótulos curtos descrevem os assuntos; títulos desenvolvem a mensagem. |
| `copy-length` | O texto inclui explicação do cálculo e quatro respostas sobre o aplicativo. Copy-lint: zero FAIL e zero WARN. |
| `nav-current` | Navegação por âncoras; nenhum indicador acompanha o scroll. |
| `photo-repeat` | A mesma tela real aparece no hero e no tour, com propósitos e enquadramentos diferentes. |
| `grounds` | Papel, superfície, marrom e amarelo pertencem à identidade do ChefControl. |
| `visual-caption` | “Chocolate em pó” é o nome do ingrediente no simulador, não uma legenda da captura de outra seção. |
| `skip-link` | O primeiro foco é o link real “Pular para o conteúdo”, confirmado na estrutura. |
| `action-repeat` | Download aparece no cabeçalho e no hero no desktop; no celular fica apenas no hero. |
| `nav` | A área clicável do menu inclui preenchimento além do desenho do ícone. |
| `tap-size` (3) | Após a auditoria, marca, ação secundária e slider receberam área mínima de 44 px. |
| `cta` | A seção de dados e dúvidas informa; o download aparece na seção imediatamente seguinte. |

## Direção e materiais

Software para confeitarias, paleta derivada do aplicativo: papel `#FAF7F0`,
marrom `#281912` e amarelo `#FFB800`. Gabarito e Figtree, hospedadas localmente.
Hero com tela real sobre campo amarelo; tour, simulador em seção escura,
diagrama local e encerramento tipográfico.

Voz prática em português brasileiro, com as palavras receitas, pedidos,
ingredientes e estoque. Nenhum cliente, depoimento, prêmio ou preço comercial
foi inventado. Capturas usam o aplicativo real com API de demonstração isolada.
Não há fotografias de banco de imagens, slots vazios ou serviços de formulário.
O momento tipográfico `liquid-type` ocorre apenas por ponteiro no rodapé,
com força mínima, e fica estático em toque ou movimento reduzido.

## Limites da verificação

Celulares e tablets foram emulados no navegador. Toque, Safari, áreas seguras
e comportamento de teclado virtual ainda precisam de conferência em aparelho
físico. Nenhuma publicação externa foi solicitada. Ao definir uma hospedagem,
configure URL canônica e imagem social absolutas, e confirme que o serviço
aceita o instalador de 303 MB. O domínio não foi inventado.
