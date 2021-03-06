SESAME-Google-Apps-Script-Library
=================================

SESAME APIs Library for Google Apps Script

APP ID
------

```
MhGyvaXUzLZgSUv835brogVVeyfhHcqFG
```

USAGE
-----

### Select Resources > Libraries...

［リソース］ー［ライブラリ…］ を選択します。

### Input APP ID into the **Add a Library** text box.

**Add a Library** に上記の APP ID を入力し追加します。

### Select a version.

利用するバージョンを選択します。

### Change Identifier as you like.

Examples use **Sesame**.

Identifierの欄に任意の名称を入力します。
下記の例では「Sesame」とした場合の記述例となります。

### Coding

#### Device list : 機器一覧

アカウントに紐付いたSESAMEの一覧を取得します。
`YOUR_AUTH_TOKEN` には、最下部のリンク先で取得した `API Key` を文字列で指定してください。

```js
var client = Sesame.create({apiKey: YOUR_AUTH_TOKEN});
var results = client.getDeviceList();
Logger.log(results);
```
戻り値はオブジェクトの配列（デバイス数）です。
Statusの取得や機器の操作（施錠・解錠）時に `device_id` が使われます。

#### Device ID : デバイスID

利用している機器がひとつだけの場合は、次のような記述で `device_id` を取得できます。
（複数ある場合も引数に数値で指定可能）

```js
var device_id = client.deviceId();
Logger.log(device_id);
Logger.log(client.devices);
```

#### Status

指定した機器の状態（施錠・解錠）を取得します。

```js
var results = client.getStatus(device_id);
Logger.log(results);
```

#### Control : 機器の操作

`lock` `unlock` `sync` の操作（コマンドの実行）ができます。
`controlDevice()` の第2引数でコマンドを指定するか `lock()` `unlock()` を使用してください。

戻り値は `task_id` です。

```js
var task_id = client.controlDevice(device_id, "lock");
Logger.log(task_id);

var task_id = client.unlock(device_id);
Logger.log(task_id);

var task_id = client.lock(device_id);
Logger.log(task_id);
```

#### Action Result : 実行結果

実行した操作の結果を取得します。
実行直後の `status` は `processing` となり、実行完了後は `terminated` が返ります。

```js
var results = client.getActionResult(task_id);
Logger.log(results);
```

#### Webhook Contents : Webhookのコンテンツ

Webhook 利用時に受け取ったコンテンツを整形して返します。

```js
function doPost(e) {
  var contents = client.parseWebhookContents(e);
  Logger.log(contents);
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}
```

* 整形後のキー（太字は送信されてくるものと同一）
  * **device_id** : string
  * **locked** : boolean
  * state : `locked` or `unlocked`
  * unlocked : boolean


## Links

### API Document

https://docs.candyhouse.co/

### Get API Keys for your devices

https://my.candyhouse.co/#/credentials
