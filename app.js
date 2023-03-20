const express = require('express');
const oracledb = require('oracledb'); 

var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded


const dbConfig = {
    user: "system",
    password: "admin",
    connectString: "localhost:1521/XE"
};

app.get('/data/sucursal', function(req, res) {
    oracledb.getConnection(
      dbConfig,
      function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
        connection.execute(
          'SELECT * FROM sucusaltable',
          function(err, result) {
            if (err) {
              console.error(err.message);
              doRelease(connection);
              return;
            }
            console.log(result.rows);
            res.json(result.rows);
            doRelease(connection);
        });
    });
});

app.get('/data/prestamo', function(req, res) {
    oracledb.getConnection(
      dbConfig,
      function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
        connection.execute(
          'SELECT * FROM prestamotable',
          function(err, result) {
            if (err) {
              console.error(err.message);
              doRelease(connection);
              return;
            }
            console.log(result.rows);
            res.json(result.rows);
            doRelease(connection);
        });
    });
});

app.post('/add/sucursal', function(req, res) {
    const { id, name, ciudad, activos, region } = req.body;
    oracledb.getConnection(
      dbConfig,
      function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
        connection.execute(
          'EXECUTE add_sucursal(:id, :name, :ciudad, :activos, :region)', {id, name, ciudad, activos, region},
          function(err, result) {
            if (err) {
              console.error(err.message);
              doRelease(connection);
              return;
            }
            console.log(result.rows);
            res.json(result.rows);
            doRelease(connection);
        });
    });
});

app.post('/add/prestamo', function(req, res) {
    const { numprestamo, id, cantidad } = req.body;
    oracledb.getConnection(
      dbConfig,
      function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
        connection.execute(
          'EXECUTE add_prestamo(:numprestamo, :id, :cantidad)', {numprestamo, id,cantidad},
          function(err, result) {
            if (err) {
              console.error(err.message);
              doRelease(connection);
              return;
            }
            console.log(result.rows);
            res.json(result.rows);
            doRelease(connection);
        });
    });
});
  
function doRelease(connection) {
    connection.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
}

app.listen(3000, function () {
    console.log("listening on port 3000.")
})