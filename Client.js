
(function (exports) {
  var Client = (function() {
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
    Client.prototype.parseWebhookContents = function (e) {
      var results = JSON.parse(e.postData.contents);
      results.state = results.locked ? 'locked' : 'unlocked';
      results.unlocked = !results.locked;
      return results;
    };
    
    // Endpoint
    Client.baseUrl = 'https://api.candyhouse.co/public/';
    
    return Client;
  })();
  
  exports.Client = Client;
})(this);

/**
 * Create Sesame instance
 * @param {Object} config configure object: [apiKey] is required.
 * @return {Sesame} a Sesame client
 */
function create(config) {
  return new Client(config);
}

/**
 * Get the list of devices relates with your Sesame account.
 * @return {Object} Array of devices {device_id, serial, nickname}
 */
function getDeviceList() {
  throw new Error("Please call create method to get instance.")
}
/**
 * Return a device id.
 * @param {Number} key of the device list object (Optional, default is the first device)
 * @return {String} device id
 */
function deviceId(n) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Get lock status
 * @param {String} device id
 * @return {Object}
 */
function getStatus(device_id) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Control a device
 * @param {String} device id
 * @param {String} command: lock/unlock/sync
 * @return {String} task id
 */
function controlDevice(device_id, command) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Unlock a device
 * @param {String} device id
 * @return {String} task id
 */
function unlock(device_id) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Lock a device
 * @param {String} device id
 * @return {String} task id
 */
function lock(device_id) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Sync a device status
 * @param {String} device id
 * @return {String} task id
 */
function sync(device_id) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Get the execution result with original params
 * @param {String} task id
 * @return {Object} results
 */
function getActionResult(task_id) {
  throw new Error("Please call create method to get instance.")
}
/**
 * Parse webhook contents
 * You can also call `Sesame.parseWebhookContents(e)` as a static method
 * @param {String} task id
 * @return {Object} results with original params
 */
function parseWebhookContents(e) {
  var parseWebhookContents = Client.prototype.parseWebhookContents;
  return parseWebhookContents(e);
}

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
//  var client = Sesame.create({apiKey: YOUR_AUTH_TOKEN});
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
//  
//  // Webhook
//  function doGet(e) {
//    var contents = client.parseWebhookContents(e);
//    Logger.log(contents);
//    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
//  }
//  function doPost(e) {
//    var contents = client.parseWebhookContents(e);
//    Logger.log(contents);
//    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
//  }
//'
