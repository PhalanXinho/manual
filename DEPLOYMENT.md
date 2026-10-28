# Publicación del manual

Sitio: https://phalanxinho.github.io/manual/

Repositorio: https://github.com/PhalanXinho/manual

## Actualizar el sitio

Edita las fuentes del manual en `chapters/`, `README.md`, `SUMMARY.md`,
`assets/`, `img/` o `_layouts/`. Desde esta carpeta ejecuta:

```powershell
git add .
git commit -m "Actualizar manual"
git push
```

Cada push a `main` ejecuta `.github/workflows/pages.yml`. GitHub instala las
dependencias con `npm ci`, genera el HTML con `npm run build` y publica el
contenido de `_book/` en GitHub Pages. La URL del sitio se mantiene.

Puedes seguir el resultado en:
https://github.com/PhalanXinho/manual/actions

El flujo también se puede ejecutar manualmente desde la pestaña Actions,
seleccionando **Publish manual** y **Run workflow**.

`_book/` es una carpeta generada y permanece fuera de Git. Edita las fuentes:
los cambios hechos directamente en `_book/` se reemplazan al compilar.

## Vista previa local

```powershell
npm ci
npm run serve
```

Para generar el HTML sin iniciar el servidor:

```powershell
npm run build
```

## Configuración de GitHub Pages

En **Settings > Pages > Build and deployment**, el origen es **GitHub Actions**.
El despliegue utiliza el entorno `github-pages` y los permisos temporales de
GitHub Actions; no necesita guardar un token personal en el repositorio.
