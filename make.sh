#!/usr/bin/env bash

build="build"
template="html/template.html"
repo="kbensh/benchmarks"

mkdir -p "$build"
cp -r img "$build"
cp -r css "$build"
cp -r js "$build"

updated="$(LANG=en_us_88591; date +'%R'; date +'%m/%d/%Y')"
version=$(curl -s "https://api.github.com/repos/$repo/tags" | jq -r '.[0].name' || echo "0.1"); [ "$version" = "null" ] && version="0.1"
revision=$(curl -s "https://api.github.com/repos/$repo/commits" | jq -r '.[0].sha' | cut -c1-7 || echo "unknown")
commitmsg=$(curl -s "https://api.github.com/repos/$repo/commits/$revision" | jq -r '.commit.message' || echo "unknown")

for md in md/*.md; do
  html=$(basename "$md" .md).html
  pandoc "$md" --standalone --from markdown --to html5 --template="$template" --output "$build/$html"
done

cp html/* build/

buildhtml() {
  pandoc "$1"                           \
    --standalone                        \
    --from html                     \
    --template "$template"              \
    --to html5                          \
    --variable title="kben.sh"          \
    --variable version="$version"       \
    --variable revision="$revision"     \
    --variable updated="$updated"       \
    --variable commitmsg="$commitmsg"   \
    --output "$2"
}

buildhtml "html/index.html" "$build/index.html"

echo "$(date)": "Built website!"
