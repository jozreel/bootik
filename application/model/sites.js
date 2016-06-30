var simple = require('simple');
var sites = new simple.simplemodel();
sites.modelname = 'sites';
sites.add = function(obj,callback)
{
    this.insertOrUpdate(obj,callback);
}
module.exports = sites;