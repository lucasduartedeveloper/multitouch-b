<?php
$sql ="";
try {
    header("Access-Control-Allow-Origin: *");
    //header("Content-Type: text/plain");
    if (isset($_GET["id"])) {
        $id = $_GET["id"];
    }
    if (isset($_GET["url"])) {
        $url = $_GET["url"];
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
<!-- PHP -->
<!DOCTYPE html>
<html>
<head>
<title></title>
</head>
<body>
<div id="content">content</div>
<script>
    var id = parseInt("<?php echo $id ?>");
    var url = "<?php echo $url ?>";
    var elem = document.getElementById("content");
    elem.innerText = "<?php echo $url ?>";

    var ajax = function(url, callback) {
        // Create an XMLHttpRequest object
        var xhttp = new XMLHttpRequest();

        // Define a callback function
        xhttp.onload = function() {
            callback(this.responseText);
        }

        // Send a request
        xhttp.open("GET", url);
        xhttp.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36");
        xhttp.send();
    };

    window.onload = function() {
        console.log("loaded");
        var text = "http://localhost:8070/http-get.php?url="+
        url;
        ajax(text, function(data) {
            var obj = {
                id: id,
                data: data
            };
            window.parent.postMessage(obj, "*");
        });
    };
</script>
<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
</body>
</html> 