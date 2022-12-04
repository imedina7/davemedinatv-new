#!/usr/bin/env sh
# abort on errors
set -e
rm -rf dist
# build
yarn build
# navigate into the build output directory
cd dist
cp index.html 404.html

# if you are deploying to a custom domain
echo 'www.davemedina.tv' > CNAME
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:imedina7/davemedinatv-new.git master:gh-pages
cd -