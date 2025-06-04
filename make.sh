#!/usr/bin/env bash
set -euo pipefail
set -x

build="build"
src="html/index.html"
dest="$build/index.html"
repo="kben-sh/benchmarks"

mkdir -p "$build"
cp -r img "$build"
cp -r css "$build"
cp -r js "$build"

header_content=$(<"header.html")
footer_content=$(<"footer.html")
updated="$(LANG=en_us_88591; date +'%R'; date +'%m/%d/%Y')"
version=$(curl -s "https://api.github.com/repos/$repo/tags" | jq -r '.[0].name' || echo "0.1"); [ "$version" = "null" ] && version="0.1"
revision=$(curl -s "https://api.github.com/repos/$repo/commits" | jq -r '.[0].sha' | cut -c1-7 || echo "unknown")
commitmsg=$(curl -s "https://api.github.com/repos/$repo/commits/$revision" | jq -r '.commit.message' || echo "unknown")

for md in md/*.md; do
  html=$(basename "$md" .md).html
  pandoc "$md" --standalone --from markdown --to html5 --output "$build/$html"
done

pandoc "$src"                         \
  --standalone                        \
  --from html                         \
  --template "$src"                   \
  --to html5                          \
  --variable title="benchmarks.sh"    \
  --variable version="$version"       \
  --variable revision="$revision"     \
  --variable updated="$updated"       \
  --variable commitmsg="$commitmsg"   \
  --output "$dest"
