// ==UserScript==
// @name         [DEV] Plemiona UI by Gorlik
// @version      6.66
// @description  Dodatkowe informacje na głównym ekranie wioski w grze plemiona.pl
// @author       Gorlik
// @match        https://*.plemiona.pl/game.php?*
// @grant        none
// @updateURL   https://github.com/gorlik1337/PlemionaUI/raw/master/dev.user.js
// @downloadURL https://github.com/gorlik1337/PlemionaUI/raw/master/dev.user.js
// ==/UserScript==



function core() {
    if (localStorage['GorlikUI'] == undefined){
        localStorage['GorlikUI'] = JSON.stringify({"showSupport": true, "showSettings": true, "enableScaling": false, "autoRaportDelete": false});
    }
    DATABASE = JSON.parse(localStorage['GorlikUI']);

    // URLGET
    let x = window.location.search.replace('?', '').split('&'); 
    URLGET = {};
    for (let i = 0; i < x.length; i++) {URLGET[x[i].split('=')[0]] = x[i].split('=')[1];}    


    function createHelper(){
        let obj = document.getElementById('show_prod').cloneNode(true);
        obj.id="show_plemionaui_helper";
        obj.getElementsByClassName("head")[0].innerHTML = "PlemionaUI - Helper";
        for (var i = 0; 0 < obj.getElementsByTagName("tr").length; i++) {
            obj.getElementsByTagName("tr")[0].remove();
        }
        document.getElementById('show_prod').parentElement.prepend(obj);
    }
    function addHelperLine(value, text, iconurl = 'https://help.plemiona.pl/images/9/94/Ch%C5%82op.png'){
        let tr = document.createElement("tr");
            tr.className = "nowrap";
            let td = document.createElement("td");

                td.id = text.replace(/\s/g, '')+'_plemionaui';
                let img = document.createElement("img");
                    img.setAttribute("src", iconurl);
                    img.setAttribute("style", "vertical-align: middle");
                let wartosc = document.createElement('strong');
                    wartosc.innerText = " "+value+" ";
                let tekst = document.createTextNode(text);
                td.appendChild(img);
                td.appendChild(wartosc);
                td.appendChild(tekst);
            tr.appendChild(td);
        document.getElementById('show_plemionaui_helper').getElementsByTagName('tbody')[0].appendChild(tr);
    }
    function addHelperLineURL(text, url, iconurl = 'https://help.plemiona.pl/images/9/94/Ch%C5%82op.png'){
        let tr = document.createElement("tr");
            tr.className = "nowrap";
            let td = document.createElement("td");
                let img = document.createElement("img");
                    img.setAttribute("src", iconurl);
                    img.setAttribute("style", "vertical-align: middle");
                let link = document.createElement('a');
                link.setAttribute("href", url);
                link.innerText = " "+text;
                td.appendChild(img);
                td.appendChild(link);
            tr.appendChild(td);
        document.getElementById('show_plemionaui_helper').getElementsByTagName('tbody')[0].appendChild(tr);
    }
    function addHelperScript(text, url, iconurl = 'https://help.plemiona.pl/images/9/94/Ch%C5%82op.png'){
        let tr = document.createElement("tr");
        tr.className = "nowrap";
        let td = document.createElement("td");
            let img = document.createElement("img");
                img.setAttribute("src", iconurl);
                img.setAttribute("style", "vertical-align: middle;");
            let link = document.createElement('a');
            link.setAttribute("onclick", "$.getScript('"+url+"');");
            link.setAttribute("style", "cursor: pointer;");
            link.innerText = " "+text;
            td.appendChild(img);
            td.appendChild(link);
        tr.appendChild(td);
        document.getElementById('show_plemionaui_helper').getElementsByTagName('tbody')[0].appendChild(tr);
    }
    function doublezero(x){if (x<10){return "0"+x;}else{return ""+x;}}
    function betterDisplayTime(time){
        let h = Math.floor(time);
        let m = Math.round((time - h) * 60);
        return h+":"+doublezero(m);
    }
    function fixLetterNumber(input){
        if (input.includes('K')){
            input.replace('K', '');
            input = parseFloat(input)*1000;
        }
        return parseInt(input);
    }
    // start ~ wioska początkowa (twoja)  end ~ wioska docelowa
    function countRoad(startx, starty, endx, endy){
        let a =  Math.abs(parseInt(startx) - parseInt(endx));
        let b = Math.abs(parseInt(starty) - parseInt(endy));
        return Math.round(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) *100) / 100;
    }
    function unitSpeedCount(distanse, unitspeed){
        let x = distanse * unitspeed;
        let h = Math.floor(x / 60);
        let min = Math.round(x - (h*60));
        return doublezero(h)+':'+doublezero(min)+':00';
    }


