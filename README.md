https://web.dev/how-to-use-local-https/#setup

## Generating a size snapshot

```shell
$ sizr `fd -e css -e js -I  --type file . 'dist/'` > .size-snapshot.txt
```