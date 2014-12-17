exports.globals = {
    "root": "http://localhost:3000/", 
    "api": "http://localhost:49822/api/"
} 


exports.containsString = function containsString(original, search)
{
    return original.toLowerCase().indexOf(search.toLowerCase()) > -1;
}


exports.handleAlerts = function handleAlerts(req) 
{
    var alert = req.session.alert;
    req.session.alert = null;
    return alert;
};