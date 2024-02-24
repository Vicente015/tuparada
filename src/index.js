import { JSDOM } from 'jsdom'
import { fetch } from 'undici'
import Constants from './Constants.js'
import { genRandomUserAgent } from './Utils.js'

const parada = '398'
const randomUserAgent = genRandomUserAgent()

const response = await fetch(
  `${Constants.BASE_API_URL}${Constants.Routes.consulta_tiempo}`,
  {
    // credentials: 'omit',
    body: `paradas=${parada}`,
    headers: {
      // Cookie: 'PHPSESSID=hq1gfa0t43ckkvfg6leugdcs98',
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': randomUserAgent,
      'X-Requested-With': 'XMLHttpRequest'
    },
    method: 'POST',
    referrer: 'https://www.guaguas.com/lineas/proxima-guagua'
    // mode: 'cors'
  }
)

/*
<span id="resp_linea" class="label label-primary center-block">[398] Mesa y López (C.S. Alcaravaneras)</span>
<div class="padding20">
  <table class="table table-hover">
    <thead>
      <tr>
        <th>LINEA</th>
        <th>DESTINO</th>
        <th>LLEGADA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="icono_linea sinmargin colorfondo3">17</span></td>
        <td>TEATRO</td>
        <td>6 min.</td>
      </tr>
      <tr>
        <td><span class="icono_linea sinmargin colorfondo4">25</span></td>
        <td>TEATRO</td>
        <td>8 min.</td>
      </tr>
      <tr>
        <td><span class="icono_linea sinmargin colorfondo2">26</span></td>
        <td>SANTA CATALINA</td>
        <td>12 min.</td>
      </tr>
      <tr>
        <td><span class="icono_linea sinmargin colorfondo4">25</span></td>
        <td>TEATRO</td>
        <td>20 min.</td>
      </tr>
      <tr>
        <td><span class="icono_linea sinmargin colorfondo3">17</span></td>
        <td>TEATRO</td>
        <td>25 min.</td>
      </tr>
    </tbody>
  </table>
  <div class="recarga">
    <div class="progress">
      <div class="progress-bar active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"><span class="sr-only">Recarga automática</span></div>
    </div>
  </div>
</div>

*/

// TODO: Hacer testing con varios datos de prueba reales para asegurar que no pete y de une error sencillito y claro
function procesarDatos (html) {
  const dom = new JSDOM(html)
  const document = dom.window.document

  const respLinea = document.getElementById('resp_linea').textContent
  const [codigoParada, nombreParada] = respLinea.split('] ').map((text) => text.replace('[', ''))

  const tabla = document.querySelector('.table tbody')
  const filas = tabla.querySelectorAll('tr')

  const datos = Array.from(filas).map(fila => {
    const [linea, destino, llegada] = Array.from(fila.querySelectorAll('td')).map(td => td.textContent.trim())
    return { destino, linea, llegada }
  })

  return {
    datos,
    parada: {
      codigo: codigoParada,
      nombre: nombreParada
    }
  }
}

console.debug(
  randomUserAgent,
  response.status, response.headers
)

console.debug('datos procesados:', procesarDatos(await response.text()))
