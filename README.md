# ChefControl — site promocional

Site estático em português, com as telas reais do aplicativo, tour por abas,
simulador de custo por porção e download do instalador Windows.
HTML, CSS e JavaScript nativos; não precisa instalar dependências.
Fontes, ícones e imagens são locais.

## Abrir

Na pasta `site`, com Node.js 22 ou superior:

```powershell
npm.cmd run dev
```

Acesse `http://localhost:4173`.

## Preparar para hospedagem

```powershell
npm.cmd run build
```

Publique o conteúdo de `dist`. A pasta inclui o instalador de aproximadamente
303 MB. O serviço de hospedagem deve aceitar esse tamanho de arquivo e, de
preferência, requisições HTTP Range. Antes de publicar, configure o domínio
canônico e uma URL absoluta para `og:image` em `index.html`.

O instalador em `downloads` é uma cópia de
`../ChefControl/dist/ChefControl-Setup-1.0.0-Windows-x64.exe`. Os arquivos `.exe`
e `dist` são ignorados pelo Git. Para repor o instalador em outra máquina:

```powershell
Copy-Item ../ChefControl/dist/ChefControl-Setup-1.0.0-Windows-x64.exe downloads/
```

Ao atualizar a versão do aplicativo, atualize também os links em `index.html`,
o tamanho, a versão e o arquivo `.sha256`. O build falha se o instalador não existir.
O servidor local entrega o instalador por streaming, com download parcial e
retomada por HTTP Range; não carrega os 303 MB na memória.

## Design e verificação

As decisões visuais e os fatos do produto estão em `DESIGN.md`.
Os resultados, exceções e limites das verificações estão em `VALIDACAO.md`.
As diretrizes de movimento vêm das skills `animate`, `emil-design-eng` e
`mobile-native` de [emilkowalski/skills](https://github.com/emilkowalski/skills).
Movimento limitado à entrada inicial, feedback dos controles e uma interação
suave com o nome no rodapé; respeita movimento reduzido e teclado.

`scripts/capture-product.mjs` captura o aplicativo local na porta 5174 com
API simulada, sem tocar no banco de uso real. `scripts/check-site.mjs` usa o
Playwright já instalado no projeto ChefControl e verifica o site na porta 4173.
Os dois scripts são auxiliares de desenvolvimento; não são necessários para
executar ou hospedar o site. As telas mostram dados de demonstração.

Fontes Gabarito e Figtree: licenças OFL em `assets/fonts`.
Não há cookies, analytics, formulários de coleta ou chamadas externas no site.
O aplicativo e seu público permanecem os mesmos: o site não cria uma versão
do ChefControl para celular, Mac ou uso na nuvem.
