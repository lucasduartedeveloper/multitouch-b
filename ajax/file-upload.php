<?php
//MySQL
$host = "sql305.infinityfree.com";
$user = "if0_35033672";
$password = "jC4vL41iznqJqc";
$dbname = "if0_35033672_image_data";
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
    $action = !empty($_GET["action"]) ? 
    $_GET["action"] : "none";

    if (!empty($_POST["image"])) {
        $img = $_POST["image"];
        $no = $_POST["no"];

        // base64 to binary
        //$img = str_replace("data:image/png;base64,", "", $img);
        //$img = str_replace(" ", "+", $img);
        //$data = base64_decode($img);

        $data = $img;

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
    else if ($action == "list") {
        $sql = "SELECT *  FROM `picture`;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();
        $result = $stmt->fetchAll(); 

        echo json_encode($result);
    }
    else if ($action == "delete") {
        $sql = "DELETE FROM `picture`;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
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