<!DOCTYPE html>
<?php $version="0.0.7";
// Author Dr. H.-J. Weber
// programmed 14.02.2024
// Last update 19.02.2024
$counter=file_exists("counter.txt")?intVal(file_get_contents("counter.txt")):0;
file_put_contents("counter.txt",($counter+1));
?>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="utf-8">
<style>
  body {font-family:sans-serif,helvetica,arial;box-sizing: border-box;background-color:#aaa;}
  #try {width:350px;height:430px;padding:10px;border:black solid 1px;display:grid;grid:auto/auto auto auto auto auto;grid-gap:15px;background-color:#777}
  #keys {width:350px;height:130px;padding:10px 10px 0px 10px;border-right:1px solid black;border-left:1px solid black;display:grid;grid:40px 40px 40px auto/auto auto auto auto auto auto auto auto auto auto;grid-gap:5px;background-color:#bbb;}
  #foot {width:350px;padding:10px;border-right:1px solid black;border-left:1px solid black;border-bottom:1px solid black;background-color:#bbb}
  #bthelp {width:50px;}
  #footright {float:right;}
  #lversion {font-size:6pt;}
  #dgmodal {display:none;position:fixed;z-index:1;padding-top:100px;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4);}
  #dgbody {background-color:#fefefe;margin:12px;padding:20px;border:2px solid black;width:320px;}
  .tletter {width:50px;height:50px;padding:0px 0px 5px 0px;background-color:#dddddd;border:black solid 1px;cursor:pointer;font-weight:bold;font-size:32pt;text-align:center;}
  .kletter {width:19px;height:19px;padding:5px;background-color:#eee;border:1px solid black;cursor:pointer;}
</style>
<script src="biwo.js"></script>
<title data-lkey="l_biwo"></title>
</head>
<body onload="init(1)" onkeydown="keyDown(event)">
<h1 data-lkey="l_biwo" style="display:inline-block;"></h1>&#160;&#160;&#160;&#160;<img src="fl_e.svg" id="imen" onclick="changeLanguage(0)">&#160;&#160;<img src="fl_d.svg" id="imge" onclick="changeLanguage(1)">
<div id="try">
<?php
  for ($r=0;$r<6;$r++)
    for ($c=0;$c<5;$c++)
      echo "<div class='tletter' id='l$r"."_"."$c' onclick='sel(this)'></div>\n";
  echo "
</div>
<div id=\"keys\">\n";

  for ($r=0;$r<3;$r++)
    for ($c=0;$c<10;$c++)
      echo "<div class='kletter' id='k$r"."_"."$c' onclick='setletter(this)'></div>\n";
  echo "</div>\n<div id=\"foot\"><button type=\"button\" id=\"btnewword\" data-lkey=\"l_newword\"></button>\n";
  echo "<span id=\"footright\"><button type=\"button\" id=\"bthelp\">?</button>\n<span id=\"lversion\" data-lkey=\"l_version\"></span>\n</span></div>\n";
?>
<div id="dgmodal">
  <div id="dgbody">
    <p id="dgmessage"></p>
    <div style="float:right;">
      <button id="btcancel" data-lkey="l_cancel"></button>&#160;&#160;&#160;&#160;&#160;
      <button id="btok" data-lkey="l_ok"></button>
    </div>
    <div>&#160;</div>
  </div>
</div>
<?php
  echo "<input type=\"hidden\" id=\"language\" value=\"".(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'],0,2)=="de"?"1":"0")."\">\n";
  echo "<input id=\"version\" type=\"hidden\" value=\"$version\">\n";
?>
</body>
</html>
