function include(filename){
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
 }
 
 function render(file,argsObject){
 
   var tmp = HtmlService.createTemplateFromFile(file);
   if(argsObject){
     var keys = Object.keys(argsObject);
     
     keys.forEach(function(key){
       tmp[key] = argsObject[key];
     });
   }//END IF
   
   return tmp.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
 ;  
 
 }