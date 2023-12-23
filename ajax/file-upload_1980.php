<?php
$sql ="";
try {
    $currentDir = getcwd();
    $uploadDirectory = 
    "multitouch-b/picture-database/img/picture-database/";

    echo $_SERVER["DOCUMENT_ROOT"];

    if (!empty($_POST["image"])) {
        $img = $_POST["image"];
        $no = $_POST["no"];

        $img = str_replace("data:image/png;base64,", "", $img);
        $img = str_replace(" ", "+", $img);
        $data = base64_decode($img);

        $file = $_SERVER["DOCUMENT_ROOT"] . "/" . 
        $uploadDirectory . "picture-" . $no . ".png";

        $success = file_put_contents($file, $data);
        print $success ? $file." saved." : "Unable to save the file.";
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