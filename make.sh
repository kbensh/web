#!/usr/bin/env bash
set -x

build="build"
template="html/template.html"
repo="kbensh/koala"

mkdir -p "$build"
cp -r img "$build"
cp -r css "$build"
cp -r js "$build"
cp -r txt "$build"

updated="$(LANG=en_us_88591; date +'%R'; date +'%m/%d/%Y')"
version=$(curl -s "https://api.github.com/repos/$repo/tags" | jq -r '.[0].name' || echo "0.1"); [ "$version" = "null" ] && version="0.1"
revision=$(curl -s "https://api.github.com/repos/$repo/commits" | jq -r '.[0].sha' | cut -c1-7 || echo "unknown")
commitmsg=$(curl -s "https://api.github.com/repos/$repo/commits/$revision" | jq -r '.commit.message' || echo "unknown")
logo=$(<./txt/koala.txt)

buildthing() {
  # suffix is .md build from markdown
  case "$1" in
    *.md)  from=markdown ;;
    *.html) from=html ;;
    *) echo "Unknown file type: $1"; exit 1 ;;
  esac

  pandoc "$1"                           \
    --standalone                        \
    --from "$from"                      \
    --template "$template"              \
    --to html5                          \
    --variable title="kben.sh"          \
    --variable logo="$logo"             \
    --variable version="$version"       \
    --variable revision="$revision"     \
    --variable updated="$updated"       \
    --variable commitmsg="$commitmsg"   \
    --output "$2"
}

buildthing "html/index.html" "$build/index.html"
buildthing "md/data.md"      "$build/data.html"
buildthing "md/benchmarks.md" "$build/benchmarks.html"

echo "$(date)": "Built website!"
