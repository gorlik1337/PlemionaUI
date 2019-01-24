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
        localStorage['GorlikUI'] = JSON.stringify({"enableScavenge": true, "valueScavenge": 3, "showSupport": true, "showSettings": true, "enableScaling": true, "autoRaportDelete": false});
    }
    DATABASE = JSON.parse(localStorage['GorlikUI']);

    function createBox(value, text, iconurl = 'https://dspl.innogamescdn.com/8.107/35533/graphic/icons/account.png'){
        let p_tr1 = document.createElement("tr");
        let p_td1 = document.createElement("td");
        p_td1.setAttribute("class", "village_overview_effect effect_tooltip");
            let p_img1 = document.createElement("img");
            p_img1.setAttribute("src", iconurl);
            p_img1.setAttribute("alt", "");
            p_img1.setAttribute("style", "vertical-align: middle");
            let p_wartosc1 = document.createElement('strong');
            p_wartosc1.innerText = ' '+value;
            let p_tekst1 = document.createTextNode(text);
        p_td1.appendChild(p_img1);
        p_td1.appendChild(p_wartosc1);
        p_td1.appendChild(p_tekst1);
        p_tr1.appendChild(p_td1);
        return p_tr1
    }
    function createBoxLink(text, link, iconurl = 'https://dspl.innogamescdn.com/8.107/35533/graphic/icons/account.png'){
        let p_tr1 = document.createElement("tr");
        let p_td1 = document.createElement("td");
        p_td1.setAttribute("class", "village_overview_effect effect_tooltip");
            let p_img1 = document.createElement("img");
            p_img1.setAttribute("src", iconurl);
            p_img1.setAttribute("alt", "");
            p_img1.setAttribute("style", "vertical-align: middle");
            let p_wartosc1 = document.createElement('strong');
            p_wartosc1.innerText = ' ';
            let p_tekst1 = document.createElement('a');
            p_tekst1.setAttribute("href", link);
            p_tekst1.innerText = text;
        p_td1.appendChild(p_img1);
        p_td1.appendChild(p_wartosc1);
        p_td1.appendChild(p_tekst1);
        p_tr1.appendChild(p_td1);
        return p_tr1

    }
    function createSettingsBox(value, variable, type, iconurl = 'https://dspl.innogamescdn.com/8.107/35533/graphic/icons/account.png'){
        let p_tr1 = document.createElement("tr");
        let p_td1 = document.createElement("td");
        p_td1.setAttribute("class", "village_overview_effect effect_tooltip");
            let p_img1 = document.createElement("img");
            p_img1.setAttribute("src", iconurl);
            p_img1.setAttribute("alt", "");
            p_img1.setAttribute("style", "vertical-align: middle");
            let p_wartosc1 = document.createElement('strong');
            p_wartosc1.innerText = ' '+value;
            let input = document.createElement("input");
            input.setAttribute("class", "GorlikUISettings");
            input.setAttribute("variable", variable);

            if (type =='checkbox'){
                input.setAttribute("type", "checkbox");
                if (window['DATABASE'][variable]){
                    input.setAttribute("checked", '');
                }
            }
            if (type == 'number'){
                input.setAttribute("type", "number");
                input.value= parseInt(window['DATABASE'][variable]);
            }
            if (type == 'none'){
                input = document.createElement("span");
            }

        p_td1.appendChild(p_img1);
        p_td1.appendChild(p_wartosc1);
        p_td1.appendChild(input);
        p_tr1.appendChild(p_td1);
        return p_tr1
    }

    function createBoxCurrentParametrs(text, iconurl = 'https://dspl.innogamescdn.com/8.107/35533/graphic/icons/account.png'){
        var parametrypanel = document.getElementById("show_effects").getElementsByClassName("widget_content")[0].getElementsByTagName("tbody")[0];
        var prawypanel = document.getElementById('rightcolumn');

        var polea = document.createElement("tr");
        var poleb = document.createElement('td');
        var icon = document.createElement("img");
        icon.setAttribute("src", iconurl);
        icon.setAttribute("alt", "");
        icon.setAttribute("style", "vertical-align: middle");
        var opis = document.createTextNode(text);
        poleb.appendChild(icon);
        poleb.appendChild(opis);
        polea.appendChild(poleb);
        parametrypanel.appendChild(polea);
    }
    function hourtohourandminutes(time){
        let str = ""+Math.floor(time)+"";
        let h = Math.floor(time);
        let min = (((time-h) * 60 ) / 100)*60;
        min = Math.round((min * 60)/100);
        if (min < 10){min = "0"+min;}
        return h+':'+min;
    }
    function fromthimetodate(strtime){
        let time = strtime.split(":");
        let d = new Date();
        d.setHours(d.getHours() + parseInt(time[0]));
        d.setMinutes(d.getMinutes() + parseInt(time[1]));
        let min = d.getMinutes();
        if(min<10){min = '0'+min;}
        return d.getHours()+':'+min;
    }


