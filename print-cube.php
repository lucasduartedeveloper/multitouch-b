<!DOCTYPE html>
<html>
<head>

<meta content='width=device-width, initial-scale=0.5, maximum-scale=1.0, user-scalable=0' name='viewport' />

<link rel="stylesheet" href="css/print-cube.css?v22">
<title></title>
</head>
<body>

<p>
      NAME: CUBE #0<br>
      SIZE: 5cm
</p>

<div id="cube-container">
      <div class="fold-bottom"></div>
      <div class="fold-bottom"></div>
      <div class="fold-bottom"></div>

      <!--
      <div class="space"></div>
      <div class="fold-left"></div>
      <div class="fold-up"></div>
      <div class="fold-right"></div>
      <div class="fold-bottom"></div>
      -->
      
      <div class="space"></div>
      <div class="fold-left"></div>
      <img face-id="3"
      src="img/top.png" class="top"/>
      <div class="fold-right"></div>
      <div class="space"></div>

      <div class="fold-left"></div>
      <img face-id="2"
      src="img/left.png" class="left"/>
      <img face-id="0"
      src="img/front.png" class="front"/> 
      <img face-id="4"
      src="img/right.png" class="right"/>
      <div class="fold-right"></div>

      <div class="space"></div>
      <div class="fold-left"></div>
      <img face-id="5"
      src="img/bottom.png" class="bottom"/>
      <div class="fold-right"></div>
      <div class="space"></div>

      <div class="space"></div>
      <div class="fold-left"></div>
      <img face-id="1"
      src="img/back.png" class="back"/>
      <div class="fold-right"></div>
      <div class="space"></div>
      
</div>

<p style="display:none" id="version-info">
     CUBE SCANNER v###
</p>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="script/debug.js?v=0"></script>
<script src="script/print-cube.js?v=0"></script>
<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
</body>
</html> 