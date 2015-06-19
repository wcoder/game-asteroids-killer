/**
 * Game for web "Asteroids killer" 
 *
 * @author     Yauheni Pakala
 * @copyright  2011
 * @version    1.0
 */


$(function(){	
	
	/**
	 * Ïîëîòíî
	 */
	mcanvas = $('#canvas');	
	
	/**
	 * Êîðàáëü
	 */
	mship   = $("#ship");
	
	/**
	 * Êëàññ 'ïîëîòíî'
     * w - Øèðèíà ïîëîòíà
     * h - Âûñîòà ïîëîòíà
	 */ 
	canvas = {
        w: mcanvas.width(),
        h: mcanvas.height()
    };
	
	/**
	 * Êëàññ 'êîðàáëü'
     * x - Êîîðäèíàòà êîðàáëÿ ïî Ox
     * y - Êîîðäèíàòà êîðàáëÿ ïî Oy
     * w - Øèðèíà êîðàáëÿ
     * h - Âûñîòà êîðàáëÿ 
	 */
	ship = {
        x: ReplacePx(mship.css("left")),
        y: ReplacePx(mship.css("top")),
        w: mship.width(),
        h: mship.height()
    };
	
	/**
	 * Êëàññ 'ïóëÿ'
     * w - Øèðèíà ïóëè êîðàáëÿ [px]
     * h - Âûñîòà ïóëè êîðàáëÿ [px] 
	 */
	bullet = {w: 10,h: 1};
    
    /**
     * Êëàññ 'àñòåðîèä'
     * w - Øèðèíà àñòåðîèäà [px]
     * h - Âûñîòà àñòåðîèäà [px]
     */
    enemy = {w: 50,h: 20}   ; 
	
	/**
	 * Êëàññ íàñòðîåê
	 */
	settings = {
		ship_speed : 30,          // Øàã êîðàáëÿ (âëåâî, âïðàâî) [px]		
        ship_animate : 150,       // Ñêîðîñòü àíèìàöèè øàãà êîðàáëÿ [ms]
		bullet_animate : 1000,    // Ñêîðîñòü àíèìàöèè ïîëåòà ïóëè êîðàáëÿ [ms]
        enemy_speed: 6000,        // Ñêîðîñòü àíèìàöèè ïîëåòà àñòåðîèäà [ms]
        enemy_time: 6000,         // Òàéìàóò ïåðåä ïîÿâëåíèåì íîâîãî àñòåðîèäà [ms]
        enemy_created: 0,         // Êîëè÷åñòâî ñîçäàííûõ àñòåðîèäîâ [Integer]
        enemy_blow_ship: false,   // Ñòîëêíîâåíèå àñòåðîèäà ñ êîðàáëåì [bool]
		node : '',                // ×èò-êîä ïî óìîë÷àíèþ [String]
        game: 3,                  // Êîëè÷åñòâî æèçíåé [Integer]
        level: 1,                 // Óðîâåíü ñëîæíîñòè [Integer]
 		speed : 1,                // Ñêîðîñòü ïðîêðóòêè ôîíà [ms]
        shoots: 0,                // Êîëè÷åñòâî âûñòðåëîâ [Integer]
        kill: 0,                  // Êîëè÷åñòâî óáèòûõ àñòåðîèäîâ [Integer]
        kill_buffer: 0            // Âðåìåííîå õðàíåíèå çíà÷åíèÿ óáèòûõ àñòåðîèäîâ [Integer]
	};
	
	/**
	 * Çàïóñê êîíòðîëëåðà ïðè íàæàòèè/îòïóñêàíèè êëàâèøè
	 */
    $('body').keyup(key_up);
    $('body').keydown(key_down);
	
	/**
	 * Àíèìàöèÿ ôîíà
	 */
	bg_auto_scroll();
    
    /**
     * Ðèñóåì àñòåðîèäîâ
     */
    draw_enemies(); 
    
    /**
     * Ýôôåêòíî ñòàðòóåì êîðàáëü
     */
    blow_ship();
});



/**
 * Âûðåçêà 'px' ïðè ïîëó÷åíèè ðàçìåðîâ
 * @param  String  str
 * @return Integer
 */
function ReplacePx (str) {
	return parseInt(str.replace('px',''));	
}



/** 
 * Êîíòðîëëåð íàæàòèÿ êëàâèø
 * @param  eventObject  e	
 */
function key_up(e) {
    switch (e.which) {
		case 13 : restart();                        break;    // Enter
        case 32 : shoot();							break;    // Ïðîáåë
		case 80 : pause();							break;    // Êëàâèøà 'P'
    }
}
function key_down(e) {
	switch (e.which) {
		case 37 : move ('x',-settings.ship_speed);	break;    // Ñòðåëî÷êà âëåâî
		case 38 : move ('y',-settings.ship_speed);	break;    // Ñòðåëî÷êà ââåðõ
		case 39 : move ('x',settings.ship_speed);	break;    // Ñòðåëî÷êà âïðàâî 
		case 40 : move ('y',settings.ship_speed);	break;	  // Ñòðåëî÷êà âíèç
	}
}



