<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="utf-8">
<script>

function $(id) {return document.getElementById(id);}
function transfer(ob)
{
  var s=ob.options[ob.selectedIndex].innerHTML;
  var tg=$('words');
  ob.remove(ob.selectedIndex);
  var np=document.createElement("OPTION");
  np.innerHTML=s;
  tg.appendChild(np);  
}

function retransfer(wl)
{
  wl.remove(wl.selectedIndex);
}

async function savewl()
{
  var wl=Array();
  var tg=$("words");
  for (var i=0;i<tg.options.length;i++) wl.push(tg.options[i].innerHTML.toUpperCase());
  var fd=new FormData();
  fd.append("words",JSON.stringify(wl));
  var pr=await fetch("biwos_generate.php",{"method":"post","body":fd});
  var js=await pr.json();
  console.log(js);
}

</script>
<title>
  Generate wordlist
</title>
</head>
<body>
  <h1>Generate wordlist</h1>
<?php
// $fn="lutherbibel1912.txt";
$fn="source.txt";
$source=file_get_contents($fn);
// echo mb_strlen($source)."\n";
$s=str_replace([".",",",":",";","!","?","(",")","\""],"",$source);
$s=str_replace("  "," ",$s);

$ar=explode(" ",$s);
// echo "words: ".count($ar)."\n";
$wl=[];
foreach($ar as $a)
{
  $a=trim($a);
  if (mb_strlen($a)==5)
  {
    // if ($a[0]>="A" && $a[0]<="Z")
    {
      $v=true;
      for ($i=0;$i<5;$i++)
      {
        $l=$a[$i];
        $v=($l>="a" && $l<="z") || ($l>="A" && $l<="Z");
        if ($v==false) break;
      }
      if ($v && !in_array($a,$wl)) $wl[]=$a; 
    }
  }
}
sort($wl);
echo "<span><select id='wl' size='30' onclick='transfer(this)' style='width:150px;height:750px;'>\n";
foreach($wl as $w) echo "<option>$w</option>\n";
echo "</select></span>\n";
?>  
&#160;&#160;&#160;
<span>
  <select id='words' size='30' onclick='retransfer(this);' style='width:150px;height:750px;'></select>
</span>
<button id="savewl" onclick="savewl()">Save wordlist</button>
</body>
</html>
