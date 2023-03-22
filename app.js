const express = require('express');
const oracledb = require('oracledb'); 
const cors = require('cors')

var app = express();
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

async function connectToDatabase() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "system",
      password: "admin1",
      connectString:  "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 172.22.0.2)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
    });

    console.log("Connected to Oracle Database");

    // Execute database operations here...

  } catch (error) {
    console.log("Error");
    console.error(error.message);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Disconnected from Oracle Database");
      } catch (error) {
        console.error(error.message);
      }
    }
  }
}
connectToDatabase();

const dbConfig = {
    user: "system",
    password: "admin1",
    connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 172.22.0.2)(PORT = 1521))(CONNECT_DATA =(SID= xe)))"
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
          'SELECT * FROM sucursaltable',
          function(err, result) {
            if (err) {
              console.error(err.message);
             
              return;
            }
            console.log(result.rows);
            res.json(result.rows);
         
        });
    });
});

app.get('/data/prestamo/:id', function(req, res) {
    console.log(req.params.id)
    oracledb.getConnection(
      dbConfig,
      function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
        connection.execute(
          'SELECT * FROM prestamotable WHERE idsucursal = :id', { id: req.params.id},
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

app.get('/data/prestamototal/:id', function(req, res) {
  console.log(req.params.id)
  oracledb.getConnection(
    dbConfig,
    function(err, connection) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Connection was successful!');
      connection.execute(
        'SELECT * FROM vista_total_prestamos WHERE idsucursal = :id', { id: req.params.id},
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
          'BEGIN add_sucursal(:id, :name, :ciudad, :activos, :region); END;', { id: id, name: name, ciudad: ciudad, activos: activos, region: region },
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
          'BEGIN add_prestamo(:numprestamo, :id, :cantidad); END;', { numprestamo: numprestamo, id: id, cantidad: cantidad },
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

app.listen(3001, function () {
    console.log("listening on port 3001.")
})