/*głowny ekran wioski*/
//if (document.URL.includes('screen=overview')){
if (URLGET['screen'] == 'overview'){
    /*storage speed*/
    const sury_speed_tab = document.getElementById('show_prod').getElementsByTagName('table')[0];
    const sury_speed_drewno = parseInt(sury_speed_tab.children[0].children[0].children[1].children[0].innerText.replace('.', ''));
    const sury_speed_glina = parseInt(sury_speed_tab.children[0].children[1].children[1].children[0].innerText.replace('.', ''));
    const sury_speed_zelazo = parseInt(sury_speed_tab.children[0].children[2].children[1].children[0].innerText.replace('.', ''));
    const drewno = fixLetterNumber(document.getElementById('wood').innerText);
    const glina = fixLetterNumber(document.getElementById('stone').innerText);
    const zelazo = fixLetterNumber(document.getElementById('iron').innerText);
    const storage = fixLetterNumber(document.getElementById('storage').innerText);
    var drewno_czas = betterDisplayTime((storage - drewno) / sury_speed_drewno);
    var glina_czas = betterDisplayTime((storage - glina) / sury_speed_glina);
    var zelazo_czas = betterDisplayTime((storage - zelazo) / sury_speed_zelazo);

    // link to map
    const worldcode = document.URL.split('/')[2].split('.')[0];
    if (document.getElementById('mobileMenuScroll') != null){
        var cordinate = document.getElementById('mobileMenuScroll').getElementsByTagName('a')[0].children[0].innerHTML.split('(')[1].split(')')[0].split('|');
    }
    /*if (document.getElementById('mobileMenuSmall') != null){
        var cordinate = document.getElementById('mobileMenuSmall').children[0].children[0].innerHTML.split('(')[1].split(')')[0].split('|');
    }*/
    if (document.getElementById('menu_row2') != null){
        var cordinate = document.getElementById('menu_row2').innerHTML.split('(')[1].split(')')[0].split('|');
    }
    const maplink = 'http://'+worldcode+'.plemionamapa.pl/?x='+cordinate[0]+'&y='+cordinate[1];
    const planerlink = 'http://pl.twstats.com/'+worldcode+'/index.php?page=attack_planner';

    createHelper();
    addHelperLine('0', 'Wolna Populacja', 'https://help.plemiona.pl/images/1/1c/Ludz.png');
    addHelperLine('Przepełnienie Spichlerza', '', 'https://help.plemiona.pl/images/5/52/Lup.png');
    addHelperLine(drewno_czas, 'Drewno', 'https://help.plemiona.pl/images/8/88/Drewno.png');
    addHelperLine(glina_czas, 'Glina', 'https://help.plemiona.pl/images/8/89/Glina.png');
    addHelperLine(zelazo_czas, 'Żelazo', 'https://help.plemiona.pl/images/8/8b/Zelazo.png');
    addHelperLineURL("plemionamapa.pl", maplink, "https://dspl.innogamescdn.com/asset/76fbc2898/graphic/icons/map2.png");
    addHelperLineURL("Planer Ataków", planerlink, "https://help.plemiona.pl/images/e/ea/Predkosc.png");
    addHelperScript("Stan Wojska", "https://media.innogamescdn.com/com_DS_PL/skrypty/licznik_wojska.js", "https://help.plemiona.pl/images/2/21/Koszary_16x16.png");
    addHelperScript("Wspracie", "https://gorlik1337.github.io/PlemionaUI/licznik_wsparcia.js", "https://dspl.innogamescdn.com/asset/4cfd523b/graphic/command/support.png");
}

