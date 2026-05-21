# MRX Servicos

Site institucional da MRX Servicos, desenvolvido para apresentar a empresa, suas areas de atuacao, canais de atendimento, canal de denuncia e registros de trabalhos realizados.

O projeto e um site estatico feito com HTML, CSS e JavaScript puro, com foco em navegacao simples, visual profissional, responsividade e boa organizacao das informacoes para clientes empresariais.

## Sobre o projeto

A MRX Servicos atua com solucoes tecnicas para ambientes comerciais, industriais, maritimos e corporativos. O site apresenta servicos relacionados a construcao civil, naval e offshore, estruturas metalicas, salas limpas, mobiliario sob medida, manutencao, restauracao e acabamento tecnico.

O objetivo do site e funcionar como presenca digital institucional da empresa, reunindo:

- apresentacao da marca e dos principais servicos;
- explicacao das areas de atuacao;
- registros visuais de trabalhos executados;
- formulario de contato para solicitacoes;
- canal de denuncia independente por e-mail;
- informacoes de privacidade e uso dos dados enviados.

## Paginas

### `index.html`

Pagina inicial do site. Apresenta a MRX Servicos, os principais segmentos atendidos, diferenciais, indicadores de confianca, chamada para contato e acesso ao canal de denuncia.

### `nosso-trabalho.html`

Pagina dedicada aos servicos e registros de execucao. Inclui areas de atuacao, mostruario visual, comparativo de antes e depois, galeria de fotos e chamada para atendimento.

### `contato.html`

Pagina de contato com formulario dinamico. Permite escolher entre assuntos gerais, solicitacao de servicos ou envio de curriculo. O envio pode direcionar para WhatsApp ou e-mail, dependendo do tipo de contato selecionado.

### `denuncia.html`

Pagina do canal de denuncia. Orienta o usuario sobre situacoes que podem ser relatadas e disponibiliza um link de e-mail com modelo de mensagem para envio das informacoes.

### `privacidade.html`

Pagina com a politica de privacidade. Explica quais dados podem ser coletados pelo formulario, como sao usados, informacoes sobre compartilhamento, seguranca, retencao e solicitacoes relacionadas aos dados.

## Funcionalidades

- Layout responsivo para desktop e dispositivos moveis.
- Menu mobile com controle de acessibilidade.
- Cabecalho com estado visual ao rolar a pagina.
- Formularios com validacao em JavaScript.
- Mascara de telefone no formulario de contato.
- Sugestoes de dominio para campo de e-mail.
- Alternancia dinamica entre contato geral, servicos e curriculo.
- Pre-visualizacao da mensagem antes de enviar.
- Abertura de WhatsApp com mensagem formatada.
- Envio por e-mail para contatos especificos.
- Protecao anti-spam com hCaptcha e campo honeypot.
- Galeria com botao "ver mais fotos".
- Lightbox para visualizacao de imagens da galeria.
- Comparativo visual de antes e depois.
- Animacoes de entrada, efeitos em icones e fade de imagens.
- Botao de voltar ao topo.
- Metatags de SEO e compartilhamento social.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap Icons
- Google Fonts - DM Sans
- hCaptcha
- Imagens em formato WebP

O projeto nao depende de bundler, framework JavaScript ou instalacao de pacotes para rodar localmente.

## Estrutura de pastas

```txt
.
|-- index.html
|-- nosso-trabalho.html
|-- contato.html
|-- denuncia.html
|-- privacidade.html
|-- css/
|   |-- cabecalho.css
|   |-- index.css
|   |-- sobre.css
|   |-- contato.css
|   |-- denuncia.css
|   `-- privacidade.css
|-- js/
|   `-- site.js
|-- img/
|   |-- Icon/
|   |-- Antes-Depois/
|   |-- galeria/
|   `-- demais imagens institucionais
`-- nao-producao/
    |-- prototipo.html
    |-- README.md
    `-- css/
```

## Como executar localmente

Por ser um site estatico, basta abrir o arquivo `index.html` em um navegador.

Tambem e possivel usar uma extensao como Live Server no VS Code para navegar pelo projeto com um servidor local.

Exemplo de URL local usando Live Server:

```txt
http://127.0.0.1:5500/index.html
```

## Arquivos principais

- `index.html`: pagina inicial.
- `nosso-trabalho.html`: apresentacao dos servicos, mostruario e galeria.
- `contato.html`: formulario de atendimento e informacoes de contato.
- `denuncia.html`: canal de denuncia por e-mail.
- `privacidade.html`: politica de privacidade.
- `css/cabecalho.css`: estilos globais, cabecalho, rodape, animacoes e elementos compartilhados.
- `css/index.css`: estilos especificos da pagina inicial.
- `css/sobre.css`: estilos da pagina "Nosso Trabalho".
- `css/contato.css`: estilos da pagina de contato e modal de confirmacao.
- `css/denuncia.css`: estilos da pagina do canal de denuncia.
- `css/privacidade.css`: estilos da politica de privacidade.
- `js/site.js`: interacoes gerais do site.

## Principais interacoes do JavaScript

O arquivo `js/site.js` concentra os comportamentos interativos do site:

- atualizacao do cabecalho ao rolar a pagina;
- controle do menu responsivo;
- rolagem suave para links da pagina atual;
- validacao e preparacao do formulario de contato;
- montagem de mensagens para WhatsApp e e-mail;
- controle do modal de confirmacao;
- autocomplete de e-mail;
- mascara de telefone;
- expansao da galeria;
- lightbox das imagens;
- animacoes de entrada;
- carrosseis mobile;
- botao de voltar ao topo.

## Contato exibido no site

- Telefones:
  - 55 (21) 97077-7424
  - 55 (21) 96829-9331
  - 55 (21) 99845-7698
- E-mail geral: `contato@mrxservicos.com`
- E-mail de servicos: `eduardosantos@crservicos.com`
- E-mail de denuncias: `denuncia@mrxservicos.com`
- Endereco: Rua Guapore, n. 4166, galpao, Boa Vista, Sao Goncalo - RJ, CEP 24466-270

## SEO e acessibilidade

As paginas possuem configuracoes basicas para SEO e compartilhamento, incluindo:

- `title` individual por pagina;
- `meta description`;
- Open Graph;
- Twitter Card;
- `canonical`;
- idioma `pt-BR`;
- textos alternativos em imagens;
- atributos ARIA em menu, modal e controles interativos;
- cuidado com navegacao por teclado em menus e modais.

## Observacoes de manutencao

- As imagens do projeto estao em formato WebP para reduzir peso e melhorar carregamento.
- A pasta `nao-producao/` guarda arquivos de prototipo e nao deve ser considerada parte da versao final publicada.
- Ao alterar contatos, e-mails ou endereco, revise tambem o rodape das paginas.
- Ao adicionar novas imagens na galeria, mantenha `alt`, `loading="lazy"`, `decoding="async"` e dimensoes declaradas quando possivel.
- Ao alterar o dominio oficial do site, revise as tags `canonical` e `og:url` nos arquivos HTML.

## Status

Projeto institucional estatico em desenvolvimento/manutencao, pronto para hospedagem em servidores simples, GitHub Pages ou servicos de deploy estatico.
