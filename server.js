var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  delete: function(id) {
    var storageitems = this.items;
    storageitems.map(function(item, index) {
      if (item.id == id)
      storageitems.splice(index, 1);
  });
},
  edit: function(id, name) {
    var storageitems = this.items;
    var returnindex;
    storageitems.map(function(item, index) {
      if (item.id == id) {
        item.name = name;
        returnindex = index;
      }
    });
    return returnindex;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
};

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {
  if(!('id' in request.params)) {
    return response.sendStatus(400);
  }

  var item = storage.delete(request.params.id);
  response.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {
  if (!('id' in request.params) || !('name' in request.body)) {
    return response.sendStatus(400);
  }


  var item = storage.edit(request.params.id, request.body.name);
  if (item) return response.status(200).json(item);
  else {
    var newitem = storage.add(request.body.name);
    return response.status(201).json(newitem);
  }

});

app.listen(process.env.PORT || 8080, process.env.IP);
