var url = "https://docs.google.com/spreadsheets/d/1T71LqLa1aPsdW84nSJsrLcaGJUPUONepwSIpKfBaWSU/edit#gid=0"; //SheetUrl
var Route = {};
Route.path = function(route,callback){
   Route[route] = callback;
}

function doGet(e){
  
    Route.path("form",loadForm);
    Route.path("table",loadTable);
    
    if(Route[e.parameters.v]) {
      return Route[e.parameters.v]();
    } else {
      return render("home");
    }
  
    
  }
  