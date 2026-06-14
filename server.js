/* eslint-disable @typescript-eslint/no-var-requires */


const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000;
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/apps/sis/usuario-rol' || pathname === '/apps/sis/usuario-rol/') {
      app.render(req, res, '/apps/sis/usuario-rol', query)
    } else if (pathname === '/apps/sis/usuarios' || pathname === '/apps/sis/usuarios/') {
      app.render(req, res, '/apps/sis/usuarios', query)
    } else if (pathname === '/apps/sis/seguridad' || pathname === '/apps/sis/seguridad/') {
      app.render(req, res, '/apps/sis/seguridad', query)
    } else if (pathname === '/apps/soporte' || pathname === '/apps/soporte/') {
      app.render(req, res, '/apps/soporte', query)
    } else if (pathname === '/apps/soporte/tickets' || pathname === '/apps/soporte/tickets/') {
      app.render(req, res, '/apps/soporte/tickets', query)
    } else if (pathname === '/apps/soporte/tickets/nuevo' || pathname === '/apps/soporte/tickets/nuevo/') {
      app.render(req, res, '/apps/soporte/tickets/nuevo', query)
    } else if (pathname && pathname.startsWith('/apps/soporte/tickets/') && pathname !== '/apps/soporte/tickets/nuevo/') {
      query.id = pathname.split('/').filter(Boolean).pop()
      app.render(req, res, '/apps/soporte/tickets/[id]', query)
    } else if (pathname === '/apps/soporte/dashboard' || pathname === '/apps/soporte/dashboard/') {
      app.render(req, res, '/apps/soporte/dashboard', query)
    } else if (pathname === '/apps/soporte/notificaciones' || pathname === '/apps/soporte/notificaciones/') {
      app.render(req, res, '/apps/soporte/notificaciones', query)
    } else if (pathname === '/apps/soporte/configuracion' || pathname === '/apps/soporte/configuracion/') {
      app.render(req, res, '/apps/soporte/configuracion', query)
    } else if (pathname === '/apps/cnt/comprobantes' || pathname === '/apps/cnt/comprobantes/') {
      app.render(req, res, '/apps/cnt/comprobantes', query)
    } else if (pathname === '/apps/cnt/comprobantes/nuevo' || pathname === '/apps/cnt/comprobantes/nuevo/') {
      app.render(req, res, '/apps/cnt/comprobantes/nuevo', query)
    } else if (pathname && pathname.startsWith('/apps/cnt/comprobantes/') && pathname !== '/apps/cnt/comprobantes/nuevo/') {
      query.id = pathname.split('/').filter(Boolean).pop()
      app.render(req, res, '/apps/cnt/comprobantes/[id]', query)
    } else if (pathname === '/apps/cnt/reportes/mayor-analitico' || pathname === '/apps/cnt/reportes/mayor-analitico/') {
      app.render(req, res, '/apps/cnt/reportes/mayor-analitico', query)
    } else if (pathname === '/apps/cnt/reportes/movimiento-auxiliar' || pathname === '/apps/cnt/reportes/movimiento-auxiliar/') {
      app.render(req, res, '/apps/cnt/reportes/movimiento-auxiliar', query)
    } else if (pathname === '/apps/cnt/conciliacion' || pathname === '/apps/cnt/conciliacion/') {
      app.render(req, res, '/apps/cnt/conciliacion', query)
    } else if (pathname === '/apps/cnt/conciliacion/carga-banco' || pathname === '/apps/cnt/conciliacion/carga-banco/') {
      app.render(req, res, '/apps/cnt/conciliacion/carga-banco', query)
    } else if (pathname === '/apps/cnt/conciliacion/estados-cuenta' || pathname === '/apps/cnt/conciliacion/estados-cuenta/') {
      app.render(req, res, '/apps/cnt/conciliacion/estados-cuenta', query)
    } else if (pathname === '/apps/cnt/conciliacion/libro-banco' || pathname === '/apps/cnt/conciliacion/libro-banco/') {
      app.render(req, res, '/apps/cnt/conciliacion/libro-banco', query)
    } else if (pathname === '/apps/cnt/conciliacion/configuracion' || pathname === '/apps/cnt/conciliacion/configuracion/') {
      app.render(req, res, '/apps/cnt/conciliacion/configuracion', query)
    } else if (pathname === '/apps/cnt/conciliacion/formatos-banco' || pathname === '/apps/cnt/conciliacion/formatos-banco/') {
      app.render(req, res, '/apps/cnt/conciliacion/formatos-banco', query)
    } else if (pathname && pathname.startsWith('/apps/cnt/conciliacion/')) {
      query.id = pathname.split('/').filter(Boolean).pop()
      app.render(req, res, '/apps/cnt/conciliacion/[id]', query)
    } else if (pathname === '/apps/cnt/procesos/cierre-contable' || pathname === '/apps/cnt/procesos/cierre-contable/') {
      app.render(req, res, '/apps/cnt/procesos/cierre-contable', query)
    } else if (pathname === '/apps/cnt/configuracion' || pathname === '/apps/cnt/configuracion/') {
      app.render(req, res, '/apps/cnt/configuracion', query)
    } else if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
