<?php
$dbname="biwo.dat";
$cfile="counter.txt";
$maxtime=3600;                                                           // max time 1 h
$actions=["init","check","close","getcounts"];
extract($_GET);
$l=isset($language)?$language:0;
$action=isset($action)?$action:"init";
$ti=time();
$token=isset($token)?$token:hash("SHA256",$ti);                          // extract or create unique token
$res=['result'=>'error','error'=>"no valid action"];
if (in_array($action,$actions))
{
  $db=file_exists($dbname)?json_decode(file_get_contents($dbname),true):[];
  foreach($db as $k=>$d) 
    if (($ti-$d['time'])>$maxtime) unset($db[$k]);                       // delete old records

  switch($action)
  {
    case "init":
    {
      $fn=$l==0?"wordlist_en.txt":"wordlist_ge.txt";                     // get the language wordlist
      $wl=[];
      $word="";
      if (file_exists($fn)) $wl=json_decode(file_get_contents($fn),true);
      if (count($wl)>2) $word=$wl[rand(0,count($wl)-1)];                 // get a random word
      $db[$token]=['time'=>$ti,'word'=>$word];                           // store time and solution
      increaseCounter();
      $res=['result'=>"ok",'error'=>"",'token'=>$token,'time'=>$ti];     // create result record
      break;
    }

    case "check":
    {
      $res=['result'=>"error",'error'=>"incorrect request"];
      $sample=isset($sample)?$sample:"";
      if (!isset($db[$token]))$res['error']="timeout";
      else
      {
        $word=$db[$token]['word'];
        $ttime=isset($db[$token])?$db[$token]['time']:"";
        $try=isset($try)?$try:-1;
        if (strlen($word)==5 && strlen($sample)==5 && $try>=0 && $try<6)
        {
          $exact=[];
          $cont=[];
          $imp=[];
          $present=[];
        
          for ($i=0;$i<5;$i++) if ($sample[$i]==$word[$i])            // check for exact positioned letters
          {
            if (!in_array($word[$i],$present)) $present[]=$word[$i];  // mark letters of the sample 
                                                                      // that are part of the solution(=$word)
            $exact[]=$i;                                              // write index to exact array
            $word[$i]="-";                                            // mark letter position as checked
          }

          for ($i=0;$i<5;$i++) if (!in_array($i,$exact))              // check for letters in wrong position
            for ($e=0;$e<5;$e++) 
              if ($sample[$i]==$word[$e])
              {
                $cont[]=$i;                                           // store position
                if (!in_array($word[$e],$present)) $present[]=$word[$e];
                $word[$e]="-";
                break;
              }

          for ($i=0;$i<5;$i++) 
            if (!in_array($sample[$i],$present) && !in_array($sample[$i],$imp)) 
              $imp[]=$sample[$i];                                     // get not used letters in $imp

          $res=['result'=>"ok",'error'=>"",                           // create result report
                'exact'=>$exact,'cont'=>$cont,'imp'=>$imp,            // with exact, containing and not used letters
                'time'=>time()-$db[$token]['time']];                  // return also time difference from beginning

          if ($try==5 || count($exact)==5)                            // game over
          { 
            $res['word']=$db[$token]['word'];                         // report solution
            unset($db[$token]);                                       // delete record
          }
        }
      }

      break;
    }

    case "close":
    {
      if (isset($db[$token])) unset($db[$token]);
      $res=['result'=>'ok','error'=>""];
      break;
    }

    case "getcounts":
    {
      $n=file_get_contents($cfile);
      $res['counts']=intval($n);
    }
  }
  file_put_contents($dbname,json_encode($db));                       // sava data
}
header("Content-Type: application/json");
echo json_encode($res);

function increaseCounter()
{
  global $cfile;
  $counter=file_exists($cfile)?intVal(file_get_contents($cfile)):0;  // increase counter
  file_put_contents($cfile,($counter+1));
}
?>
