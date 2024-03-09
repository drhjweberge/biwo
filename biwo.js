var version="";
biwosURL="biwos.php";
var ar=0;
var ac=0;
var word="";
var cexact="#88f";
var ccont="#ff8";
var empty="#fff";
var cimp="#888";
var imp=Array();
var language=0;
var token="";
var done=false;
var fcancel;
var fok;
var keys_ge="QWERTZUIOPASDFGHJKL YXCVBNM !?";
var keys_en="QWERTYUIOPASDFGHJKL ZXCVBNM !?";

var tt=
{
  "l_version":["",""],
  "l_biwo":["Bible Wordle","Bibel Wordle"],
  "l_changelanguage":["Discard word and change language?","Sprache wechseln und neues Wort raten?"],
  "l_well":["Congratulations!","Herzlichen Glückwunsch!"],
  "l_trynewword":["\nTry new word?","\nNeues Wort versuchen?"],
  "l_nosuccess":["Unfortunately no success\nThe word was\n","Leider nicht geschafft!\nDas Wort war\n"],
  "l_newword":["New word","Neues Wort"],
  "l_reallynewword":["Discard current word\nand load a new one?","Aktuelles Wort verwerfen\nund neues Wort raten?"],
  "l_usedtime":["Used time: ","Benötigte Zeit: "],
  "l_cancel":["Cancel","Abbruch"],
  "l_ok":["Ok","Ok"],
  "l_trycount":["Count of tries","Anzahl Versuche"],
  "l_timeout":["Timeout (More than 1 hour).\Try a new word!","Zeit abgelaufen (über 1 Stunde).\nVersuche ein neues Wort!"],
  "l_wordwas":["The word was: ","Das Wort war: "],
  "l_help":["Find the word with five letters!\n It is a word that appears anywhere in the bible, can also be a place or name.\n"+
            "After completing the five letters press &lt;ENTER> or tip or click on the keyboard enter key (bottom right).\n"+
            "If a letter is not present in the word, the background remains white and the keyboard letter is disabled.\n"+
            "Otherwise the letter is marked yellow if it is at the wrong position or blue if it is at the correct position.\nNot existing words are not rejected.\n"+
            "The solution must be found within 1 hour.",
            "Errate ein Wort mit fünf Buchstaben, das in der Bibel vorkommt!\n Es muss sinnvoll sein, kann auch ein Name oder Ort sein.\n"+
            "Wenn die fünf Buchstaben eingegeben sind (Tastatur, Maus oder Antippen), die &lt;Enter>-Taste drücken bzw. auf das Enter-Symbol unten rechts klicken oder tippen.\n"+
            "Kommt ein Buchstabe nicht vor, bleibt der Hintergrund weiß und dieser Buchstabe wird in der Tastatur gesperrt.\n"+
            "Kommt er vor, ist aber nicht an der richtigen Stelle, wird er gelb markiert. Ist er an der richtigen Stelle, ist die Markierung blau.\n"+
            "Nicht existierende Wörter werden nicht zurückgewiesen!\nDas Lösungswort ist eine Stunde gültig."]
}

function $(id) {return document.getElementById(id);}

function t(lkey) {return tt[lkey][language]!=undefined?tt[lkey][language]:"";}

function setLanguage(lang)
{
  if (lang!=undefined) language=lang;
  $("imen").style.border=language==0?"3px solid #00f":"1px solid black";
  $("imge").style.border=language==1?"3px solid #00f":"1px solid black";
  var all=document.querySelectorAll('[data-lkey]');
  for (var i=0;i<all.length;i++)
  {
    var lkey=all[i].getAttribute("data-lkey");
    if (tt[lkey]!=undefined) all[i].innerHTML=tt[lkey][language];
    else console.log (lkey+" unknown");
  }
}

function changeLanguage(lang)
{
  if (language==lang) return;
  if (ar!=0 && !done) wConfirm(t("l_changelanguage"),function(){language=lang;init();});
  else
  {
    language=lang;
    init();
  }
}

function setKeys()
{
  var keys=language==0?keys_en:keys_ge;
  for (var r=0;r<3;r++)
    for (var c=0;c<10;c++)
    {
      var k=keys[r*10+c];
      if (k==" ") $("k"+r+"_"+c).style.visibility="hidden";
      if (k=="!") k="&#x232b";
      if (k=="?") k="&#x21b5;";
      $("k"+r+"_"+c).innerHTML=k;
    }
}

function p0(n) {return n<10?"0"+n:""+n;}

function formatTime(sec) {return Math.floor(sec/3600)+":"+p0(Math.floor((sec-Math.floor(sec/3600)*3600)/60))+":"+p0(sec%60);}

async function init(mode)
{
  if (mode==1)
  { 
    language=$("language").value;
    $("btnewword").addEventListener("click",newword);
    $("bthelp").addEventListener("click",help);
  }
  done=false;
  version=$("version").value;
  tt["l_version"]=["V "+version,"V "+version];
  setKeys();
  var ll=document.getElementsByClassName("tletter");
  for (var i=0;i<ll.length;i++)
  { 
    ll[i].innerHTML="";
    ll[i].style.backgroundColor=empty;
  }
  var ll=document.getElementsByClassName("kletter");
  for (var i=0;i<ll.length;i++) ll[i].style.backgroundColor=empty;
  imp=[];
  ar=0;
  ac=0;
  activate(0);
  var pr=await fetch(biwosURL+"?action=init&language="+language);
  var res=await pr.json();
    if (res.result=="ok")
    { 
      token=res.token;
      word=res.word;
    }
    else console.log(res);
    setLanguage();
}