/* Raporty */
if (URLGET['screen'] == 'report'){
    if (document.getElementById('mobileNavContentRight') != null){
        let delraportlink = document.getElementById('mobileNavContentRight').children[0].children[0].cloneNode(true);
        delraportlink.children[0].innerText = "Usuń Barby";
        delraportlink.children[0].style = "color: #ff00eb;";
        delraportlink.children[0].href = window.location.href+"&deletebarb=true";
        document.getElementById('mobileNavContentRight').children[0].appendChild(delraportlink);
    }
    if (document.getElementsByClassName('modemenu')[0] != null){
        let delraportlink = document.getElementsByClassName('modemenu')[0].children[0].children[0].cloneNode(true)
        delraportlink.children[0].children[0].innerText = "Usuń Barby ";
        delraportlink.children[0].className=""
        delraportlink.children[0].children[0].style = "color: #ff00eb;";
        delraportlink.children[0].children[0].href = window.location.href+"&deletebarb=true";
        document.getElementsByClassName('modemenu')[0].children[0].appendChild(delraportlink);  
    }

    if (URLGET['deletebarb'] == 'true' || DATABASE['autoRaportDelete'] == true){
        DATABASE['autoRaportDelete'] = true;
        localStorage['GorlikUI'] = JSON.stringify(window['DATABASE']);
        setInterval(function() {
            let barby = ['Wioska barbarzyńska', 'Osada koczowników'];
            let deletesomething = false;
            for (let i = 1; i < document.getElementById('report_list').children[0].childElementCount-1; i++) {
                for(let x = 0; x < barby.length; x++){
                    if (document.getElementById('report_list').children[0].children[i].innerText.includes(barby[x])){
                        document.getElementById('report_list').children[0].children[i].children[0].children[0].checked = true;
                        deletesomething = true;
                    }
                }
            }
            if (deletesomething == false){
                console.log('juz nie usuwaj');
                DATABASE['autoRaportDelete'] = false;
                localStorage['GorlikUI'] = JSON.stringify(window['DATABASE']);
                location.href=location.href;
            }else{
                document.getElementsByName('del')[0].click();
            }
        }, 2000);
    }
}

