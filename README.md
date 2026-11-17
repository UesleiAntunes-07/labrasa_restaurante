# La Brasa – link da bio

Página de link da bio do Instagram **@la_brasarestaurante** (La Brasa, Medianeira-PR).
Site estático: HTML, CSS e JS puros, sem build.

```
index.html      conteúdo da página (textos e links)
style.css       cores, fontes e layout (variáveis no topo)
script.js       Meta Pixel, eventos, UTMs e aviso "Aberto agora" (CONFIG no topo)
netlify.toml    configuração da Netlify
assets/         logo, fotos, ícones e imagem de prévia
```

## Como publicar na Netlify

**Opção 1 – arrastar e soltar (mais rápida)**
1. Entre em https://app.netlify.com → *Add new project* → *Deploy manually*.
2. Arraste **esta pasta inteira** (`site/`) para a área indicada.
3. Em *Project configuration → Change project name*, escolha o endereço (ex.: `labrasa`).
   A página fica em `https://labrasa.netlify.app/`.
4. Para atualizar depois: *Deploys* → arraste a pasta de novo.

**Opção 2 – GitHub (atualiza sozinha a cada `git push`)**
Suba esta pasta para um repositório e, na Netlify, *Add new project → Import an existing project*.
Não precisa de comando de build; a pasta publicada é a raiz (`publish = "."`).

Depois de publicar:
- Troque `og:image` no `index.html` pelo endereço completo, ex.:
  `https://labrasa.netlify.app/assets/og.jpg` (WhatsApp e Facebook só mostram a prévia com endereço completo).
- O selo "Powered by Netlify" pode ser desligado em *Project configuration → General*.

## Link para colocar no Instagram

Use os parâmetros UTM para saber de onde vieram os cliques:

```
https://labrasa.netlify.app/?utm_source=instagram&utm_medium=bio
```

Em anúncios, acrescente `utm_campaign` e `utm_content`. Eles são enviados junto com os eventos do Pixel.

## Onde trocar cada coisa

| O quê | Onde |
|---|---|
| Links de delivery, WhatsApp, Instagram, Facebook e mapa | `index.html`, no `href` de cada botão (se o do Facebook não for um link `https://...`, o botão some) |
| Endereço, horário e textos | `index.html` |
| Horário do aviso "Aberto agora" | `script.js` → `CONFIG.HORARIO` (mude junto com o texto do `index.html`) |
| **ID do Meta Pixel** | `script.js` → `CONFIG.META_PIXEL_ID` (deixe `""` para desligar) |
| Nome dos eventos | `script.js` → `CONFIG.EVENTOS` |
| Cores | `style.css` → variáveis no `:root` |

## Fotos e logo (pasta `assets/`)

Basta colocar os arquivos com estes nomes; nada no código precisa mudar.

| Arquivo | Uso | Tamanho sugerido |
|---|---|---|
| `logo.png` | logo do topo (fundo transparente) | ~480 px de largura |
| `buffet-japonesa.jpg` | foto "Comida japonesa" | 800×600 (4:3) |
| `buffet-panela-de-barro.jpg` | foto "Panela de barro" | 800×600 |
| `buffet-grelhados.jpg` | foto "Grelhados na hora" | 800×600 |
| `buffet-saladas.jpg` | foto "Saladas e acompanhamentos" | 800×600 |
| `og.jpg` | prévia ao compartilhar o link | 1200×630 |

**As 4 fotos do buffet atuais são ilustrativas**, do banco gratuito Unsplash (licença permite uso
comercial, sem necessidade de crédito). O ideal é trocá-las por fotos reais do buffet do La Brasa:
basta salvar com o mesmo nome por cima.

| Arquivo | Foto Unsplash (ID) |
|---|---|
| `buffet-japonesa.jpg` | photo-1553621042-f6e147245754 |
| `buffet-panela-de-barro.jpg` | photo-1773209928058-cfd3314acc7c |
| `buffet-grelhados.jpg` | photo-1558030006-450675393462 |
| `buffet-saladas.jpg` | photo-1569760142069-bc6838de16c1 |

Se uma foto for apagada, aparece um fundo decorativo; sem o `logo.png`, aparece o monograma "LB".
O logo original em alta resolução está em `../materiais/logo-original.png`.
Comprima as fotos antes (ex.: https://squoosh.app, qualidade ~75, menos de 150 KB cada) para a página continuar rápida.

A imagem `og.jpg` é gerada a partir do modelo `../materiais/og-template.html` (instruções dentro do arquivo).

## Eventos do Meta Pixel

| Botão | Evento |
|---|---|
| (abrir a página) | `PageView` |
| Pedir delivery | `ClickDelivery` (personalizado) |
| Pedir pelo WhatsApp | `Contact` (padrão) |
| Como chegar | `ClickMaps` (personalizado) |
| Instagram | `ClickInstagram` (personalizado) |
| Facebook | `ClickFacebook` (personalizado) |

Todos levam `botao`, `pagina` e as UTMs presentes na URL. Para conferir, use a extensão
*Meta Pixel Helper* ou *Gerenciador de Eventos → Testar eventos*.
