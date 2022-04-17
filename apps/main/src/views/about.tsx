import { Meta, Title } from "solid-meta"

import * as styles from "./about.css"

function About() {
  return (
    <section class={styles.aboutPage}>
      <Title>Dicephrase | About</Title>
      <Meta property="og:image" content="/img/dicephrase-og.jpg" />
      <Meta property="og:title" content="Dicephrase | About" />
      <Meta
        property="og:description"
        content="Simple, random, and secure in-browser password generator"
      />
      <Meta property="og:type" content="website" />
      <h1>About</h1>
      <p class={styles.tagline}>
        Simple, accessible, and secure in-browser password generation{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">
          <abbr title="Progressive Web App">PWA</abbr>
        </a>
        .
      </p>

      <h2>Why</h2>
      <p>
        Coming up with strong passwords is tough. Strong passwords fulfill at
        least these 3 criteria.
      </p>
      <ul>
        <li>
          Random — Avoid any personal association (
          <a href="http://www.loper-os.org/bad-at-entropy/manmach.html">
            People are terrible at being random
          </a>
          )
        </li>
        <li>
          Unique — If/when your password is compromised, no other accounts are
          affected
        </li>
        <li>Long — To increase the complexity</li>
      </ul>
      <p>
        Sure, maybe your password manager will generate passwords for you too,
        but this app does{" "}
        <a href="https://en.wikipedia.org/wiki/Unix_philosophy">
          Just One Thing
        </a>
        .
      </p>

      <h2>How</h2>
      <p>
        This app uses the{" "}
        <a href="https://theworld.com/~reinhold/diceware.html">
          diceware method
        </a>{" "}
        to generate passwords.
      </p>
      <p>
        Under the hood, this means we <em>simulate</em> the rolling of dice as
        the source of entropy with the{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues">
          JavaScript web crypto API
        </a>
        .
      </p>
      <p>
        The result of each roll is joined to form a 5 digit numeric key such as{" "}
        <code>63522</code>, which is used to find the corresponding word on{" "}
        <a href="https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt">
          the 2016 <abbr title="Electronic Frontier Foundation">EFF</abbr>{" "}
          wordlist
        </a>
        .
      </p>
      <p>
        Finally, separators are spliced between each word based to your
        settings.
      </p>

      <h2>Privacy</h2>
      <p>Everything happens within your browser</p>
      <ul>
        <li>No cookies or browser storage</li>
        <li>No analytics</li>
        <li>No server-side logic</li>
        <li>
          Strict{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy">
            <abbr title="Content Security Policy">CSP</abbr>
          </a>
        </li>
        <li>
          <a href="https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes#full-strict">
            Full (strict) SSL from Cloudflare
          </a>
        </li>
      </ul>

      <h2>Credit</h2>
      <ul>
        <li>
          <cite>
            <a href="https://securephrase.io">
              Kyle Simpson&#39;s implementation
            </a>
          </cite>
          , which directly inspired this project
        </li>
        <li>
          <cite>
            <a href="https://theworld.com/~reinhold/diceware.html">
              Original Diceware webpage
            </a>
          </cite>
        </li>
      </ul>

      <h2>Tech</h2>
      <ul>
        <li>
          <a href="https://www.solidjs.com/">Solid</a>
        </li>
        <li>
          <a href="https://xstate.js.org/">XState</a>
        </li>
        <li>
          <a href="https://vanilla-extract.style/">Vanilla Extract</a>
        </li>
        <li>
          <a href="https://rescript-lang.org/">ReScript</a>
        </li>
        <li>
          <a href="https://www.typescriptlang.org/">TypeScript</a>
        </li>
        <li>
          <a href="https://vitejs.dev/">Vite</a>
        </li>
        <li>
          <a href="https://vitest.dev/">Vitest</a>
        </li>
        <li>
          <a href="https://playwright.dev/">Playwright</a>
        </li>
        <li>
          <a href="https://esbuild.github.io/">esbuild</a>
        </li>
        <li>
          <a href="https://pnpm.io/">pnpm</a>
        </li>
      </ul>
    </section>
  )
}

export default About
