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

Na Vercel, importe o repositório `ruan-raujo/site-chefcontrol`. O arquivo
`vercel.json` configura o framework como Other, o comando `npm run build` e a
pasta de saída `dist`. O build funciona em um checkout limpo, sem o instalador.

O instalador de 303 MB fica como um asset da Release `chefcontrol-v1.0.0` no
mesmo repositório. A rota `/downloads/ChefControl-Setup-1.0.0-Windows-x64.exe`
redireciona diretamente para esse arquivo no GitHub. A Vercel entrega apenas o
site, sem processar ou transferir o executável. Os botões continuam funcionando
sem JavaScript. O checksum `.sha256` continua hospedado com o site.

Antes de publicar uma nova versão, envie o `.exe` para a Release e confira seu
SHA-256. Depois atualize o destino em `vercel.json`, os links, a versão e o
tamanho em `index.html`. Para outra hospedagem estática, configure um
redirecionamento equivalente ou inclua o instalador local em `dist`.

Ao definir o domínio público, configure o canônico e uma URL absoluta para
`og:image` em `index.html`.

O instalador em `downloads` é uma cópia de
`../ChefControl/dist/ChefControl-Setup-1.0.0-Windows-x64.exe`. Os arquivos `.exe`
e `dist` são ignorados pelo Git. Para repor o instalador em outra máquina:

```powershell
Copy-Item ../ChefControl/dist/ChefControl-Setup-1.0.0-Windows-x64.exe downloads/
```

O build local inclui o instalador quando o arquivo existe; sua ausência não
impede o build. Na Vercel (`VERCEL=1`), o instalador é sempre excluído de `dist`.
O build substitui a pasta gerada para evitar executáveis antigos em cache.
O servidor local entrega o instalador por streaming e aceita HTTP Range.

Execute `npm.cmd run test:build` para verificar o build sem instalador,
o redirecionamento e a exclusão de arquivos locais ou antigos na Vercel.

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
