<?php
/*//freemysqlhosting
$host = "sql12.freemysqlhosting.net";
$user = "sql12536093";
$password = "dWR8g8bgMJ";
$dbname = "sql12536093";
$port = "3306";*/

//MySQL
$host = "sql106.epizy.com";
$user = "epiz_34032581";
$password = "0MG7uNyyYk";
$dbname = "epiz_34032581_image_data";
$port = "3306";

try{
  //Set DSN data source name
  $dsn = "mysql:host=" . $host . ";port=" . $port .";dbname=" . $dbname . ";user=" . $user . ";password=" . $password . ";";

  //create a pdo instance
  $pdo = new PDO($dsn, $user, $password);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
  $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
die('Connection failed: ' . $e->getMessage());
}

$action = $_POST["action"];

if (isset($_POST["action"])) {
    $track = $_POST["track"];
    $data = $_POST["data"];

    $sql = "DELETE FROM `image` WHERE track=".$track.";";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $sql = "INSERT INTO `image` (
        `track`,
        `data`
    ) VALUES (
        '[track]',
        '[data]'
    );";
    //echo $sql;

    $sql = str_replace("[track]", $track, $sql);
    $sql = str_replace("[data]", $data, $sql);

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo $sql;
} 
else if (isset($_GET["count"])) {
    $count = $_GET["count"];
    $sql = "SELECT id, track, data, timestamp FROM image ORDER BY timestamp DESC LIMIT ".$count.";";

    try{
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $rowCount = $stmt->rowCount();
    $result = $stmt->fetchAll(); 
    }
    catch (PDOException $e) {
        die($e->getMessage());
    }

    echo json_encode($result);
}
?>