// AutoAtack
if (URLGET['screen'] == 'map'){
    setInterval(function() {
        if (document.getElementById('troop_confirm_go') != null){
            if (document.getElementById('plemionaui_planingatack') == null){
                let form = document.getElementById('command-data-form');
                let span = document.createElement("span");
                span.innerText = "Zaplanuj Automatyczny Atak";
                span.setAttribute("style","font-weight: 700;");
                form.appendChild(span);

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "plemionaui_planingatack";
                form.appendChild(checkbox);

                let input = document.createElement("input");
                input.type='time';
                input.setAttribute("step", "1");
                input.id = "plemionaui_planingatacktime";
                input.setAttribute("style","font-weight: 700; font-size: 15px;");

                let timenow = new Date;
                timenow.setMinutes( timenow.getMinutes() + 5 );
                input.value = ""+doublezero(timenow.getHours())+":"+doublezero(timenow.getMinutes())+":"+doublezero(timenow.getSeconds());
                form.appendChild(input);

                let spanmsg = document.createElement("span");
                spanmsg.innerText = "Off";
                spanmsg.setAttribute("style","font-weight: 700; font-size: 15px;");
                spanmsg.id = "plemionaui_planingatackmsg";
                form.appendChild(spanmsg);
            }
        }
        if (document.getElementById('troop_confirm_go') != null){
            if (document.getElementById('plemionaui_planingatack').checked){
                let atacktime = document.getElementById('plemionaui_planingatacktime').value.split(":");
                let timenowtxt = new Date;
                timenowtxt = ""+doublezero(timenowtxt.getHours())+":"+doublezero(timenowtxt.getMinutes())+":"+doublezero(timenowtxt.getSeconds());
                timenow = timenowtxt.split(":");
                if (parseInt(atacktime[0]) <= parseInt(timenow[0])){
                    if (parseInt(atacktime[1]) <= parseInt(timenow[1])){
                        if (parseInt(atacktime[2]) <= parseInt(timenow[2])){
                            document.getElementById('troop_confirm_go').click()
                        }
                    }
                }
                document.getElementById('plemionaui_planingatackmsg').innerText = " Zegar: "+timenowtxt+"";
            }
        }
    }, 1000);
}
// mobile AutoAtack
if (URLGET['screen'] == 'place' && URLGET['try'] == 'confirm'){
    let form = document.getElementsByTagName('form')[0];
    let span = document.createElement("span");
    span.innerText = "Zaplanuj Automatyczny Atak ";
    span.id = "plemionaui_marker";
    span.setAttribute("style","font-weight: 700;");
    form.insertBefore(span, form.children[8]);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "plemionaui_planingatack";
    form.insertBefore(checkbox, form.children[9]);

    let br = document.createElement("br");
    form.insertBefore(br, form.children[10]);

    let input = document.createElement("input");
    input.type='time';
    input.setAttribute("step", "1");
    input.id = "plemionaui_planingatacktime";
    input.setAttribute("style","font-weight: 700; font-size: 15px;");

    let timenow = new Date;
    timenow.setMinutes( timenow.getMinutes() + 5 );
    input.value = ""+doublezero(timenow.getHours())+":"+doublezero(timenow.getMinutes())+":"+doublezero(timenow.getSeconds());
    form.insertBefore(input, form.children[11]);

    let spanmsg = document.createElement("span");
    spanmsg.innerText = "Off";
    spanmsg.setAttribute("style","font-weight: 700; font-size: 15px;");
    spanmsg.id = "plemionaui_planingatackmsg";
    form.insertBefore(spanmsg, form.children[12]);

    setInterval(function() {
        if (document.getElementById('plemionaui_planingatack').checked){
            let atacktime = document.getElementById('plemionaui_planingatacktime').value.split(":");
            let timenowtxt = new Date;
            timenowtxt = ""+doublezero(timenowtxt.getHours())+":"+doublezero(timenowtxt.getMinutes())+":"+doublezero(timenowtxt.getSeconds());
            timenow = timenowtxt.split(":");
            if (parseInt(atacktime[0]) <= parseInt(timenow[0])){
                if (parseInt(atacktime[1]) <= parseInt(timenow[1])){
                    if (parseInt(atacktime[2]) <= parseInt(timenow[2])){
                        form.getElementsByClassName('btn')[0].click()
                    }
                }
            }
            document.getElementById('plemionaui_planingatackmsg').innerText = " Zegar: "+timenowtxt+"";
        }  
    }, 1000);
}