/**
 * Ðåñòàðò
 */
function restart () {
    if (settings.game > 0) codes(); 
    else location.href = "";  
}



function codes () {
	var code = prompt('Code:');
	if (code == 'bullet1' || code == 'bullet2' || code == 'bullet3')
		settings.code = code;
	else alert('Error!');		
}

function pause () {
	alert('Pause!\nPress Enter!');
}



/** 
 * Âûñòðåë
 */
function shoot () {
    if (settings.game > 0) {
		if (!settings.code || settings.code == 'bullet1' || settings.code == 'bullet3') {
			// Öåíòðàëüíàÿ ïóøêà
			var x = ship.x+(ship.w/2)-bullet.w+5;
			var y = ship.y;
			mcanvas.prepend('<div class="bullet" style="top:'+ y +'px;left:'+ x +'px"></div>');
            // Çíà÷åíèå î âûñòðåëàõ
            settings.shoots++;
		}
		if (settings.code == 'bullet2' || settings.code == 'bullet3') {
		    var x_l = ship.x;
            var x_r = ship.x+ship.w-bullet.w;
			var y = ship.y;
			// Ëåâàÿ ïóøêà
			mcanvas.prepend('<div class="bullet" style="top:'+y+'px;left:'+x_l+'px;"></div>');
			// Ïðàâàÿ ïóøêà
			mcanvas.prepend('<div class="bullet" style="top:'+y+'px;left:'+x_r+'px;"></div>');
            // Çíà÷åíèå î âûñòðåëàõ
            settings.shoots +=2;
		}
		
        // Ïîëó÷àåì ìàññèâ ïóëü
		mbullet = $(".bullet").toArray();
        
		// Ïîëåò ïóëü êîðàáëÿ
		for (i=0; i <= mbullet.length; i++) {		
			$(mbullet[i]).animate(
                {top: '-50px'},
                {
                    duration: settings.bullet_animate,
                    specialEasing: {top: 'linear'},
                    complete: function(){
                        $(this).remove();
                    }
                }
            );	
		}//end-for    
	}// end-if   
}



/** 
 * Äâèæåíèå êîðàáëÿ
 * @param  String   type
 *         Integer  value
 */
function move (type,value) {
	switch (type) {
		case 'x': // ïî îñè Ox
			if (ship.x+value >= 0 && ship.w+ship.x+value <= canvas.w)
				mship.animate({left: (ship.x +=value)+'px'},settings.ship_animate);			
		break;
		case 'y': // ïî îñè Oy
			if (ship.y+value >= 0 && ship.h+ship.y+value <= canvas.h)
				mship.animate({top: (ship.y +=value)+'px'},settings.ship_animate);	
		break;		
	}	
}



/**
 * Áåñêîíå÷íàÿ ïðîêðóòêà ôîíà
 * @param  Integer  speed 
 */
function bg_auto_scroll () {
	var height = 800;
	function scrollbackground() {
        if (settings.game > 0) {
       		mcanvas.css("background-position", "50% " + (height+=settings.speed) + "px");
       		setTimeout(function(){ scrollbackground() },5);
         }
         // ïðîâåðêà ïîïàäàíèå ïóëü â àñòåðîèä
         is_blow_enemy_bullet();
         // ïðîâåðêà ñòàòóñà èãðû
         game_status();
   	}
	scrollbackground();	
}



/**
 * Ïðîâåðêà ñòàòóñà èãðû
 */
function game_status () {
    // Îáíîâëåíèå èíôîðìàöèîííûõ ïîëåé
    $('#level span').html(settings.level);
    $('#game span').html(settings.game);
    $('#speed span').html(settings.speed);
    $('#shoots span').html(settings.shoots);
    $('#killed span').html(settings.kill);
	
    // Åñëè ïðîèãðàëè, çàâåðøàåì
    if (settings.game == 0) {
        mcanvas.html('');
        mcanvas.html('<div id="game_over">Game over!<br><br><br><p>Press Enter!</p></div>');
    }
	// Åñëè âûéãðàëè, çàâåðøàåì
    if (settings.level == 3 && settings.kill >= 100) {
		settings.game = -1;
        mcanvas.html('');
		$('#info').html('');
        mcanvas.html('<div id="game_win"><span>Win!</span><br><p>Âû ñïàñëè íàøó ïëàíåòó!</p><br><p>Press Enter!</p></div>');
    }
    // ÓÐÎÂÍÈ
    // Óðîâåíü 2
    if (settings.level == 1 && settings.kill_buffer >= 10) {
        settings.level = 2;
        settings.speed = 5;
        settings.enemy_speed = 3000;
        settings.enemy_time = 3000;
    }
    if (settings.level == 2 && settings.kill_buffer >= 60) {
        settings.level = 3; 
        settings.speed = 8;
        settings.enemy_speed = 1500;
        settings.enemy_time = 1500;       
    }
    // ÁÎÍÓÑÛ
    // Æèçíåííûé áîíóñ
    if (settings.kill_buffer == 30) {
        settings.game++;
        settings.kill_buffer = 0;
    }
}

