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



(function() {
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
    function betterDisplayTime(time){
        function doublezero(x){if (x<10){return "0"+x;}else{return ""+x;}}
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

    if (URLGET['deletebarb'] == 'true'){
        setInterval(function() {
            let barby = ['Wioska barbarzyńska', 'Osada koczowników'];
            for (let i = 1; i < document.getElementById('report_list').children[0].childElementCount-1; i++) {
                for(let x = 0; x < barby.length; x++){
                    if (document.getElementById('report_list').children[0].children[i].innerText.includes(barby[x])){
                        document.getElementById('report_list').children[0].children[i].children[0].children[0].checked = true;
                    }
                }
            }
            document.getElementsByName('del')[0].click();
        }, 3000);
    }
}

// Refresh Data Everywhere
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

})();