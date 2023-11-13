<?php
/*//freemysqlhosting
$host = "sql12.freemysqlhosting.net";
$user = "sql12536093";
$password = "dWR8g8bgMJ";
$dbname = "sql12536093";
$port = "3306";*/

//MySQL
$host = "sql305.infinityfree.com";
$user = "if0_35033672";
$password = "jC4vL41iznqJqc";
$dbname = "if0_35033672_path";
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
    $data = $_POST["data"];


    $sql = "DELETE FROM `path`;";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    for ($n = 0; $n < count($data); $n++) {
        //echo serialize($data[$n]);
        //echo $data[$n]["x"];
        //echo $data[$n]["y"];

        $sql = "INSERT INTO `path` (
            `posX`,
            `posY`,
            `timestamp`
        ) VALUES (
            '[posX]',
            '[posY]',
            '[timestamp]'
        );";
        //echo $sql;

        $posX = $data[$n]["x"];
        $posY = $data[$n]["y"];

        $sql = str_replace("[posX]", $posX, $sql);
        $sql = str_replace("[posY]", $posY, $sql);
        $sql = str_replace("[timestamp]", "", $sql);

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        echo $sql;
    }
} 
else {
    $sql = "SELECT id, posX, posY, timestamp FROM `path`;";

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