/*Population count*/
    var pop = document.getElementById('pop_current_label').innerHTML;
    var popmax = document.getElementById('pop_max_label').innerHTML;
    var popfree = popmax - pop;
    document.getElementById('pop_max_label').innerHTML = `${popmax} (${popfree})`;


if (document.URL.includes('screen=report')){
    var leftmenu = document.getElementById('content_value').children[1].children[0].children[0].children[0].children[0].children[0];
    var position = leftmenu.children[0].cloneNode(true);
    position.children[0].children[0].innerText = "Usuń Barby";
    let villageID = parseInt(document.URL.split('village=')[1].split('&')[0]);
    position.children[0].children[0].href = "/game.php?village="+villageID+"&screen=report&barbdelete";
    position.children[0].className = "";
    leftmenu.appendChild(position)
    if (window['DATABASE']['autoRaportDelete']){
        var raports = document.getElementById('report_list').children[0];
        var barby = ['Wioska barbarzyńska', 'Osada koczowników'];
        var isdeleted = false;

        for (let y = 0; y < barby.length; y++){
            for (let x = 1; x < raports.children.length - 1; x++){
                if (raports.children[x].children[1].getElementsByTagName('span')[0].children[0].children[0].children[0].innerHTML.trim().includes(barby[y])){
                    raports.children[x].children[0].children[0].checked = true
                    isdeleted = true;
                }
            }
        }
        if (isdeleted){
            console.log('Deleting somethink');
            setInterval(function() {
                document.getElementsByName('del')[0].click();
            }, 2000);
        }else{
            window['DATABASE']['autoRaportDelete'] = false;
            localStorage['GorlikUI'] = JSON.stringify(window['DATABASE']);
            console.log('All Raports was deleted!');
            location.href=document.URL.replace('&barbdelete','');
        }
    }
}
/*Jezeli raporty z opcja usuwania barb*/
if (document.URL.includes('screen=report&barbdelete') && window['DATABASE']['autoRaportDelete'] == false){
    window['DATABASE']['autoRaportDelete'] = true;
    localStorage['GorlikUI'] = JSON.stringify(window['DATABASE']);
    setInterval(function() {
        location.href=document.URL.replace('&barbdelete','');
    }, 3000);
}

