
- Functions:
  - `buildCSS()` – injects a `<style>` tag with scoped rules
  - `buildHTML()` – builds the container, arrows, and product cards
  - `wireEvents()` – arrows, favorite hearts
  - `findHeroBanner()` – finds the hero and inserts the block right under it

- If the layout shifts after running, reload or run the cleanup above
```js
document.querySelectorAll('.furkan-scope').forEach(n=>n.remove());
document.getElementById('furkan-carousel-style')?.remove();
```