/* Inofrmacje o wiosce (podgląd) */
if (URLGET['screen'] == 'info_village'){
    let delayscript = function(){

        if (document.getElementsByClassName('mobileKeyValue')[0] != null){
            /* Mobile */
            var targetcord = document.getElementsByClassName('mobileKeyValue')[0].children[1].innerText.split("\n")[1].split('|');
        }else{
            /* Desktop */
            //var targetcord =  table.children[0].children[2].children[1].innerText.split('|');
            var targetcord = document.URL.split('#')[1].split(';');
        }

        var mycord = game_data.village.coord.split('|');
        let dist = countRoad(mycord[0], mycord[1], targetcord[0], targetcord[1]);

        if (document.getElementsByClassName('mobileKeyValue')[0] != null){
            /* Mobile */
            let table = document.getElementById('content_value').getElementsByClassName('mobileKeyValue')[0];
            let clone = table.children[2].cloneNode(true);
            clone.children[0].innerText = 'Odległość:';
            clone.children[1].innerText = dist+" pól";
            table.appendChild(clone);
        }else{
            let table = document.getElementById('content_value').getElementsByClassName('vis')[0];
            let clone = table.children[0].children[3].cloneNode(true);
            clone.children[0].innerText = 'Odległość:';
            clone.children[1].innerText = dist+" pól";
            table.appendChild(clone);
        }
        
        let marker = document.createElement("div");
        marker.id="plemionaui_speedcountertable";
        document.getElementById('content_value').appendChild(marker);

        document.getElementById('plemionaui_speedcountertable').innerHTML = '<div style="padding-top: 10px; clear:both"><h3>Prędkość jednostek</h3><table class="vis" width="100%" id="plemionaui_tablespeed"><tbody><tr><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="spear"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_spear.png" title="Pikinier" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="sword"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_sword.png" title="Miecznik" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="axe"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_axe.png" title="Topornik" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="archer"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_archer.png" title="Łucznik" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="spy"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_spy.png" title="Zwiadowca" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="light"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_light.png" title="Lekki kawalerzysta" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="marcher"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_marcher.png" title="Łucznik na koniu" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="ram"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_ram.png" title="Taran" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="catapult"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_catapult.png" title="Katapulta" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="knight"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_knight.png" title="Rycerz" alt="" class=""></a></th><th style="text-align:center" width="40"><a href="#" class="unit_link" data-unit="snob"><img src="https://dspl.innogamescdn.com/asset/6be9bf502a/graphic/unit/unit_snob.png" title="Szlachcic" alt="" class=""></a></th></tr><tr><td style="text-align:center; text-decoration: underline;" class="unit-item unit-item-spear">0</td><td style="text-align:center" class="unit-item unit-item-sword">0</td><td style="text-align:center; text-decoration: underline;" class="unit-item unit-item-axe">0</td><td style="text-align:center;text-decoration: underline;" class="unit-item unit-item-archer">0</td><td style="text-align:center" class="unit-item unit-item-spy">0</td><td style="text-align:center; text-decoration: overline;" class="unit-item unit-item-light">0</td><td style="text-align:center;text-decoration: overline;" class="unit-item unit-item-marcher">0</td><td style="text-align:center" class="unit-item unit-item-heavy">0</td><td style="text-align:center" class="unit-item unit-item-ram">0</td><td style="text-align:center" class="unit-item unit-item-catapult">0</td><td style="text-align:center; text-decoration: overline;" class="unit-item unit-item-knight">0</td><td style="text-align:center" class="unit-item unit-item-snob">0</td></tr></tbody></table></div>';
        
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-spear')[0].innerText = unitSpeedCount(dist, 18);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-sword')[0].innerText = unitSpeedCount(dist, 22);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-axe')[0].innerText = unitSpeedCount(dist, 18);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-archer')[0].innerText = unitSpeedCount(dist, 18);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-spy')[0].innerText = unitSpeedCount(dist, 9);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-light')[0].innerText = unitSpeedCount(dist, 10);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-marcher')[0].innerText = unitSpeedCount(dist, 10);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-heavy')[0].innerText = unitSpeedCount(dist, 11);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-ram')[0].innerText = unitSpeedCount(dist, 30);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-catapult')[0].innerText = unitSpeedCount(dist, 30);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-knight')[0].innerText = unitSpeedCount(dist, 10);
        document.getElementById('plemionaui_tablespeed').getElementsByClassName('unit-item-snob')[0].innerText = unitSpeedCount(dist, 35);
    };
   setTimeout(delayscript, 1000);
}

