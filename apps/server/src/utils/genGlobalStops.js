import fs from 'fs'

const transformData = (data) => {
  return data.kml.Document.Placemark.map((placemark, index) => {
    const idMatch = placemark.description.__cdata.match(/id=(\d+)/) // Extrae el ID del enlace
    const [longitude, latitude] = placemark.Point.coordinates.split(',')
      .map((coord) => coord.trim()) // Divide las coordenadas
    return {
      id: idMatch != null ? idMatch[1] : `unknown-${index}`,
      name: placemark.name.b,
      latitude,
      longitude
    }
  })
}
fs.readFile(
  '../data/paradasGlobal_xml.json',
  'utf8',
  (err, data) => {
    if (err != null) {
      console.error('Error leyendo el archivo:', err)
      return
    }
    try {
      const jsonData = JSON.parse(data)
      const transformedData = transformData(jsonData)
      fs.writeFile(
        '../data/paradasGlobal.json',
        JSON.stringify(transformedData, null, 2),
        (writeErr) => {
          if (writeErr != null) {
            console.error(
              'Error escribiendo el archivo:',
              writeErr
            )
          } else {
            console.log('Archivo transformado guardado')
          }
        }
      )
    } catch (error) {
      console.error('Error procesando el JSON:', error)
    }
  }
)