/*Jezeli głowny ekran wioski*/
if (document.URL.includes('screen=overview')){

    /*population on bar*/
    createBoxCurrentParametrs(popfree+': Wolna Populacja', 'https://dspl.innogamescdn.com/8.107/35533/graphic/icons/account.png');

    /*create Script tab*/
    var pole = document.createElement("div");
    pole.setAttribute("id", "show_skrypt");
    pole.setAttribute("class", "vis moveable widget ");
        var p_naglowek = document.createElement("h4");
        p_naglowek.setAttribute("class", "head");
            var p_minus = document.createElement("img");
            p_minus.setAttribute("class", "widget-button");
            p_minus.setAttribute("onclick", "return VillageOverview.toggleWidget( 'show_skrypt', this );");
            p_minus.setAttribute("src", "graphic/minus.png");
            var p_naglowek_tekst = document.createTextNode(` Plemiona UI - Gorlik`);
        var p_zawartosc = document.createElement("div");
        p_zawartosc.setAttribute("class", "widget_content");
        if (window['DATABASE']['showSupport']){
            p_zawartosc.setAttribute("style", "display: block;");
            p_minus.setAttribute("src", "graphic/minus.png");
        }else{
            p_zawartosc.setAttribute("style", "display: none;");
            p_minus.setAttribute("src", "graphic/plus.png");
        }


    /*storage speed*/
    var sury_speed_tab = document.getElementById('show_prod').getElementsByTagName('table')[0];
    var sury_speed_drewno = sury_speed_tab.children[0].children[0].children[1].children[0].innerText;
    var sury_speed_glina = sury_speed_tab.children[0].children[1].children[1].children[0].innerText;
    var sury_speed_zelazo = sury_speed_tab.children[0].children[2].children[1].children[0].innerText;
    var drewno = document.getElementById('wood').innerText;
    var glina = document.getElementById('stone').innerText;
    var zelazo = document.getElementById('iron').innerText;
    var storage = document.getElementById('storage').innerText;
    var drewno_czas = hourtohourandminutes((storage-drewno)/(sury_speed_drewno));
    var glina_czas = hourtohourandminutes((storage - glina)/(sury_speed_glina));
    var zelazo_czas = hourtohourandminutes((storage - zelazo)/(sury_speed_zelazo));

    // link do mapy
    var worldcode = document.URL.split('/')[2].split('.')[0];
    var cordinate = document.getElementById('menu_row2').children[1].children[0].innerHTML.split('(')[1].split(')')[0].split('|');
    var maplink = 'http://'+worldcode+'.plemionamapa.pl/?x='+cordinate[0]+'&y='+cordinate[1];

    var villageID = parseInt(document.URL.split('village=')[1].split('&')[0]);
    var scavengelink = 'https://'+worldcode+'.plemiona.pl/game.php?village='+villageID+'&screen=place&mode=scavenge';


    /*================================*/
    /* Build script tab*/
    p_naglowek.appendChild(p_minus);
    p_naglowek.appendChild(p_naglowek_tekst);
    pole.appendChild(p_naglowek);

    var p_tabela = document.createElement("table");
    p_tabela.setAttribute("style", "width: 100%");
        var p_tbody = document.createElement("tbody");

    // script panel objects
    p_tbody.appendChild(createBox('','Przepełnienie spichlerza', 'https://help.plemiona.pl/images/7/78/Spichlerz_miniaturka.png'));
    p_tbody.appendChild(createBox(drewno_czas,'h  ('+fromthimetodate(drewno_czas)+')', 'https://dspl.innogamescdn.com/8.152/39836/graphic/holz.png'));
    p_tbody.appendChild(createBox(glina_czas,'h   ('+fromthimetodate(glina_czas)+')', 'https://dspl.innogamescdn.com/8.152/39836/graphic/lehm.png'));
    p_tbody.appendChild(createBox(zelazo_czas,'h  ('+fromthimetodate(zelazo_czas)+')', 'https://dspl.innogamescdn.com/8.152/39836/graphic/eisen.png'));
    p_tbody.appendChild(createBox(popfree,' Wolna Populacja', 'https://dspl.innogamescdn.com/8.107/35533/graphic/icons/account.png'));
    p_tbody.appendChild(createBoxLink(' Mapa', maplink, 'https://dspl.innogamescdn.com/8.153/40020/graphic/icons/map2.png'));
    p_tbody.appendChild(createBoxLink(' Zbieractwo', scavengelink, 'https://help.plemiona.pl/images/7/78/Spichlerz_miniaturka.png'));

    // script panel objects

    p_tabela.appendChild(p_tbody);
    p_zawartosc.appendChild(p_tabela);
    pole.appendChild(p_zawartosc);

    /*positon of script box right column*/
    //document.getElementById('rightcolumn').appendChild(pole); // bottom
    document.getElementById('rightcolumn').prepend(pole); // top



    /*=================================================================================*/
    /*Ustawienia na stronie glownej*/
    var settings_pole = document.createElement("div");
    settings_pole.setAttribute("id", "show_skrypt_settings");
    settings_pole.setAttribute("class", "vis moveable widget ");
        var settings_p_naglowek = document.createElement("h4");
        settings_p_naglowek.setAttribute("class", "head");
            var settings_p_minus = document.createElement("img");
            settings_p_minus.setAttribute("class", "widget-button");
            settings_p_minus.setAttribute("onclick", "return VillageOverview.toggleWidget( 'show_skrypt_settings', this );");
            settings_p_minus.setAttribute("src", "graphic/minus.png");
            var settings_p_naglowek_tekst = document.createTextNode(` Plemiona UI - Gorlik / Ustawienia`);
        var settings_p_zawartosc = document.createElement("div");
        settings_p_zawartosc.setAttribute("class", "widget_content");
        settings_p_zawartosc.setAttribute("style", "display: block;");
        if (window['DATABASE']['showSettings']){
            settings_p_zawartosc.setAttribute("style", "display: block;");
        }else{
            settings_p_zawartosc.setAttribute("style", "display: none;");
        }

    /*================================*/
    /* Build Setings tab*/
    settings_p_naglowek.appendChild(settings_p_minus);
    settings_p_naglowek.appendChild(settings_p_naglowek_tekst);
    settings_pole.appendChild(settings_p_naglowek);

    var settings_p_tabela = document.createElement("table");
    settings_p_tabela.setAttribute("style", "width: 100%");
        var settings_p_tbody = document.createElement("tbody");

    // Setings objects
    settings_p_tbody.appendChild(createSettingsBox('Automatyczne Zbieractwo', 'enableScavenge', 'checkbox', 'https://dspl.innogamescdn.com/8.153/40020/graphic/buildings/place.png'));
    settings_p_tbody.appendChild(createSettingsBox('Zbieractwo poziom (1 - 4) ', 'valueScavenge', 'number', 'https://help.plemiona.pl/images/7/78/Spichlerz_miniaturka.png'));

    settings_p_tbody.appendChild(createSettingsBox('Zmiany skali mapy ', 'enableScaling', 'checkbox', 'https://dspl.innogamescdn.com/8.153/40020/graphic/icons/map2.png'));


    settings_p_tbody.appendChild(createSettingsBox('Ustawienia', 'showSettings', 'none', 'https://dspl.innogamescdn.com/8.153/40020/graphic/buildings/garage.png'));
    settings_p_tbody.appendChild(createSettingsBox('Pokaż Ustawienia', 'showSettings', 'checkbox', ''));
    settings_p_tbody.appendChild(createSettingsBox('Pokaż Pomocnika obok', 'showSupport', 'checkbox', ''));

    settings_p_tbody.appendChild(createSettingsBox('Automatycznie usuwaj raporty z barb', 'autoRaportDelete', 'checkbox', ''));

    // Setings objects

    settings_p_tabela.appendChild(settings_p_tbody);
    settings_p_zawartosc.appendChild(settings_p_tabela);
    settings_pole.appendChild(settings_p_zawartosc);
    document.getElementById('leftcolumn').appendChild(settings_pole);

// SETTINGS LOAD FUNC
window.onload = function() {
	var settings = document.getElementsByClassName('GorlikUISettings');
    for (let i=0; i<settings.length; i++){
        settings[i].onchange = function() {
            if (this.type == "checkbox"){
                window['DATABASE'][this.getAttribute('variable')] = this.checked;
                localStorage['GorlikUI'] = JSON.stringify(window['DATABASE']);
            }
            if (this.type == "number"){
                window['DATABASE'][this.getAttribute('variable')] = parseInt(this.value);
                localStorage['GorlikUI'] = JSON.stringify(window['DATABASE']);
            }
	    }
    }
}

}/*Koniec strony glownej*/


