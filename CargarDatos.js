function obtenerId(rutaArchivo) {

    //rutaArchivo = "Archivos_Files_/f0499525.Ruta.222542.xlsx"
  
    let folder = DriveApp.getFolderById("1Kh_pgQYRvTxNjXUDTo5s6ZN6qCHEoOEe");
    let archivos = folder.getFiles();
    let idArchivo = null;
  
    let nombreArchivo = rutaArchivo.split('/').pop(); // Obtiene el nombre del archivo desde la ruta
  
    while (archivos.hasNext()) {
      let archivo = archivos.next();
      if (archivo.getName() === nombreArchivo) {
        idArchivo = archivo.getId();
        break; // Detener la búsqueda una vez que se encuentre el archivo
      }
    }
  
    console.log(idArchivo)
  
    var [idArchivoNuevo,  nameFile ] = convertirXLSXaGoogleSheet(idArchivo); //convierte el archivo cargado en xlsx
  
    const infoArchivo = {
      IdDrive: idArchivoNuevo,
      nameFile: nameFile,
      Ruta: 'Archivos_Files_/'+nameFile
    }
      
    let info = optenerInfoGeneralArchivoCargado(idArchivoNuevo);
    
    info.forEach(([clave, valor]) => {
      clave = clave.replace(':', '')
      infoArchivo[clave] = valor;
    });
  
    console.log(infoArchivo);
    
    return infoArchivo; // Devolverá el ID del archivo si se encontró, o null si no se encontró
  
  }
  
  // Funcion que importa información general del archivo, para datos del SNIRP
  
  function convertirXLSXaGoogleSheet(fileId) {
    //var fileId = '1FzQEacuml4Lfk0ny8jhVLcb7ss_kbReR'; // ID del archivo XLSX en Google Drive
    var folderId = '1Kh_pgQYRvTxNjXUDTo5s6ZN6qCHEoOEe'; // ID de la carpeta destino en Google Drive
  
    var file = DriveApp.getFileById(fileId);
    var blob = file.getBlob();
  
    var nombreNuevoArchivo = file.getName() + '_convertido'; // Nombre para el nuevo archivo
  
    var folder = DriveApp.getFolderById(folderId);
    var resource = {
      title: nombreNuevoArchivo,
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: [{id: folderId}]
    };
  
    var nuevoArchivo = Drive.Files.insert(resource, blob);
  
    return [nuevoArchivo.getId(), nombreNuevoArchivo]
  }
  
  // optener información importante del archivo cargado
  
  
  function optenerInfoGeneralArchivoCargado(idArchivo){
  
    let ss = SpreadsheetApp.openById(idArchivo);
    let ws = ss.getSheetByName("Reporte");  
    let list1 = ws.getRange(2,1,9,2).getValues();
    let list2 = ws.getRange(15,1,ws.getLastRow()-14,3).getValues();
    const precipitation = list2.map(row => {return row[2]})
   // Fecha Min	Fecha Max	Precipitacion min (mm)	Precipitacion pro (mm)	Precipitacion max (mm)
  
   console.log(typeof(list2[0][0]), list2[0][0])
  
    const moreInfo = [['Fecha Min', new Date(Date.parse(list2[0][0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')))],
                      ['Fecha Max',new Date(Date.parse(list2[list2.length-1][0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'))) ],
                      [	'Precipitacion min',Math.min(...precipitation).toFixed(8)],
                      [ 'Precipitacion pro', calcularPromedio(precipitation).toFixed(8)],
                      ['Precipitacion max',Math.max(...precipitation).toFixed(8)],
                      ['Cantidad de datos',list2.length.toFixed(0)],
                      ['Varianza', calcularVarianza(precipitation)]
    ]
  
    list1 = list1.concat(moreInfo);
    return list1
  
  
  }