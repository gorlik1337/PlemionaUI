// ==UserScript==
// @name         [STABLE] Plemiona UI by Gorlik Stable
// @version      0.9
// @description  Dodatkowe informacje w grze plemiona.pl
// @author       Gorlik
// @match        https://*.plemiona.pl/game.php?*
// @grant        none
// @updateURL    https://github.com/gorlik1337/PlemionaUI/raw/master/stable.user.js
// @downloadURL  https://github.com/gorlik1337/PlemionaUI/raw/master/stable.user.js
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
        var cordinate = document.getElementById('menu_row2').children[1].children[0].innerHTML.split('(')[1].split(')')[0].split('|');
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


};// core()

window.onload = core();