/**
 * Ðèñóåì àñòåðîèä ÷åðåç íåêîòîðîå âðåìÿ
 */
function draw_enemies() {
    
    // Îáðàçóåòñÿ áåñêîíå÷íûé öèêë 
    // [ìîæåò âîçíèêíóòü òîðìîæåíèå èãðû]
    var interval = setInterval(function(){

        if (settings.game > 0) {
            // Ïîëó÷àåì êîîðäèíàòó
            var left = Math.round(Math.random()*(canvas.w-enemy.w));
            // Ïîëó÷àåì ñëó÷àéíûé ôîí àñòåðîèäà
            var background = ((Math.round(Math.random())*10) > 5) ? "enemy1.png" : "enemy2.png";
            // Ñîçäàíèå àñòåðîèäà
            mcanvas.append('<div class="enemy" style="left:'+left+"px;background:url('interface/img/"+background+"')\"></div>");
            settings.enemy_created++;

            // Ïîëó÷àåì ìàññèâ àñòåðîèäîâ
            menemies = $('.enemy').toArray();    
        
            // Ïåðåáîð è äâèæåíèå àñòåðîèäîâ
            for (i=0; i <= menemies.length; i++) {
                $(menemies[i]).animate(
                    {top: canvas.h+100},
                    {
                        duration: settings.enemy_speed,
                        specialEasing: {top: 'linear'},
                        step: function(val,elem){
                            val = Math.round(val);
                            enemy_position(val,ReplacePx($(this).css('left')),$(this));                      
                        },
                        complete: function(){
                            $(this).remove();
                        }
                    }
                );
                settings.enemy_blow_ship = false;
            }//end-for
        }//end-if
        else interval = clearInterval();
                       
    },settings.enemy_time);        
}



/**
 * Îïðåäåëåíèå ïîçèöèè àñòåðîèäà
 * @param  Integer val,enemyx
 *         Object  elem
 */
function enemy_position (val,enemyx,elem) {
    val = val+ship.h;
    if (ship.y < val+enemy.h && ship.y+ship.h > val+enemy.h && ship.x < enemyx+enemy.w && ship.x+ship.w > enemyx && !settings.enemy_blow_ship) {
        settings.enemy_blow_ship = true;
        // Ñòîëêíîâåíèå ñ êîðàáëåì (-1 æèçíü)
        settings.game--;
        // Óáèðàåì àñòåðîèäà
        elem.remove();
        // Àíèìèðóåì ñòîëêíîâåíèå
        blow_ship();
    }
}



/**
 * Ñòîëêíîâåíèå êîðàáëÿ
 */
function blow_ship () {
    mship.animate({opacity:'hide'},100);
    mship.animate({opacity:'show'},100);
    mship.animate({opacity:'hide'},100);
    mship.animate({opacity:'show'},100);
}



/**
 * Ïðîâåðêà ïîïàäàíèÿ â àñòåðîèä
 */
function is_blow_enemy_bullet () {
    // Ïîëó÷àåì ìàññèâ àñòåðîèäîâ    
    var menemies = $(".enemy").toArray();        
    // Ïîëó÷àåì ìàññèâ ïóëü
    var mbullet = $(".bullet").toArray();  
    
    if (mbullet.length > 0 && menemies.length > 0) {
        // Ïåðåáîð äâóõ ìàññèâîâ
        for (var i in menemies) {
            for (var j in mbullet) {
                // Ïîëó÷åíèå ðàçìåðîâ
                enemy_y = $(menemies[i]).position().top;
                enemy_x = $(menemies[i]).position().left;
                bullet_y = $(mbullet[j]).position().top;
                bullet_x = $(mbullet[j]).position().left;

                if (enemy_y+enemy.h > bullet_y && enemy_x < bullet_x+bullet.w && enemy_x+enemy.w > bullet_x) {
                    settings.kill_buffer++; 
                    settings.kill++;
                    blow_enemy($(menemies[i]),$(mbullet[j]));                   
                }  
            }//end-for2            
        }//end-for1 
    }//end-if
}



/**
 * Óäàëåíèå ñ ýêðàíà àñòåðîèäà è ïóëè, óáèâøåé åãî
 * @param  Object  elem_enemy, elem_bullet
 */
function blow_enemy (elem_enemy,elem_bullet) {
    settings.enemy_blow_ship = true;
    elem_enemy.animate({opacity:'hide'},'slow');
    elem_enemy.remove();
    elem_bullet.animate({opacity:'hide'},'slow');
    elem_bullet.remove();
}