if (document.URL.includes('screen=place&mode=scavenge') && window['DATABASE']['enableScavenge']){
    document.getElementById('content_value').getElementsByTagName('h3')[0].innerText = document.getElementById('content_value').getElementsByTagName('h3')[0].innerText+ ' (Bot Enabled) lvl('+window['DATABASE']['valueScavenge']+')';
    let ScavengeLvl = parseInt(window['DATABASE']['valueScavenge'] - 1);

    var botautoscavenge = setInterval(function() {
        let option = document.getElementsByClassName('scavenge-option')[ScavengeLvl];

        if (option.getElementsByClassName('btn-disabled')[0] == undefined){
            for (let i = 0; i < 4; i++){
                document.getElementsByClassName('units-entry-all')[i].click();
            }
            let sum = 0;
            for (let i = 0; i < 4; i++){
                if (isNaN(parseInt(document.getElementsByClassName('unitsInput')[i].value)) == false ){
                    sum = sum + parseInt(document.getElementsByClassName('unitsInput')[i].value);
                }
            }

            if ((sum < 10) || (isNaN(sum))){
                console.log('za malo jednostek ' + sum);
            }else{
                console.log('obstaw');
                option.getElementsByClassName('free_send_button')[0].click();
            }
        }
    }, 5000);
}

if (document.URL.includes('screen=map') && window['DATABASE']['enableScaling']){
    document.getElementById('map').style.width = "600px";
    document.getElementById('map_coord_x_wrap').style.width = "600px";

    document.getElementById('map').style.height = "400px";
    document.getElementById('map_coord_y_wrap').style.height = "400px";
}

})();