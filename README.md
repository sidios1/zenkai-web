# zenkai.cl

Landing y formulario de contacto de Zenkai. Sitio estático (HTML, CSS y JS sin dependencias) publicado en GitHub Pages con el dominio `zenkai.cl` y HTTPS.

Aplica las normas gráficas de Zenkai v1.0 (`zenkai-marca/normas/`): tema claro Washi/Sumi, Manrope autoalojada, una sola acción Kurenai por página (el botón «Solicitar cotización»), recorte del símbolo en Sen y logos tomados de los SVG maestros sin redibujar.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Landing: hero, servicios, proceso, Zenshin powered by Zenkai, contacto y pie |
| `gracias.html` | Confirmación cuando el formulario se envía sin JavaScript |
| `404.html` | Página no encontrada (GitHub Pages la usa sola) |
| `assets/css/zenkai-tokens.css` | Tokens oficiales, copiados sin cambios de `zenkai-marca/color/` |
| `assets/css/site.css` | Estilos del sitio, solo con variables `--zk-*` |
| `assets/js/contacto.js` | Validación y envío del formulario a Formspree |
| `assets/fonts/` | Manrope variable en WOFF2 y su licencia OFL |
| `assets/img/` | Firmas, respaldo y `og-image.png` (1200 × 630) para redes |
| `CNAME.pendiente`, `.nojekyll` | Dominio propio (se activa al renombrarlo a `CNAME`) y publicación sin Jekyll |

## 1. Conectar el formulario (Formspree)

1. Crea una cuenta en https://formspree.io y un formulario nuevo con el correo que recibirá las solicitudes.
2. Copia el ID del formulario (lo que va después de `/f/`, por ejemplo `xyzabcde`).
3. En `index.html`, reemplaza `FORMSPREE_ID` por ese ID en el atributo `action` del formulario.
4. En el panel de Formspree, agrega `zenkai.cl` en *Restrict to domain* para que nadie use tu formulario desde otro sitio.

Mientras no se reemplace el ID, el formulario muestra «El formulario aún no está conectado» y ofrece el correo.

Reemplaza también `contacto@zenkai.cl` si el correo de contacto será otro (aparece en `index.html` y `assets/js/contacto.js`).

## 2. Publicar en GitHub Pages

```sh
cd site
git init -b main
git add .
git commit -m "Sitio zenkai.cl"
git remote add origin git@github.com:<cuenta>/zenkai-web.git
git push -u origin main
```

En GitHub: *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`.

## 3. Dominio zenkai.cl

1. Verifica el dominio en tu cuenta u organización de GitHub (*Settings → Pages → Add a domain*). Evita que otra cuenta lo reclame.
2. En el DNS del dominio (NIC Chile o el proveedor que administre la zona):

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153 |
| AAAA | `@` | 2606:50c0:8001::153 |
| AAAA | `@` | 2606:50c0:8002::153 |
| AAAA | `@` | 2606:50c0:8003::153 |
| CNAME | `www` | `<cuenta>.github.io` |

3. Renombra `CNAME.pendiente` a `CNAME` (contiene `zenkai.cl`), haz commit y push, y en *Settings → Pages → Custom domain* escribe `zenkai.cl` y guarda. Hazlo solo cuando el DNS ya apunte a GitHub; antes de eso, el sitio se ve en https://sidios1.github.io/zenkai-web/.
4. Cuando GitHub termine de emitir el certificado (de minutos a 24 h), marca **Enforce HTTPS**. Desde ahí, `http://` y `www.zenkai.cl` redirigen a `https://zenkai.cl`.

Los recursos usan rutas relativas y HTTPS, así que el sitio funciona igual en la subruta de github.io y en el dominio, sin contenido mixto.

## Probar en local

```sh
cd site
python3 -m http.server 8000
```

Abre http://localhost:8000.

## Pendientes de la marca que afectan al sitio

- Fotografía real del equipo o capturas de proyectos para el hero (las normas no permiten ilustraciones genéricas; mientras tanto se usa el recorte del símbolo).
- Correo de contacto definitivo.
