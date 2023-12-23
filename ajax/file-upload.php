<?php
//MySQL
$host = "sql106.epizy.com";
$user = "epiz_34032581";
$password = "0MG7uNyyYk";
$dbname = "epiz_34032581_image_data";
$port = "3306";

try{
    //Set DSN data source name
    $dsn = "mysql:host=" . $host . ";port=" . $port .";dbname=" .  $dbname . ";user=" . $user . ";password=" . $password . ";";

    //create a pdo instance
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

try { 
    if (!empty($_POST["image"])) {
        $img = $_POST["image"];
        $no = $_POST["no"];

        $img = str_replace("data:image/png;base64,", "", $img);
        $img = str_replace(" ", "+", $img);
        $data = base64_decode($img);

        $sql = "DELETE FROM `picture` WHERE track=".$no.";";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        $sql = "INSERT INTO `picture` (
           `track`,
           `data`
         ) VALUES (
            '[track]',
            '[data]'
         );";
        //echo $sql;

        $sql = str_replace("[track]", $no, $sql);
        $sql = str_replace("[data]", $data, $sql);

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        echo $sql;
    }
    else {
        $sql = "SELECT *  FROM `picture`;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();
        $result = $stmt->fetchAll(); 

        echo json_encode($result);
    }
}
catch (PDOException $e) {
   echo 'Connection failed: ' . $e->getMessage();
   echo $sql;
}
catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
    echo $sql;
}
?>