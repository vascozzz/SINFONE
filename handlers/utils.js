exports.globals = {"root":"http://localhost:3000/"}


exports.containsString = function containsString(original, search)
{
    return original.toLowerCase().indexOf(search.toLowerCase()) > -1;
}

exports.handleAlerts = function handleAlerts(req) {
    var alert = req.session.alert;
    req.session.alert = null;
    return alert;
};