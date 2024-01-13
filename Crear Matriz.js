// Funcion que crear un archivo con los inputs y outputs de la red neuronal

function crearMatrizRed(idCalculo) {

    //idCalculo = '6995794c';
  
    //importar información base de las matrices que seran consideradas en la base de datos
    const idArchivo = "1T71LqLa1aPsdW84nSJsrLcaGJUPUONepwSIpKfBaWSU"
    let ss = SpreadsheetApp.openById(idArchivo);
    let ws = ss.getSheetByName("CalculoEstacion");  
    let calculoEstacion = ws.getRange(2,1,ws.getLastRow()-1,ws.getLastColumn()).getValues();
  
    let ws2 = ss.getSheetByName("Archivos");  
    let archivos = ws2.getRange(2,1,ws2.getLastRow()-1,ws2.getLastColumn()).getValues();
  
    let datos = calculoEstacion.filter(row => row[1]===idCalculo)
  
    
    // importar sus datos
    datos = datos.map( row =>{ 
        let idx = archivos.findIndex(elements =>{ return elements[0] === row[2]  })
        row.push(...archivos[idx])
        return row
      }
    )
    
    
    //importar todas las matrices con la data cruda a procesar, momentaneamente la voy a desarrollar asi luego ire añadiendo funcionalidades
  
    let sheets;
    let workSheets;
    let matrices = new Array;
    
    datos.forEach(row =>{ 
      const idDrive = row[8];
      sheets = SpreadsheetApp.openById(idDrive);
      workSheets = sheets.getSheetByName("Reporte"); // realizar configuraciones para su importación
      
      matrices.push(workSheets.getRange(15,1,workSheets.getLastRow()-14,3).getValues());
     }
    )
    
    //darme indicadores de que periodos puedo entrenar y que matrices puedo usar para cada periodo
  
    const fechaMin = new Date(Math.max(...datos.map(row=> new Date(row[19])))); //me otorga el min minimorum
    const fechaMax = new Date(Math.min(...datos.map(row=> new Date(row[20]))));
  
   
    const fechas = construirArrayFechas(fechaMin, fechaMax)
    
    const datosGuardar = fechas.map(fecha =>{
          let fila = [fecha];
          matrices.forEach(
            subArray => { 
              let datoEncontrado = subArray.find(item => {
                  const fechaSubArray = new Date(item[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
                  return fechaSubArray.getTime() === fecha.getTime()
               });
  
              if(datoEncontrado){
                fila = fila.concat(datoEncontrado[2]);
              }else{
                fila = fila.concat(['']);
              }}
          )
  
          return fila
  
  
    })
  
    //console.log(datosGuardar)
  
  
    //construir encabezado de los datos
    let encabezado = [['Fechas']];
    datos.forEach( filaEsta =>{
      encabezado[0].push(filaEsta[3]+': '+filaEsta[10])
    }
  
    )
  
    //console.log(encabezado)
  
    //guardar datos en un excel
    const urlDatos = crearSheetdeDatos(encabezado.concat(datosGuardar));
    // console.log(urlDatos)
  
    ws = ss.getSheetByName("Calculo");  
    let calculoDatos = ws.getRange(2,1,ws.getLastRow()-1,1).getValues();
    let indexCal = calculoDatos.findIndex((element) => element[0] === idCalculo)+2;
    //console.log(indexCal)
  
    
    ws.getRange(indexCal,9).setValue(urlDatos)
  
    //Graficar las matrices importadas en unos graficos
    
  }
  
  
  function construirArrayFechas(fechaInicio,fechaFin) {
    //Esta funcion construye fechas un array de fechas apartir de un rango 
    fechaInicio = fechaInicio.getTime();
    fechaFin = fechaFin.getTime();
  
    // Crear un array de milisegundos correspondientes a las fechas
    let milisegundos = Array.from(
      { length: Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) },
      (_, index) => fechaInicio + index * 86400000
    );
  
    // Convertir los milisegundos a fechas
    let fechas = milisegundos.map(ms => new Date(ms));
    return fechas;
  }
  
  // function que borra el excel existente
  function borrarExcelDatos() {
  
  }
  
  function crearSheetdeDatos(datos){
  
  
   var spreadsheet =  SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Or24u14pRc6MKCvMg2XgstLJJunrUo8gtbbvXnTBJ2w/edit#gid=0"); 
   // Crea la hoja de cálculo en la carpeta
   // Copia la hoja en la hoja de cálculo actual
  
   var folder = DriveApp.getFolderById("17MXWoXxp0pfBTBnueWfSZjgxw-YgRS1-");
   var hojaNueva = spreadsheet.copy("Datos N° " + uniqueIDs(7)); 
  
   DriveApp.getFileById(hojaNueva.getId()).moveTo(folder);
  
   var len = datos.length;
   var anc = datos[0].length;
   hojaNueva.getSheetByName("Datos").getRange(11, 1,len, anc).setValues(datos);
   
   return hojaNueva.getUrl()
  
  }
  