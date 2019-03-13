var req = new XMLHttpRequest();
req.open('GET', '/game.php?screen=overview_villages&mode=units&type=away_detail', false); 
req.send(null);
if(req.status == 200){
  var doc = new DOMParser().parseFromString(req.responseText, "text/html");
  var table = doc.getElementById('units_table');
  var pomoclist = [];
  for (let i=0;i<table.getElementsByClassName('row_a').length;i++){
	try{
		console.log(table.getElementsByClassName('row_a')[i].children[0].children[0].innerText.trim());
		pomoclist.push(table.getElementsByClassName('row_a')[i].children[0].children[0].children[3].innerText);
	}
	catch{
		console.log('blad');
	}
  }
  for (let i=0;i<table.getElementsByClassName('row_b').length;i++){
    try{
       console.log(table.getElementsByClassName('row_a')[i].children[0].children[0].innerText.trim());
       pomoclist.push(table.getElementsByClassName('row_b')[i].children[0].children[0].children[3].innerText);
	}
	catch{
	    console.log('blad');
	}
  }

  var lista = [];
  for (let i=0;i<pomoclist.length;i++){
    var exist = false;
    for (let x=0;x<lista.length;x++){
      if (pomoclist[i] == lista[pomoclist[i]]){
        exist = true;
      }
    }
    if (exist == false){
      if (lista[pomoclist[i]] == undefined){lista[pomoclist[i]] = 0;}
      lista[pomoclist[i]] +=1 ;
    }
  }

  var okienko = "<h2 align='center'>Wysłane wspracia</h2><table width='100%'>";
  okienko += "<tr><th colspan='4'>Plemie</th><th colspan='4'>Liczba Wsprać</th></tr>";
  for (j=0;j<Object.keys(lista).length;j++)
  {
    okienko += "<tr><th colspan='4'>"+Object.keys(lista)[j]+"</th><th colspan='4'>"+lista[Object.keys(lista)[j]]+"</th></tr>";
  }

  okienko+="</table>";
  Dialog.show("okienko_komunikatu",okienko);
}