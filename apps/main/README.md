https://web.dev/how-to-use-local-https/#setup

## Generating a size snapshot

```shell
$ sizr `fd -e css -e js -I  --type file . 'dist/'` > .size-snapshot.txt
```

### Generating PWA image assets

The `pwa-asset-generator` package is great, but the paths are kinda wonky when it writes the HTML and the sitemanifest.

```shell
$ pnpm dlx pwa-asset-generator "./src/assets/logo.svg" \
    -i "index.html" \
    -m "./public/favicons/site.webmanifest" \
    -b "linear-gradient( 45deg, hsl(143deg 24% 19%) 0%, hsl(147deg 19% 27%) 14%, hsl(151deg 16% 35%) 29%, hsl(155deg 14% 44%) 43%, hsl(158deg 14% 54%) 57%, hsl(161deg 19% 63%) 71%, hsl(163deg 29% 73%) 86%, hsl(166deg 49% 83%) 100%)" \
    ./public/img/splash
```