/* Giełda Premium - szybka sprzedasz dla farmerów PP */
if (URLGET['screen'] == 'market' && URLGET['mode'] == 'exchange' ){
    let delayscript = function(){
        let market_wood = document.getElementById('premium_exchange_sell_wood').getElementsByClassName('cost-container cost-container-sell')[0];
        let market_stone = document.getElementById('premium_exchange_sell_stone').getElementsByClassName('cost-container cost-container-sell')[0];
        let market_iron = document.getElementById('premium_exchange_sell_iron').getElementsByClassName('cost-container cost-container-sell')[0];
        
        var kurs_wood = parseInt(document.getElementById('premium_exchange_rate_wood').children[0].innerText);
        var kurs_stone = parseInt(document.getElementById('premium_exchange_rate_stone').children[0].innerText);
        var kurs_iron = parseInt(document.getElementById('premium_exchange_rate_iron').children[0].innerText);

        /* STARS */
        let market_star1 = document.createElement("span");
        market_star1.className = 'icon header favorite_add star'
        market_star1.style = 'margin: 0px;';
        market_star1.onclick = function() {
            document.getElementsByName('sell_wood')[0].value = (Math.floor(game_data.village.wood / kurs_wood) * kurs_wood);
        }  
        market_wood.appendChild(market_star1);

        let market_star2 = document.createElement("span");
        market_star2.className = 'icon header favorite_add star'
        market_star2.style = 'margin: 0px;';
        market_star2.onclick = function() {
            document.getElementsByName('sell_stone')[0].value = (Math.floor(game_data.village.stone / kurs_stone) * kurs_stone);
        } 
        market_stone.appendChild(market_star2);

        let market_star3 = document.createElement("span");
        market_star3.className = 'icon header favorite_add star'
        market_star3.style = 'margin: 0px;';
        market_star3.onclick = function() {
            document.getElementsByName('sell_iron')[0].value = (Math.floor(game_data.village.iron / kurs_iron) * kurs_iron);
        } 
        market_iron.appendChild(market_star3);
    };
    setTimeout(delayscript, 1000);
}

// Refresh Pop Everywhere
setInterval(function() {
    let pop = document.getElementById('pop_current_label').innerHTML;
    let popmax = document.getElementById('pop_max_label').innerHTML;
    popfree = popmax - pop;

    if (document.getElementById('pop_left_label')==null){
        let parent = document.getElementById('pop_current_label').parentElement;
        let obj = document.getElementById('pop_max_label').cloneNode(true);
        obj.id = "pop_left_label";
        obj.setAttribute("style", "color:#ff00eb; font-weight: 600;");
        parent.appendChild(obj);
    }
    document.getElementById('pop_left_label').innerHTML = `(${popfree})`;
    if (URLGET['screen'] == 'overview'){
        document.getElementById('WolnaPopulacja_plemionaui').getElementsByTagName('strong')[0].innerHTML = ` ${popfree} `; 
    }     
}, 1000);

// licznik pól do danej wioski
for (let i = 0; i < document.getElementsByClassName('village_anchor').length; i++) {
    let cord = document.getElementsByClassName('village_anchor')[i].children[0].innerText.toString().trim().split('(')[1].split(')')[0].split('|');
    let vcord = game_data.village.coord.split('|');
    let path = countRoad(vcord[0], vcord[1], cord[0], cord[1]);
    document.getElementsByClassName('village_anchor')[i].children[0].innerText = document.getElementsByClassName('village_anchor')[i].children[0].innerText + '['+path+']';
}


};// core()

window.onload = core();


//
/*let mNotifyContainer = document.getElementById('mNotifyContainer');
let darkmode = document.getElementById('notify_report').cloneNode(true);
darkmode.id='plemionaui_notify_darkmode';

*/
