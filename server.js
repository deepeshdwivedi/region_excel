var fileSystemUtilities=require("fs");
var urlUtilities=require("url");
var pathUtilities=require("path");
var httpServerFactory=require("http");
var formidable=require("formidable");
var excelUtiles=require("./nanp-script");
var httpServer=httpServerFactory.createServer();
function handleAddRequest(request,response){
    var requestURI=urlUtilities.parse(request.url).pathname;
    console.log(requestURI);
    console.log("Method : "+request.method);
    if (request.method == 'POST')
        {
        
    if(requestURI.endsWith("getRegionInXlsx")){
        console.log("in avatar");
        var form = new formidable.IncomingForm();
        form.on("error",function(err){response.end(err);});
        form.on("file",function(name,file){
            if(!file.name.endsWith(".xlsx")){ response.end("Invalid file attached, file should be xlsx file");
        return;}

            var oldPath=file.path;
                    excelUtiles.extractData(oldPath).then(function(result){
                        console.log("dskjdsakjdaskdsk");
                        var numbers=[];
                        result.forEach((e)=>{
                            numbers.push(e[0]);
                        });
                        var regions=excelUtiles.compareNumber(numbers);
                        excelUtiles.pushRegion(oldPath,regions).then((result)=>{
                            response.ContentType = "application/vnd.ms-excel";

                            response.setHeader("content-disposition", "attachment; filename="+file.name);
                            fileSystemUtilities.createReadStream(oldPath).pipe(response).end(()=>{
                                console.log("end is here");
                            });    
    
                        });
                    });
                });
        var queryStringParameters;
        form.parse(request,function(err,fields,files){
            queryStringParameters=fields;
                        });
    }else{
        response.end("invalid request");
    }

    
    


}// if POST condition ends
else{
    response.end("invalid request");
}
}
excelUtiles.readFile().then(function(){
    httpServer.on('request',handleAddRequest);
    httpServer.listen(3000);
    
    console.log("server started and request will be recived on a port :3000 ");

}).catch((error)=>{
console.log("error");
console.log(error);
});