function newword()
{
  if (!done) wConfirm(t("l_reallynewword"),init);
  else init();
}

function activate(c)
{
  var ll=document.getElementsByClassName("tletter");
  for (var i=0;i<ll.length;i++) ll[i].style.border="1px solid black";
  var id="l"+ar+"_"+c;
  $(id).style.border="2px solid #0000ff";
  ac=c;
}

function setLetterImp(letter)
{
  if (!imp.includes(letter)) imp.push(letter);
  var ll=document.getElementsByClassName("kletter");
  for (var i=0;i<ll.length;i++) if (letter==ll[i].innerHTML) ll[i].style.backgroundColor=cimp;
}

async function check()
{
  var rel=Array();
  var sample="";
  for (var i=0;i<5;i++) 
  {
    var key="l"+ar+"_"+i;
    if ($(key).innerHTML=="") return;  //check if complete row is set
    sample+=$(key).innerHTML;
    rel.push($(key));
  }
  var pr=await fetch(biwosURL+"?action=check&token="+token+"&sample="+sample+"&try="+ar);
  var res=await pr.json();
    if (res.result!="ok")
    { 
      console.log(res.error);
      if (res.error=="timeout") wAlert(t("l_timeout"));
    }
    else
    {
      for (var i=0;i<res.exact.length;i++) rel[res.exact[i]].style.backgroundColor=cexact;         // mark background as exact
      for (var i=0;i<res.cont.length;i++) rel[res.cont[i]].style.backgroundColor=ccont;            // mark background as containing
      for (var i=0;i<res.imp.length;i++) setLetterImp(res.imp[i]);                                 // mark letters as not used

      if (res.exact.length==5)                                                                     // successfully finished
      {
        done=true;
        wConfirm(t("l_well")+"\n"+
            t("l_trycount")+": "+(ar+1)+"\n"+
            t("l_usedtime")+formatTime(res.time)+"\n"+
            t("l_trynewword"),init);
      }
      else
      {
        if (ar<5)                                                                                  // not last row
        {
          ar++;
          activate(0);
        }
        else                                                                                       // unsuccessfully finished
        {
          done=true;
          wConfirm(t("l_nosuccess")+res.word+t("l_trynewword"),init);                             // tell the solution
        }
      }
    }
}

async function closeWordle()
{
  var pr=await fetch("biwos.php?action=close&token="+token);
  var res=await pr.json();
    if (res.result!="ok") console.log(res);
}

function sel(ob)
{
  if (done) return;
  var r=ob.id.substr(1,1);
  var c=ob.id.substr(3,1);
  if (r==ar) activate(c);
}

function keyDown(e)
{
  if (done || e.ctrlKey || e.altKey) return;
  var key="";
  switch(e.key)
  {
    case "Enter": e.preventDefault();key="!";break;
    case "Backspace": key="?";break;
    case "ArrowRight": key=">";break;
    case "ArrowLeft": key="<";break;
    default:
    {
      if (e.key.length==1 && e.key.toUpperCase()<="Z" && 
      e.key.toUpperCase()>="A") key=e.key.toUpperCase();        // eliminate all but capital letters from A to Z
    }
  }
  doKey(key);
}

function setletter(ob)
{
  if (done) return;
  var key=ob.innerHTML;
  if (ob.id=="k2_8") key="?";          // Backspace
  else if (ob.id=="k2_9") key="!";     // Enter
  doKey(key);
}

function doKey(key)
{  
  if (key=="") return;
  var at=$("l"+ar+"_"+ac);  
  switch(key)
  {
    case "?":                          // Backspace
    { 
      at.innerHTML="";
      if (ac>0) ac--;
      activate(ac);
      break;
    }

    case "!":                          // Enter
      check();
      break;
      
    case ">":                          // Arrow right
    {
      if (ac<4) ac++;
      activate(ac);
      break;
    }  
  
    case "<":                          // Arrow leftt
    {
      if (ac>0) ac--;
      activate(ac);
      break;
    }  
  
    default:
    {
      if(!imp.includes(key))           // Letter A-Z
      {
        at.innerHTML=key;
        if (ac<4) ac++;
        activate(ac);
      }
    }
  }
}

async function showC()
{
  if ($("lversion").innerHTML.charAt(0)!="V")
  {
    $("lversion").innerHTML="V "+$("version").value;
  }
  else
  {
    var pr=await fetch(biwosURL+"?action=getcounts");
    var res=await pr.json();
      if (res.counts) $("lversion").innerHTML=res.counts;
  }
}

function help()
{
  wAlert(t("l_help"));
}

function closeDg()
{
  $("dgmodal").style.display="none";
}

function freturn(){return;}

function wConfirm(msg,ok,cancel)
{
  $("btcancel").style.display="";
  $("btok").style.display="";
  $("btcancel").addEventListener("click",function wCancel(){this.removeEventListener("click",wCancel);closeDg();cancel!=null?cancel():freturn();});
  $("btok").addEventListener("click",function wOk(){this.removeEventListener("click",wOk);closeDg();ok();});
  $("dgmessage").innerHTML=msg.replace(/\n/g,"<br>");
  $("dgmodal").style.display="block";
}

function wAlert(msg)
{
  $("btcancel").style.display="none"
  $("btok").style.display="";
  $("btok").addEventListener("click",function wAl(){this.removeEventListener("click",wAl);closeDg();});
  $("dgmessage").innerHTML=msg.replace(/\n/g,"<br>");
  $("dgmodal").style.display="block";
}
