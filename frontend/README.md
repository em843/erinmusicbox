# Readme

## No longer needed - deployment instructions

GH Actions takes care of this now.

1. `cd frontend`
2. `ng build`
3. Reinstate deleted file `docs/CNAME` which contains just the text "erinmusicbox.com". This is needed for GitHub pages to use the custom domain name.
4. Reinstate deleted file `docs/404.html` by copying `docs/index.html` and renaming it. This is needed for the Angular routing to work.
