# Text Templater

A plain text to form field generator. This app is designed to take in some plain text with some special syntax, process it, and create some for form fields for users to fill out. Once the user has filled out the fields, they can click generate, and it'll use the inputs to replace the special syntax in the plain text for output.

This is primarily designed for RpNation's BBCode community as a generic templater solution. Due to the language agnostic nature of the syntax, it should work for pratically any plain text use case.

## Development Roadmap/TODOs

- [ ] Add local save/cache recovery

### Possible Future Changes

- [ ] Consider Live Preview

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Technologies used

- Next.js (14)
  - SSR + ISR
- Tailwindcss (and minor custom styles)
- Shadcn/ui
- MDX
- lucide icons
- Vercel for hosting and deployment
