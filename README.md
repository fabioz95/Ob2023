# Ob2023

Obiettivo 2023 di Fabio Zuccaro utilizzo di vercel commerce per il solo obiettivo (di studio).

## Spiegazione progetto (TODO)

Il progetto consiste nel integrare un frontend creato da Vercel ["Vercel è una piattaforma per framework frontend e siti statici, costruita per integrarsi con il proprio contenuto headless, ecommerce o database."]
Più precisamente "commerce: https://github.com/vercel/commerce/tree/v1"

Questo progetto come si può notare è gestito tramite Next.js e la sua integrazione con Shopify.
E' stato quindi svolto un lavoro per fare in modo di "staccare" questo progetto da shopify e renderlo indipendente, per poi andarlo a collegare con un BE di HCL Commerce tramite Sofy.

## Collegamento al BE (Sofy)

E' stato creato un BE tramite Sofy, con il quale tramite swagger ed esempi di ecommerce (vedi: https://commerce-preview.sbx0133.play.hclsofy.com/Emerald/ o https://hclsofy.com/catalog/commerce-solutions?view=doc&file=all-in-one.md).
Sono state gestite diverse chiamate, più precisamente:

- Categories (Menu),
- Products (Prodotti in base alla scelta del menu),
- Product e ProductId(Singolo Prodotto),
- ProductSearch (Ricerca di prodotti tramite Stringa),
- Cart (Carrello)

Per quanto riguarda il carello è stata fatta una chiamata a parte, perché questo necessita di due TOKEN per poterlo invocare.
Questo token è possibile averlo tramite la chiamata guestIdentity(), per semplicità di questo progetto sono stati utilizzati due costanti inserite all'interno del progetto.

## Collegamento al BE (Sofy con Graph)

Sono state utilizzate anche tre chiamate costruite tramite il linguaggio GraphQL, anche qui sembra basandoci sul medesimo BE tramtie Sofy (vedi: https://commerce-preview-graphql.sbx0133.play.hclsofy.com/graphql).

Più precisamente le tre chiamate implementate sono state:

- AddToCart
- RemoveFromCart
- UpdateFromCart

## Pagina Principale

Nella homepage del sito, abbiamo utilizzato la stessa grafica esistente (3 Prodotti principali e un Carosello con diversi altri prodotti).
Per gestire al menglio questo sono state create delle costanti (in futuro potrebbero essere espot o tanto altro), in cui l'utente può modificare i partNumber dei prodotti che vuole mostrare e questi si adatteranno.
[THREE_ITEM_GRID e CAROUSEL] in lib-hcl\constants.ts

## Gestione prodotti e colori

Per ogni prodotto se esistenti sono state inserite le varianti del colore. Quindi in base alla scelta selezionata, il prodotto a carello sarà differente.

## MOCK

E' stata aggiunta una semplice gestione di Mock, per permettere di visualizzare il progetto senza un BE e di poter lavorare meglio ai vari problemi.
E' stata aggiunta una variabile di configurazione nel file .env di nome MOCK, la quale può essere inizializzata a "TRUE", questo permetterà di avere le chiamate tramite dei mock creati nel file lib-hcl\hcl\mock-file.ts.
E' anche possibile modificarlo e aggiungere altri mock (modificando la gestione).

## FILE (PDF Study)

Nella Cartella PDF Study sono presenti due file PDF, rispettivamente su:

- Struttura Frontend: uno studio sui nuovi approcci frontend, clientside,serverside o un insieme dei due
- GrapQL: una mini guida iniziale per l'utilizzo di GraphQL

## Running locally

For problem write to f.zuccaro@reply.it (problemi with file in .git and error of symlink on install)

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Shopify store. --> FOR US IS NOT IMPORTANT WE DON'T USE SHOPIFY

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
npm install
npm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

<details>
  <summary>Expand if you work at Vercel and want to run locally and / or contribute</summary>

# Next.js Commerce

A Next.js 13 and App Router-ready ecommerce template featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- React Server Components (RSCs) and Suspense
- Server Actions for mutations
- Edge Runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with Tailwind CSS
- Checkout and payments with Shopify
- Automatic light/dark mode based on system settings
