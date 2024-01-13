function uniqueIDs(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  
  
  function calcularPromedio(datos) {
      const suma = datos.reduce((acumulador, valor) => acumulador + valor, 0);
      const promedio = suma / datos.length;
      return promedio;
  }
  
  
  
  function calcularVarianza(datos) {
      const media = calcularPromedio(datos);
      const sumaDiferenciasCuadrado = datos.reduce((acumulador, valor) => acumulador + Math.pow(valor - media, 2), 0);
      const varianza = sumaDiferenciasCuadrado / (datos.length - 1);
      return varianza;
  }
  
  
  function calcularPercentil(arr, percentil) {
    // Ordenar el array de menor a mayor
    arr.sort(function(a, b) {
      return a - b;
    });
  
    // Calcular el índice correspondiente al percentil
    var index = (percentil / 100) * (arr.length - 1);
  
    // Si el índice no es un número entero, realizar interpolación lineal
    if (Number.isInteger(index)) {
      return arr[index];
    } else {
      var lowerIndex = Math.floor(index);
      var upperIndex = Math.ceil(index);
      var lowerValue = arr[lowerIndex];
      var upperValue = arr[upperIndex];
      return lowerValue + (upperValue - lowerValue) * (index - lowerIndex);
    }
  }