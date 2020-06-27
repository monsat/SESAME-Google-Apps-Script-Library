var exports = exports || {};
var module = module || { exports: exports };

var Client = /** @class */ (function () {
  function Client(config) {
    var _this = this;
    this.config = config;
    this.devices = null;
    this.apiUrl = function (path) { return "" + Client.baseUrl + path; };
    this.urlDeviceList = function () { return _this.apiUrl('sesames'); };
    this.urlStatus = function (id) { return _this.apiUrl('sesame/' + id); };
    this.urlControl = function (id) { return _this.apiUrl('sesame/' + id); };
    this.urlActionResult = function (id) { return _this.apiUrl('action-result?task_id=' + id); };
    
    this.authHeader = function () {
      return {
        Authorization: _this.config.apiKey
      };
    };
  }
  Client.prototype.getDeviceList = function () {
    return this.devices || (this.devices =
      JSON.parse(UrlFetchApp.fetch(this.urlDeviceList(), {
        headers: this.authHeader()
      }).getContentText())
    );
  };
  Client.prototype.deviceId = function (n) {
    n = n || 0; // The first device is default
    var devices = this.getDeviceList();
    return devices[n]["device_id"];
  };
  Client.prototype.getStatus = function (device_id) {
    return JSON.parse(
      UrlFetchApp.fetch(this.urlStatus(device_id), {
        headers: this.authHeader()
      }).getContentText());
  };
  Client.prototype.controlDevice = function (device_id, command) {
    return JSON.parse(
      UrlFetchApp.fetch(this.urlControl(device_id), {
        contentType: 'application/json',
        headers: this.authHeader(),
        method: 'POST',
        payload: JSON.stringify({
          command: command
        })
      }).getContentText()
    ).task_id;
  };
  Client.prototype.lock = function (device_id) {
    return this.controlDevice(device_id, 'lock');
  };
  Client.prototype.unlock = function (device_id) {
    return this.controlDevice(device_id, 'unlock');
  };
  Client.prototype.sync = function (device_id) {
    return this.controlDevice(device_id, 'sync');
  };
  Client.prototype.getActionResult = function (task_id) {
    return JSON.parse(
      UrlFetchApp.fetch(this.urlActionResult(task_id), {
        headers: this.authHeader()
      }).getContentText()
    );
  };
  
  // Endpoint
  Client.baseUrl = 'https://api.candyhouse.co/public/';
  
  return Client;
}());
exports.Client = Client;

//'
//https://docs.candyhouse.co/
//  API Document
//  
//https://my.candyhouse.co/#/credentials
//  Get API Keys for your devices
//
//Please enable cloud integration in Sesame app under [Sesame] > [Change Settings].
//  
//USAGE:
//  Resource - Library [add]
//  
//  var client = new Sesame.Client({apiKey: YOUR_AUTH_TOKEN});
//  var results = client.getDeviceList();
//  Logger.log(results);
//  var device_id = client.deviceId();
//  Logger.log(device_id);
//  Logger.log(client.devices);
//  var results = client.getStatus(device_id);
//  Logger.log(results);
//  var task_id = client.controlDevice(device_id, "lock");
//  Logger.log(task_id);
//  var task_id = client.unlock(device_id);
//  Logger.log(task_id);
//  var task_id = client.lock(device_id);
//  Logger.log(task_id);
//  var results = client.getActionResult(task_id);
//  var results = client.getActionResult(task_id);
//  Logger.log(results);
//'
