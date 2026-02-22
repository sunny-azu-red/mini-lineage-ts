<?php

/***************************************************************************
 Mini-Lineage v1.5 @ age.azu.red
 Copyright (C) 2005 Sunny (sunny@azu.red)
 
 Attribution-NonCommercial-ShareAlike 2.5 of Creative Commons
 (http://creativecommons.org)

 You are free:

    * to copy, distribute, display, and perform the work
    * to make derivative works

 Under the following conditions:
 
 Attribution - You must attribute the work in the manner specified
 by the author or licensor.
			   
 Noncommercial - You may not use this work for commercial purposes.
 
 Share Alike - If you alter, transform, or build upon this work, you may 
 distribute the resulting work only under a license identical to this one.

    * For any reuse or distribution, you must make 
      clear to others the license terms of this work.
    * Any of these conditions can be waived if you get 
      permission from the copyright holder.

 Your fair use and other rights are in no way affected by the above.

 This is a human-readable summary of the Legal Code (the full license).
 (http://creativecommons.org/licenses/by-nc-sa/2.5/legalcode)
****************************************************************************/

//-----------------------------------------------------------------
//  Script Startup
//-----------------------------------------------------------------

session_start();
header("Cache-control: private");
ob_start();

error_reporting (E_ALL);
$PHP_SELF = $_SERVER['PHP_SELF'];
$debug = FALSE;

//-----------------------------------------------------------------
//  DB Connection
//-----------------------------------------------------------------

$db = new mysqli('127.0.0.1', 'root', '', 'lineage'); // mysql
// $db = new SQLite3('database.db'); // sqlite
// $db->exec("CREATE TABLE IF NOT EXISTS 'highscores' (
// 	'id' INTEGER NOT NULL,
// 	'total_exp' int(10) NOT NULL DEFAULT '0',
// 	'name' varchar(50) DEFAULT NULL,
// 	'race' varchar(50) DEFAULT NULL,
// 	'adena' int(10) NOT NULL DEFAULT '0',
// 	'level' int(10) NOT NULL DEFAULT '0',
// 	'created' datetime DEFAULT (DATETIME('now')),
// 	PRIMARY KEY('id' AUTOINCREMENT))
// "); // sqlite

//-----------------------------------------------------------------
//  Define the Weapons and Armors array
//-----------------------------------------------------------------

$weapons = array('Fists (7 p.atk)','Elven Sword (16 p.atk)','Stormbringer (18 p.atk)','Sword Of Valhalla (32 p.atk)','Elemental Sword (45 p.atk)','The Forgotten Blade (85 p.atk)');
$armors = array('Regular Clothes (2 p.def)','Leather Armor (10 p.def)','Wooden Armor (15 p.def)','Plate Armor (29 p.def)','Steel Armor (38 p.def)','Mithril Alloy Armor (59 p.def)');

//-----------------------------------------------------------------
//  Create Alternate Row Function
//-----------------------------------------------------------------

function row2color($id_def)
{
	if ($id_def/2 == round($id_def/2)) $row = "con1";
	else $row = "con2";

	return $row;
}

//-----------------------------------------------------------------
//  Create Format Adena Function
//-----------------------------------------------------------------

function format_adena($n, $precision = 1)
{
	if ($n <= 999)
	{
		$n_format = number_format($n, $precision);
		$suffix = '';
	}
	elseif ($n <= 999000)
	{
		$n_format = number_format($n * 0.001, $precision);
		$suffix = 'k';
	}
	elseif ($n <= 999000000)
	{
		$n_format = number_format($n * 0.000001, $precision);
		$suffix = 'kk';
	}
	else
	{
		$n_format = number_format($n * 0.000000001, $precision);
		$suffix = 'kkk';
	}

	// Remove unecessary zeroes after decimal. "1.0" -> "1"; "1.00" -> "1"
	// Intentionally does not affect partials, eg "1.50" -> "1.50"
	if ($precision > 0) {
		$dotzero = '.' . str_repeat('0', $precision);
		$n_format = str_replace($dotzero, '', $n_format);
	}

	return $n_format . $suffix;
}

//-----------------------------------------------------------------
//  Create Status Function
//-----------------------------------------------------------------

function status()
{
	global $PHP_SELF;

	//-----------------------------------------------------------------
	//  Cheat for debugging
	//-----------------------------------------------------------------

	//$_SESSION['experience'] = "0";
	//$_SESSION['adena'] = "1000000";

	//-----------------------------------------------------------------
	//  Calculate his Level
	//-----------------------------------------------------------------

	if($_SESSION['experience'] < 1000) $user_level = 1;
	for($i = 2; $i <= 80; $i++) if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i;

	//-----------------------------------------------------------------
	//  Calculate how much % he has on the EXP bar
	//-----------------------------------------------------------------

	if($user_level == 1) $user_level_excell = 1;
	else $user_level_excell = 0;

	$actual_exp = round($_SESSION['experience'] - ($user_level-$user_level_excell) * (176 + (($user_level - $user_level_excell) * 162)));
	$exp_limit = round(($user_level + 1) * (176 + (($user_level + 1) * 162)) - ($user_level - $user_level_excell) * (176 + (($user_level - $user_level_excell) * 162)));

	$exp_percent = round(($actual_exp / $exp_limit) * 100, 1);
	if($exp_percent > 100) $exp_percent = 100;

	//-----------------------------------------------------------------
	//  Start Display
	//-----------------------------------------------------------------

	if($_SESSION['health'] < "25") $alert = "style='background-color: #f7dfdf;'"; else $alert = NULL;

	$output = "<table class='main' cellspacing='1' cellpadding='4'>";
	$output .= "<tr class='head'><td>Status</td></tr>";
	$output .= "<tr class='con1'><td><table width='100%' cellspacing='0' cellpadding='0'><tr class='empty'><td>{$_SESSION['race']} lvl $user_level </td><td align='right'><a href='$PHP_SELF?a=4'>EXP Table</a></td></tr></table></td></tr>";
	$output .= "<tr class='con1'><td $alert><table border='0' width='100%' cellspacing='0' cellpadding='0'><tr class='empty'><td width='15%'>HP: </td><td width='85%'><table width='{$_SESSION['health']}%' cellpadding='0' cellspacing='0'><tr><td><table width='100%' cellpadding='0' cellspacing='0'><tr><td width='2'><img src='style/hp_a.gif' width='2' height='12'></td><td width='100%' background='style/hp_b.gif'></td><td width='2'><img src='style/hp_c.gif' width='2' height='12'></td></tr></table></td></tr></table></td></tr></table></td></tr>";
	$output .= "<tr class='con1'><td><table border='0' width='100%' cellspacing='0' cellpadding='0'><tr class='empty'><td width='15%'>XP: </td><td width='85%'><table width='$exp_percent%' cellpadding='0' cellspacing='0'><tr><td><table width='100%' cellpadding='0' cellspacing='0'><tr><td width='2'><img src='style/exp_a.gif' width='2' height='12'></td><td width='100%' background='style/exp_b.gif'></td><td width='2'><img src='style/exp_c.gif' width='2' height='12'></td></tr></table></td></tr></table></td></tr></table></td></tr>";
	$output .= "<tr class='con1'><td>Adena: " . format_adena($_SESSION['adena']) . "</td></tr>";
	$output .= "</table>";

	return $output;
}

//-----------------------------------------------------------------
//  Create Inventory Function
//-----------------------------------------------------------------

function inventory()
{
	global $weapons, $armors;

	if($_SESSION['weapon'] > "0") $weapon = $weapons[$_SESSION['weapon']];
	else $weapon = "No Weapon";

	if($_SESSION['armor'] > "0") $armor = $armors[$_SESSION['armor']];
	else $armor = "No Armor";

	$output = "<table class='main' cellspacing='1' cellpadding='4'>";
	$output .= "<tr class='head'><td>Inventory</td></tr>";
	$output .= "<tr class='con1'><td>$armor</td></tr>";
	$output .= "<tr class='con1'><td>$weapon</td></tr>";
	$output .= "</table>";

	return $output;
}

//-----------------------------------------------------------------
//  Load CSS and Base HTML
//-----------------------------------------------------------------

echo "<link href='style/style.css' rel='stylesheet' type='text/css'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>";
echo "<table class='middle' cellspacing='0' cellpadding='0'><tr><td class='zero'><div id='wrapper'>";
echo "<img src='style/header.jpg'><br>";

//-----------------------------------------------------------------
//  Start Navigation
//-----------------------------------------------------------------

switch(@$_GET['a'])
{
	//-----------------------------------------------------------------
	//  Human Start
	//-----------------------------------------------------------------

	case 1:

		//-----------------------------------------------------------------
		//  See if he indeed started the game
		//-----------------------------------------------------------------

		if(!isset($_SESSION['race']) && !isset($_SESSION['health']) && !isset($_SESSION['adena']) && !isset($_SESSION['experience']) && !isset($_SESSION['weapon']) && !isset($_SESSION['armor'])) header("location: $PHP_SELF");

		//-----------------------------------------------------------------
		//  Check if player is dead
		//-----------------------------------------------------------------

		if(!isset($_SESSION['dead']))
		{
			//-----------------------------------------------------------------
			//  Action Switch
			//-----------------------------------------------------------------

			switch(@$_GET['b'])
			{
				//-----------------------------------------------------------------
				//  Weapon Store case
				//-----------------------------------------------------------------

				case 1:

					//-----------------------------------------------------------------
					//  Fuck him in the ass if he cheats
					//-----------------------------------------------------------------

					if(isset($_SESSION['caught'])) header("location: $PHP_SELF?a=1&b=5&c=1");

					//-----------------------------------------------------------------
					//  Second Action Switch
					//-----------------------------------------------------------------

					switch(@$_GET['c'])
					{
						//-----------------------------------------------------------------
						//  Purchase Weapon Case
						//-----------------------------------------------------------------

						case 1:

							//-----------------------------------------------------------------
							//  Purchase the Weapon
							//-----------------------------------------------------------------

							if($_POST['select_weapon'] == 1) header("location: $PHP_SELF?a=1");
							elseif($_POST['select_weapon'] == 2)
							{
								$weapon_cost = "300";

								if($_SESSION['adena'] < $weapon_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=1'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $weapon_cost; $_SESSION['weapon'] = "1"; $_SESSION['weapon_buy'] = "1"; header("location: $PHP_SELF?a=1&b=1"); }
							}
							elseif($_POST['select_weapon'] == 3)
							{
								$weapon_cost = "5000";

								if($_SESSION['adena'] < $weapon_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=1'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $weapon_cost; $_SESSION['weapon'] = "2"; $_SESSION['weapon_buy'] = "1"; header("location: $PHP_SELF?a=1&b=1"); }
							}
							elseif($_POST['select_weapon'] == 4)
							{
								$weapon_cost = "18000";

								if($_SESSION['adena'] < $weapon_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=1'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $weapon_cost; $_SESSION['weapon'] = "3"; $_SESSION['weapon_buy'] = "1"; header("location: $PHP_SELF?a=1&b=1"); }
							}
							elseif($_POST['select_weapon'] == 5)
							{
								$weapon_cost = "160000";

								if($_SESSION['adena'] < $weapon_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=1'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $weapon_cost; $_SESSION['weapon'] = "4"; $_SESSION['weapon_buy'] = "1"; header("location: $PHP_SELF?a=1&b=1"); }
							}
							elseif($_POST['select_weapon'] == 6)
							{
								$weapon_cost = "3000000";

								if($_SESSION['adena'] < $weapon_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=1'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $weapon_cost; $_SESSION['weapon'] = "5"; $_SESSION['weapon_buy'] = "1"; header("location: $PHP_SELF?a=1&b=1"); }
							}

						break;

						//-----------------------------------------------------------------
						//  View Weapons case
						//-----------------------------------------------------------------

						default:

							//-----------------------------------------------------------------
							//  Check for HP and for the weapon he bhought
							//-----------------------------------------------------------------

							if($_SESSION['health'] < "25") $alert = "<font color='red'>Your HP is dangerously low [{$_SESSION['health']}] !! You should buy some food to rejuvenate yourself.</font><br><br>"; else $alert = NULL;
							if(isset($_SESSION['weapon_buy'])) $alert2 = "<font color='green'>You have bought a weapon. [{$weapons[$_SESSION['weapon']]}]</font><br><br>"; else $alert2 = NULL;

							//-----------------------------------------------------------------
							//  Start Display
							//-----------------------------------------------------------------

							?>
								<table width='100%' cellspacing='0' cellpadding='0'>
								<tr valign='top'>
								<td class='empty' width='29%'><?= status() ?><br><?= inventory() ?></td>
								<td class='empty' width='2.5%'></td>
								<td class='empty' width='68.5%'>
								<table class='main' cellspacing='1' cellpadding='4'>
								<tr class='head'><td>Weapons Shop</td></td>
								<tr class='con1'><td>

								<?= $alert ?><?= $alert2 ?>

								You have arrived at Weapons Shop.<br>
								The nice man greets you and lets you look thru his swords.<br>
								You see these weapons available:<br><br>

								<table class='main' width='100%' cellspacing='1' cellpadding='4'>
								<tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Attack</td><td width='20%'>Adena</td></tr>
								<tr class='con1'><td>Elven Sword</td><td>16</td><td><?= format_adena(300) ?></td></tr>
								<tr class='con2'><td>Stormbringer</td><td>18</td><td><?= format_adena(5000) ?></td></tr>
								<tr class='con1'><td>Sword Of Valhalla</td><td>32</td><td><?= format_adena(18000) ?></td></tr>
								<tr class='con2'><td>Elemental Sword</td><td>45</td><td><?= format_adena(160000) ?></td></tr>
								<tr class='con1'><td>The Forgotten Blade</td><td>85</td><td><?= format_adena(3000000) ?></td></tr>
								</table>

								<br>
								<form method="post" action="<?= $PHP_SELF ?>?a=1&b=1&c=1" id="teh_form" name="teh_form">
								<select class="box" name="select_weapon">
								<option value="1">Get out of Weapons Shop</option>
								<option value="2">Buy Elven Sword</option>
								<option value="3">Buy Stormbringer</option>
								<option value="4">Buy Sword Of Valhalla</option>
								<option value="5">Buy Elemental Sword</option>
								<option value="6">Buy The Forgotten Blade</option>
								</select>
								<input type="submit" class="box" name="submit" value="Submit">
								</form>

								</td></tr></table>
								</td></tr></table>
							<?php

							//-----------------------------------------------------------------
							//  Unregister what he bhought
							//-----------------------------------------------------------------

							unset($_SESSION['weapon_buy']);

						break;
					}

				break;

				//-----------------------------------------------------------------
				//  Battlefield case
				//-----------------------------------------------------------------

				case 2:

					//-----------------------------------------------------------------
					//  Cheat for debugging
					//-----------------------------------------------------------------

					//$_SESSION['health'] = "100";
					//$_SESSION['weapon'] = 5;
					//$_SESSION['armor'] = 5;

					//-----------------------------------------------------------------
					//  Check for level before the battle
					//-----------------------------------------------------------------

					for($i = 2; $i <= 80; $i++) if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $before_battle_user_level = $i;

					//-----------------------------------------------------------------
					//  Calculate player's odds based on his weapon
					//-----------------------------------------------------------------

					if($_SESSION['weapon'] == 0){ $orcs = mt_rand(1, 2); $edited_health = mt_rand(50, 55); $edited_experience = mt_rand(50, 150); $edited_adena = mt_rand(50, 90);}
					elseif($_SESSION['weapon'] == 1){ $orcs = mt_rand(4, 7); $edited_health = mt_rand(40, 45); $edited_experience = mt_rand(150, 250); $edited_adena = mt_rand(100, 290);}
					elseif($_SESSION['weapon'] == 2){ $orcs = mt_rand(8, 12); $edited_health = mt_rand(45, 50); $edited_experience = mt_rand(250, 350); $edited_adena = mt_rand(300, 690);}
					elseif($_SESSION['weapon'] == 3){ $orcs = mt_rand(13, 18); $edited_health = mt_rand(50, 55); $edited_experience = mt_rand(350, 450); $edited_adena = mt_rand(700, 1290);}
					elseif($_SESSION['weapon'] == 4){ $orcs = mt_rand(19, 23); $edited_health = mt_rand(45, 50); $edited_experience = mt_rand(450, 550); $edited_adena = mt_rand(1300, 5490);}
					elseif($_SESSION['weapon'] == 5){ $orcs = mt_rand(36, 45); $edited_health = mt_rand(40, 45); $edited_experience = mt_rand(550, 650); $edited_adena = mt_rand(5500, 14900);}

					//-----------------------------------------------------------------
					//  Calculate player's odds based on his armor
					//-----------------------------------------------------------------

					if($_SESSION['armor'] == 0){ $edited_health -= mt_rand(1, 4);}
					elseif($_SESSION['armor'] == 1){ $edited_health -= mt_rand(5, 8); }
					elseif($_SESSION['armor'] == 2){ $edited_health -= mt_rand(9, 12); }
					elseif($_SESSION['armor'] == 3){ $edited_health -= mt_rand(13, 16); }
					elseif($_SESSION['armor'] == 4){ $edited_health -= mt_rand(17, 20); }
					elseif($_SESSION['armor'] == 5){ $edited_health -= mt_rand(21, 24); }

					//-----------------------------------------------------------------
					//  Calculate player's odds based on his level
					//-----------------------------------------------------------------

					if($_SESSION['experience'] >= 593760 /* lvl 60 */){ $orcs += mt_rand(35, 44); $edited_health -= mt_rand(10, 12); $edited_experience += mt_rand(350, 500); $edited_adena += mt_rand(5000, 15000);}
					elseif($_SESSION['experience'] >= 266240 /* lvl 40 */){ $orcs += mt_rand(25, 34); $edited_health -= mt_rand(7, 9); $edited_experience += mt_rand(150, 350); $edited_adena += mt_rand(1500, 4000);}
					elseif($_SESSION['experience'] >= 68320 /* lvl 20 */){ $orcs += mt_rand(15, 24); $edited_health -= mt_rand(4, 6); $edited_experience += mt_rand(50, 150); $edited_adena += mt_rand(150, 400);}
					elseif($_SESSION['experience'] >= 17960 /* lvl 10 */){ $orcs += mt_rand(5, 14); $edited_health -= mt_rand(1, 3); $edited_experience += mt_rand(10, 50); $edited_adena += mt_rand(10, 40);}

					//-----------------------------------------------------------------
					//  Update the hp, exp and adena
					//-----------------------------------------------------------------

					$_SESSION['health'] -= abs($edited_health);
					$_SESSION['experience'] += $edited_experience;
					$_SESSION['adena'] += $edited_adena;

					//-----------------------------------------------------------------
					//  Kill the player if health dropped to or under 0
					//-----------------------------------------------------------------

					if($_SESSION['health'] <= 0){ $_SESSION['health'] = "0"; $_SESSION['dead'] = "1"; unset($_SESSION['caught']); header("location: $PHP_SELF?a=1"); exit; }

					//-----------------------------------------------------------------
					//  Check for level after the battle
					//-----------------------------------------------------------------

					for($i = 2; $i <= 80; $i++) if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $after_battle_user_level = $i;

					//-----------------------------------------------------------------
					//  Notify The player that he leveled up and fill his HP
					//-----------------------------------------------------------------

					if(!isset($before_battle_user_level)) $before_battle_user_level = 1;
					if(!isset($after_battle_user_level)) $after_battle_user_level = 1;

					if($before_battle_user_level < $after_battle_user_level){ $new_lvl = "1"; $_SESSION['health'] = 100; }
					else $new_lvl = NULL;

					//-----------------------------------------------------------------
					//  Calculate his luck.... muhahahahahah
					//-----------------------------------------------------------------

					$luck = mt_rand(1, 15);
					if($luck == "5") $_SESSION['caught'] = "1";
					else unset($_SESSION['caught']);

					//-----------------------------------------------------------------
					//  Define the random next path
					//-----------------------------------------------------------------

					$next_moves_rand = mt_rand(0, 40);
					$next_moves_array = array("Look behind the tree","Walk Further","Check the cave","Walk Further","Walk Further","Jump in the bushes","Walk Further","Walk Further","Walk Further","Walk Further","Walk Further","Walk Further","Walk Further","Look Behind","Walk Further","Walk Further","Run up the hill","Walk Further","Go and look behind the big rock","Walk Further","Walk Further","Enter the Abandoned House","Walk Further","Enter the Abandoned Town","Walk Further","Walk Further","Walk Further","Walk Further","Scream 'I WANT MORE ORCS'","Walk Further","Walk Further","Check out the Orc Ruins","Walk Further","Walk Further","Open the locked tower","Walk Further","Walk Further","Walk Further","Walk Further","Walk Further","Walk Further");
					$next_move = $next_moves_array[$next_moves_rand];

					//-----------------------------------------------------------------
					//  Define the random lucky surprise
					//-----------------------------------------------------------------

					$lucky_surprise_rand = mt_rand(0, 4);
					$lucky_surprise_array = array("Out of the blue 3 Orcs surrounded you and you can't escape.","You forgot to check your back and you get stormed by 6 Orcs.","You find yourself in a delicate position, the Orc Leader has come with reinforcements.","As you were walking along 4 Orcs jumped out of the bushes.","You reached a dead-end and you find yourself cornered by 3 Orcs.");
					$lucky_surprise = $lucky_surprise_array[$lucky_surprise_rand];

					//-----------------------------------------------------------------
					//  Start Display
					//-----------------------------------------------------------------

					?>
						<table width='100%' cellspacing='0' cellpadding='0'>
						<tr valign='top'>
						<td class='empty' width='29%'><?= status() ?><br><?= inventory() ?></td>
						<td class='empty' width='2.5%'></td>
						<td class='empty' width='68.5%'>

						<table class='main' cellspacing='1' cellpadding='4'>
						<tr class='head'><td>Battleground</td></td>
						<tr class='con1'><td>
						You are on the battleground.<br>
						Using your <?= $weapons[$_SESSION['weapon']] ?> you have killed <?= $orcs ?> <?php if($orcs == 1) { ?>Orc.<?php } else {?>Orcs.<?php } ?><br>
						Your Health <?php if($new_lvl == "1") { ?>was rejuvenated<?php } else { ?>droped<?php } ?> to <?= $_SESSION['health'] ?> <?php if($new_lvl == "1") { ?>plus<?php } else { ?>but<?php } ?> you gained <?= $edited_experience ?> Experience and <?= format_adena($edited_adena) ?> adena.<br><br>
						<?php if($new_lvl == "1") { ?>Congratulations! You have reached level <?php for($i = 2; $i <= 80; $i++) if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i; echo $user_level;?>.<br><br><?php } ?>
						<?php if($luck == "5") { ?><?=$lucky_surprise?><br><br><?php } ?>
						<?php if($luck != "5") { ?><a href='<?= $PHP_SELF ?>?a=1'>Go back in town</a> | <a href='<?= $PHP_SELF ?>?a=1&b=2'><?=$next_move?></a><?php } else { ?><a href='<?= $PHP_SELF ?>?a=1&b=2'>Fight them!</a><?php } ?>
						</td></tr></table>

						</td></tr></table>
					<?php

				break;

				//-----------------------------------------------------------------
				//  Inn case
				//-----------------------------------------------------------------

				case 3:

					//-----------------------------------------------------------------
					//  Fuck him in the ass if he cheats
					//-----------------------------------------------------------------

					if(isset($_SESSION['caught'])) header("location: $PHP_SELF?a=1&b=5&c=1");

					//-----------------------------------------------------------------
					//  Second Action Switch
					//-----------------------------------------------------------------

					switch(@$_GET['c'])
					{
						//-----------------------------------------------------------------
						//  Purchase Food/Drinks Case
						//-----------------------------------------------------------------

						case 1:

							//-----------------------------------------------------------------
							//  Purchase the Food
							//-----------------------------------------------------------------

							if($_POST['item'] == 1) header("location: $PHP_SELF?a=1");
							elseif($_POST['item'] == 2)
							{
								$food_cost = "8";

								if($_SESSION['adena'] < $food_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=3'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $food_cost; $_SESSION['health'] = $_SESSION['health'] + 4; $_SESSION['inn_buy'] = 1; if($_SESSION['health'] > "100") $_SESSION['health'] = "100"; header("location: $PHP_SELF?a=1&b=3"); }
							}
							elseif($_POST['item'] == 3)
							{
								$food_cost = "11";

								if($_SESSION['adena'] < $food_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=3'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $food_cost; $_SESSION['health'] = $_SESSION['health'] + 6; $_SESSION['inn_buy'] = 1; if($_SESSION['health'] > "100") $_SESSION['health'] = "100"; header("location: $PHP_SELF?a=1&b=3"); }
							}
							elseif($_POST['item'] == 4)
							{
								$food_cost = "30";

								if($_SESSION['adena'] < $food_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=3'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $food_cost; $_SESSION['health'] = $_SESSION['health'] + 15; $_SESSION['inn_buy'] = 1; if($_SESSION['health'] > "100") $_SESSION['health'] = "100"; header("location: $PHP_SELF?a=1&b=3"); }
							}
							elseif($_POST['item'] == 5)
							{
								$food_cost = "80";

								if($_SESSION['adena'] < $food_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=3'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $food_cost; $_SESSION['health'] = $_SESSION['health'] + 25; $_SESSION['inn_buy'] = 1; if($_SESSION['health'] > "100") $_SESSION['health'] = "100"; header("location: $PHP_SELF?a=1&b=3"); }
							}
							elseif($_POST['item'] == 6)
							{
								$food_cost = "180";

								if($_SESSION['adena'] < $food_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=3'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $food_cost; $_SESSION['health'] = $_SESSION['health'] + 50; $_SESSION['inn_buy'] = 1; if($_SESSION['health'] > "100") $_SESSION['health'] = "100"; header("location: $PHP_SELF?a=1&b=3"); }
							}

						break;

						//-----------------------------------------------------------------
						//  View food/drinks case
						//-----------------------------------------------------------------

						default:

							//-----------------------------------------------------------------
							//  Check for HP and for the food he bhought
							//-----------------------------------------------------------------

							if($_SESSION['health'] < "25") $alert = "<font color='red'>Your HP is dangerously low [{$_SESSION['health']}] !! You should buy some food to rejuvenate yourself.</font><br><br>"; else $alert = NULL;
							if(isset($_SESSION['inn_buy'])) $alert2 = "<font color='green'>You have bought food. Your HP has risen to [{$_SESSION['health']}]</font><br><br>"; else $alert2 = NULL;

							//-----------------------------------------------------------------
							//  Start Display
							//-----------------------------------------------------------------

							?>
								<table width='100%' cellspacing='0' cellpadding='0'>
								<tr valign='top'>
								<td class='empty' width='29%'><?= status() ?><br><?= inventory() ?></td>
								<td class='empty' width='2.5%'></td>
								<td class='empty' width='68.5%'>
								<table class='main' cellspacing='1' cellpadding='4'>
								<tr class='head'><td>Inn</td></td>
								<tr class='con1'><td>

								<?= $alert ?><?= $alert2 ?>

								You have arrived at Inn.<br>
								The old lady greets you and sets you at a table.<br>
								You see a menu and you open it. Inside you read:<br><br>

								<table class='main' width='100%' cellspacing='1' cellpadding='4'>
								<tr class='bottom'><td width='50%'>Name</td><td width='30%'>HP Restoration</td><td width='20%'>Adena</td></tr>
								<tr class='con1'><td>Juice</td><td>4</td><td><?= format_adena(8) ?></td></tr>
								<tr class='con2'><td>Apple</td><td>6</td><td><?= format_adena(11) ?></td></tr>
								<tr class='con1'><td>Hotdog</td><td>15</td><td><?= format_adena(30) ?></td></tr>
								<tr class='con2'><td>Mash Potatos</td><td>25</td><td><?= format_adena(80) ?></td></tr>
								<tr class='con1'><td>Turkey</td><td>50</td><td><?= format_adena(180) ?></td></tr>
								</table>

								<br>
								<form method="post" action="<?= $PHP_SELF ?>?a=1&b=3&c=1" id="teh_form" name="teh_form">
								<select class="box" name="item">
								<option value="1">Get out of Inn</option>
								<option value="2">Buy Juice (4 health restoration)</option>
								<option value="3">Buy Apple (6 health restoration)</option>
								<option value="4">Buy Hotdog (15 health restoration)</option>
								<option value="5">Buy Mash Potatos (25 health restoration)</option>
								<option value="6">Buy Turkey (50 health restoration)</option>
								</select>
								<input type="submit" class="box" name="submit" value="Submit">
								</form>

								</td></tr></table>
								</td></tr></table>
							<?php

							//-----------------------------------------------------------------
							//  Unregister what he bhought
							//-----------------------------------------------------------------

							unset($_SESSION['inn_buy']);

						break;
					}

				break;

				//-----------------------------------------------------------------
				//  Armor Store case
				//-----------------------------------------------------------------

				case 4:

					//-----------------------------------------------------------------
					//  Fuck him in the ass if he cheats
					//-----------------------------------------------------------------

					if(isset($_SESSION['caught'])) header("location: $PHP_SELF?a=1&b=5&c=1");

					//-----------------------------------------------------------------
					//  Second Action Switch
					//-----------------------------------------------------------------

					switch(@$_GET['c'])
					{
						//-----------------------------------------------------------------
						//  Purchase Armor Case
						//-----------------------------------------------------------------

						case 1:

							//-----------------------------------------------------------------
							//  Purchase the Armor
							//-----------------------------------------------------------------

							if($_POST['select_armor'] == 1) header("location: $PHP_SELF?a=1");
							elseif($_POST['select_armor'] == 2)
							{
								$armor_cost = "500";

								if($_SESSION['adena'] < $armor_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=4'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $armor_cost; $_SESSION['armor'] = "1"; $_SESSION['armor_buy'] = 1; header("location: $PHP_SELF?a=1&b=4"); }
							}
							elseif($_POST['select_armor'] == 3)
							{
								$armor_cost = "8000";

								if($_SESSION['adena'] < $armor_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=4'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $armor_cost; $_SESSION['armor'] = "2"; $_SESSION['armor_buy'] = 1; header("location: $PHP_SELF?a=1&b=4"); }
							}
							elseif($_POST['select_armor'] == 4)
							{
								$armor_cost = "30000";

								if($_SESSION['adena'] < $armor_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=4'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $armor_cost; $_SESSION['armor'] = "3"; $_SESSION['armor_buy'] = 1; header("location: $PHP_SELF?a=1&b=4"); }
							}
							elseif($_POST['select_armor'] == 5)
							{
								$armor_cost = "120000";

								if($_SESSION['adena'] < $armor_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=4'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $armor_cost; $_SESSION['armor'] = "4"; $_SESSION['armor_buy'] = 1; header("location: $PHP_SELF?a=1&b=4"); }
							}
							elseif($_POST['select_armor'] == 6)
							{
								$armor_cost = "1500000";

								if($_SESSION['adena'] < $armor_cost){ echo "<table class='main' cellspacing='1' cellpadding='4'><tr class='head'><td>Error</td></td><tr class='con1'><td>Sorry, you need more money.<br><br><a href='$PHP_SELF?a=1&b=4'>Go back</a></td></tr></table>"; }
								else { $_SESSION['adena'] = $_SESSION['adena'] - $armor_cost; $_SESSION['armor'] = "5"; $_SESSION['armor_buy'] = 1; header("location: $PHP_SELF?a=1&b=4"); }
							}

						break;

						//-----------------------------------------------------------------
						//  View Armor case
						//-----------------------------------------------------------------

						default:

							//-----------------------------------------------------------------
							//  Check for HP and for the armor bhought
							//-----------------------------------------------------------------

							if($_SESSION['health'] < "25") $alert = "<font color='red'>Your HP is dangerously low [{$_SESSION['health']}] !! You should buy some food to rejuvenate yourself.</font><br><br>"; else $alert = NULL;
							if(isset($_SESSION['armor_buy'])) $alert2 = "<font color='green'>You have bought an Armor. [{$armors[$_SESSION['armor']]}]</font><br><br>"; else $alert2 = NULL;

							//-----------------------------------------------------------------
							//  Start Display
							//-----------------------------------------------------------------

							?>
								<table width='100%' cellspacing='0' cellpadding='0'>
								<tr valign='top'>
								<td class='empty' width='29%'><?= status() ?><br><?= inventory() ?></td>
								<td class='empty' width='2.5%'></td>
								<td class='empty' width='68.5%'>
								<table class='main' cellspacing='1' cellpadding='4'>
								<tr class='head'><td>Armor Shop</td></td>
								<tr class='con1'><td>

								<?= $alert ?><?= $alert2 ?>

								You have arrived at Armor Shop.<br>
								The old man greets you and lets you look thru his Armors.<br>
								You see these Armors available:<br><br>

								<table class='main' width='100%' cellspacing='1' cellpadding='4'>
								<tr class='bottom'><td width='50%'>Name</td><td width='30%'>Physical Defense</td><td width='20%'>Adena</td></tr>
								<tr class='con1'><td>Leather Armor</td><td>10</td><td><?= format_adena(500) ?></td></tr>
								<tr class='con2'><td>Wooden Armor</td><td>15</td><td><?= format_adena(8000) ?></td></tr>
								<tr class='con1'><td>Plate Armor</td><td>29</td><td><?= format_adena(30000) ?></td></tr>
								<tr class='con2'><td>Steel Armor</td><td>38</td><td><?= format_adena(120000) ?></td></tr>
								<tr class='con1'><td>Mithril Alloy Armor</td><td>59</td><td><?= format_adena(1500000) ?></td></tr>
								</table>

								<br>
								<form method="post" action="<?= $PHP_SELF ?>?a=1&b=4&c=1" id="teh_form" name="teh_form">
								<select class="box" name="select_armor">
								<option value="1">Get out of Armor Shop</option>
								<option value="2">Buy Leather Armor</option>
								<option value="3">Buy Wooden Armor</option>
								<option value="4">Buy Plate Armor</option>
								<option value="5">Buy Steel Armor</option>
								<option value="6">Buy Mithril Alloy Armor</option>
								</select>
								<input type="submit" class="box" name="submit" value="Submit">
								</form>

								</td></tr></table>
								</td></tr></table>
							<?php

							//-----------------------------------------------------------------
							//  Unregister what he bhought
							//-----------------------------------------------------------------

							unset($_SESSION['armor_buy']);

						break;
					}

				break;

				//-----------------------------------------------------------------
				//  Commit Suicide
				//-----------------------------------------------------------------

				case 5:

					//-----------------------------------------------------------------
					//  Fuck him in the ass if he cheats
					//-----------------------------------------------------------------

					if(isset($_SESSION['caught'])) header("location: $PHP_SELF?a=1&b=5&c=1");

					//-----------------------------------------------------------------
					//  Second Action Switch
					//-----------------------------------------------------------------

					switch(@$_GET['c'])
					{
						//-----------------------------------------------------------------
						//  Do Suicide
						//-----------------------------------------------------------------

						case 1:

							//-----------------------------------------------------------------
							//  Kill the player
							//-----------------------------------------------------------------

							$_SESSION['dead'] = "1";

							//-----------------------------------------------------------------
							//  Redirect when finished
							//-----------------------------------------------------------------

							header("location: $PHP_SELF");

						break;

						//-----------------------------------------------------------------
						//  Exit Suicide Menu
						//-----------------------------------------------------------------

						case 2:

							//-----------------------------------------------------------------
							//  Redirect when finished
							//-----------------------------------------------------------------

							header("location: $PHP_SELF");

						break;

						//-----------------------------------------------------------------
						//  Show Confirmation
						//-----------------------------------------------------------------

						default:

							//-----------------------------------------------------------------
							//  Start Display
							//-----------------------------------------------------------------

							?>
								<table class='main' cellspacing='1' cellpadding='4'>
								<tr class='head'><td>Commit Suicide</td></td>
								<tr class='con1'><td>
								Are you sure you want to kill yourself?
								<form method="post" action="" id="teh_form"  name="teh_form" onsubmit="document.location.href = '<?= $PHP_SELF ?>?a=1&b=5&c=' + teh_form.c.value; return false;">
								<select class="box" name="c">
								<option value="1">Yes, stab yourself in the heart</option>
								<option value="2">No, my bad</option>
								</select>
								<input type="submit" class="box" style="width:70" name="submit" value="Submit">
								</form>
								</center>
								</td></tr></table>
							<?php

						break;
					}

				break;

				//-----------------------------------------------------------------
				//  Default case
				//-----------------------------------------------------------------

				default:

					//-----------------------------------------------------------------
					//  Fuck him in the ass if he cheats
					//-----------------------------------------------------------------

					if(isset($_SESSION['caught'])) header("location: $PHP_SELF?a=1&b=5&c=1");

					//-----------------------------------------------------------------
					//  Do we show the welcome message?
					//-----------------------------------------------------------------

					$welcome = true;
					if(isset($_SESSION['welcome'])) unset($_SESSION['welcome']);
					else $welcome = false;

					//-----------------------------------------------------------------
					//  Check if the player just started
					//-----------------------------------------------------------------

					if(!isset($_SESSION['first_time']))
					{
						$_SESSION['race'] = "Human";
						$_SESSION['health'] = "100";
						$_SESSION['adena'] = "300";
						$_SESSION['experience'] = "0";
						$_SESSION['weapon'] = "0";
						$_SESSION['armor'] = "0";
						$_SESSION['welcome'] = TRUE;
					}

					//-----------------------------------------------------------------
					//  Check for HP
					//-----------------------------------------------------------------

					if($_SESSION['health'] < "25") $alert = "<font color='red'>Your HP is dangerously low [{$_SESSION['health']}] !! You should buy some food to rejuvenate yourself.</font><br><br>"; else $alert = NULL;

					//-----------------------------------------------------------------
					//  Define the Age and what you call him
					//-----------------------------------------------------------------

					$age_random = mt_rand(10, 70);

					if($age_random <= 18) $definition = "boy";
					elseif($age_random <= 50) $definition = "man";
					elseif($age_random > 50) $definition = "old timer";

					//-----------------------------------------------------------------
					//  Start Display
					//-----------------------------------------------------------------

					?>
						<table width='100%' cellspacing='0' cellpadding='0'>
						<tr valign='top'>
						<td class='empty' width='29%'><?= status() ?><br><?= inventory() ?></td>
						<td class='empty' width='2.5%'></td>
						<td class='empty' width='68.5%'>
						<table class='main' cellspacing='1' cellpadding='4'>
						<tr class='head'><td>Home Town</td></td>
						<tr class='con1'><td>

						<?= $alert ?>
						<?php if($welcome) { ?>You have selected to be Human. Congratulations!<br><?php } ?>Welcome to City of Aden.
						<?php if($welcome) { ?>You are an average <?= $definition ?>, aged <?= $age_random ?>, and you came here with <?= format_adena($_SESSION['adena']) ?> adena.<?php } ?><br><br>
						<form method="post" action="" id="teh_form"  name="teh_form" onsubmit="document.location.href = '<?= $PHP_SELF ?>?a=1&b=' + teh_form.b.value; return false;">
						<select name="b" class="box"><option value="4">Go to Armor Shop</option><option value="1">Go to Weapon Shop</option><option value="3">Go to Inn</option><option value="2">Fight on the Battlefield</option><option value="5">Commit Suicide</option></select>
						<input type="submit" class="box" name="submit" value="Submit">
						</form>

						</td></tr></table>
						</td></tr></table>
					<?php

					//-----------------------------------------------------------------
					//  Write His first time
					//-----------------------------------------------------------------

					$_SESSION['first_time'] = TRUE;

				break;
			}
		}

		//-----------------------------------------------------------------
		//  If player is dead...
		//-----------------------------------------------------------------

		else
		{
			if(!isset($_SESSION['wrote_highscore']))
			{
				//-----------------------------------------------------------------
				//  Action Switch
				//-----------------------------------------------------------------

				switch(@$_GET['b'])
				{
					//-----------------------------------------------------------------
					//  Write Highscores
					//-----------------------------------------------------------------

					case 1:

						//-----------------------------------------------------------------
						//  Second Action Switch
						//-----------------------------------------------------------------

						switch(@$_GET['c'])
						{
							//-----------------------------------------------------------------
							//  Write Him
							//-----------------------------------------------------------------

							case 1:

								//-----------------------------------------------------------------
								//  Calculate Level
								//-----------------------------------------------------------------

								for($i = 2; $i <= 80; $i++) if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i;
								if(!isset($user_level)) $user_level = 1;

								//-----------------------------------------------------------------
								//  Write in DB
								//-----------------------------------------------------------------

								$s = $db->prepare("INSERT INTO highscores (total_exp, name, race, adena, level, created) VALUES (?, ?, ?, ?, ?, now())"); // mysql
								// $s = $db->prepare("INSERT INTO highscores (total_exp, name, race, adena, level) VALUES (?, ?, ?, ?, ?)"); // sqlite
								if($s) {
									$s->bind_param('issii', $ia, $ib, $ic, $id, $ie); // mysql
									// $s->bindParam(1, $ia, SQLITE3_INTEGER); // sqlite
									// $s->bindParam(2, $ib, SQLITE3_TEXT); // sqlite
									// $s->bindParam(3, $ic, SQLITE3_TEXT); // sqlite
									// $s->bindParam(4, $id, SQLITE3_INTEGER); // sqlite
									// $s->bindParam(5, $ie, SQLITE3_INTEGER); // sqlite
									$ia = $_SESSION['experience'];
									$ib = $_POST['name'] ? $_POST['name'] : null;
									$ic = $_SESSION['race'];
									$id = $_SESSION['adena'];
									$ie = $user_level;
									$s->execute();
								}

								$_SESSION['wrote_highscore'] = "1";

								//-----------------------------------------------------------------
								//  Redirect when finished
								//-----------------------------------------------------------------

								header("location: $PHP_SELF?a=3");

							break;

							//-----------------------------------------------------------------
							//  Write Highscores Form
							//-----------------------------------------------------------------

							default:

								//-----------------------------------------------------------------
								//  Start Display
								//-----------------------------------------------------------------

								?>
									<table class='main' cellspacing='1' cellpadding='4'>
									<tr class='head'><td>Highscores</td></td>
									<tr class='con1'><td>
									<form method="post" action="<?= $PHP_SELF ?>?a=1&b=1&c=1">
									Name: <input type="text" class="box" name="name" value="<?= (isset($is_loged_in) ? $_SESSION['username']:NULL) ?>">
									<input type="submit" class="box" name="submit" value="Submit">
									</form>
									</td></tr></table>
								<?php

							break;
						}

					break;

					//-----------------------------------------------------------------
					//  Play Again without writing
					//-----------------------------------------------------------------

					case 2:

						//-----------------------------------------------------------------
						//  Unregister all sessions
						//-----------------------------------------------------------------

						unset($_SESSION['race']);
						unset($_SESSION['health']);
						unset($_SESSION['adena']);
						unset($_SESSION['experience']);
						unset($_SESSION['first_time']);
						unset($_SESSION['welcome']);
						unset($_SESSION['weapon']);
						unset($_SESSION['armor']);
						unset($_SESSION['dead']);
						unset($_SESSION['wrote_highscore']);
						unset($_SESSION['weapon_buy']);
						unset($_SESSION['inn_buy']);
						unset($_SESSION['armor_buy']);
						unset($_SESSION['caught']);

						//-----------------------------------------------------------------
						//  Redirect to game start
						//-----------------------------------------------------------------

						header("location: $PHP_SELF");

					break;

					//-----------------------------------------------------------------
					//  Show Dead Message or Cheat Message
					//-----------------------------------------------------------------

					default:

						//-----------------------------------------------------------------
						//  Select if he cheated or if he's honestly dead
						//-----------------------------------------------------------------

						if(isset($_SESSION['caught'])) $critical_message = "You were caught cheating. Game Over !!";
						else $critical_message = "Your Health droped to 0 and you died.";

						//-----------------------------------------------------------------
						//  Start Display
						//-----------------------------------------------------------------

						?>
							<table class='main' cellspacing='1' cellpadding='4'>
							<tr class='head'><td>Ups...</td></td>
							<tr class='con1'><td>
							<font color='red'><?=$critical_message?></font><br><br>
							<a href="<?= $PHP_SELF ?>?a=1&b=1">Write your status in Highscores!</a><br><a href="<?= $PHP_SELF ?>?a=1&b=2">Play again?</a>
							</td></tr></table>
						<?php

					break;
				}
			}

			else header("location: $PHP_SELF?a=3");
		}

	break;

	//-----------------------------------------------------------------
	//  Orc Start
	//-----------------------------------------------------------------

	case 2:

		//-----------------------------------------------------------------
		//  Start Display
		//-----------------------------------------------------------------

		?>
			<table class='main' cellspacing='1' cellpadding='4'>
			<tr class='head'><td>Hmmm</td></td>
			<tr class='con1'><td>
			Module not yet finished :(<br><br>
			<a href="<?= $PHP_SELF ?>">Go back</a>
			</td></tr></table>
		<?php

	break;

	//-----------------------------------------------------------------
	//  View Highscores
	//-----------------------------------------------------------------

	case 3:

		//-----------------------------------------------------------------
		//  Unregister all sessions
		//-----------------------------------------------------------------

		unset($_SESSION['race']);
		unset($_SESSION['health']);
		unset($_SESSION['adena']);
		unset($_SESSION['experience']);
		unset($_SESSION['first_time']);
		unset($_SESSION['welcome']);
		unset($_SESSION['weapon']);
		unset($_SESSION['armor']);
		unset($_SESSION['dead']);
		unset($_SESSION['wrote_highscore']);
		unset($_SESSION['weapon_buy']);
		unset($_SESSION['inn_buy']);
		unset($_SESSION['armor_buy']);
		unset($_SESSION['caught']);

		//-----------------------------------------------------------------
		//  Load highscores
		//-----------------------------------------------------------------

		$layout = NULL;
		$highscores = $db->query("SELECT * FROM highscores ORDER BY total_exp DESC, adena DESC LIMIT 25");
		if($highscores->num_rows) // mysql
		// if(!empty($highscores->fetchArray())) // sqlite
		{
			foreach($highscores as $idx=>$highscore) // mysql
			// $highscores->reset(); for ($idx = 1; $highscore = $highscores->fetchArray(SQLITE3_ASSOC); $idx++) // sqlite
			{
				if(!$highscore['name']) $highscore['name'] = "Anonymous";
				$layout .= "<tr class='".row2color($idx)."'>".
					"<td>{$highscore['name']}</td>".
					// "<td>{$highscore['race']}</td>".
					"<td>{$highscore['level']}</td>".
					"<td>{$highscore['total_exp']}</td>".
					"<td>" . format_adena($highscore['adena']) . "</td>".
					"<td>".date('d/m/y, H:i', strtotime($highscore['created']))."</td>".
				"</tr>";
			}
		}

		else $layout = "<tr class='con1'><td colspan='5'>No highscores...</td></tr>";

		//-----------------------------------------------------------------
		//  See where he comes from
		//-----------------------------------------------------------------

		$headerref = getenv("HTTP_REFERER");

		if($headerref == "{$_SERVER['REQUEST_SCHEME']}://{$_SERVER['HTTP_HOST']}{$_SERVER['PHP_SELF']}?a=1&b=1") $play = "Play again?";
		else $play = "Go back";

		//-----------------------------------------------------------------
		//  Display Highscores
		//-----------------------------------------------------------------

		?>
			<table class='main' cellspacing='1' cellpadding='4'>
			<tr class='head'><td>Top 25 Players</td></td>
			<tr class='con1'><td>
			<table class='main' width='100%' cellspacing='1' cellpadding='4'>
			<tr class='bottom'>
			<td width='30%'>Name</td>
			<?php /** <td width='10%'>Race</td> **/ ?>
			<td width='10%'>Level</td>
			<td width='20%'>Total exp</td>
			<td width='20%'>Adena</td>
			<td width='20%'>Date</td>
			</tr>
			<?= $layout ?>
			</table>
			<br><br><a href="<?= $PHP_SELF ?>"><?= $play ?></a>
			</td></tr></table>
		<?php

	break;

	//-----------------------------------------------------------------
	//  View Exp lvl
	//-----------------------------------------------------------------

	case 4:

		//-----------------------------------------------------------------
		//  Start Display
		//-----------------------------------------------------------------

		?>
			<table class='main' cellspacing='1' cellpadding='4'>
			<tr class='head'><td>Experience Table [Current XP: <?= $_SESSION['experience'] ?>]</td></td>
			<tr class='con1'><td>

			<table width='100%' cellspacing='0' cellpadding='0'>
			<tr class='empty' valign='top'>
			<td width='24%'>

			<table class='main' width='100%' cellspacing='1' cellpadding='4'>
			<tr class='bottom'><td width='30%' align='center'>Level</td><td width='70%'>Experience</td></tr>
			<?php for($i = 2; $i <= 80; $i++){ if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i; if(!isset($user_level)) $user_level = 1; } for($i = 1; $i <= 20; $i++) { $exp_calc = ($i == 1 ? "0":round($i * (176 + ($i * 162)))); $tr_class = ($user_level == $i ? "con4":row2color($i)); echo "<tr class='$tr_class'><td align='center'>$i</td><td>$exp_calc</td></tr>"; } ?>
			</table>

			</td>

			<td width='1%'></td>
			<td width='24%'>

			<table class='main' width='100%' cellspacing='1' cellpadding='4'>
			<tr class='bottom'><td width='30%' align='center'>Level</td><td width='70%'>Experience</td></tr>
			<?php for($i = 2; $i <= 80; $i++){ if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i; if(!isset($user_level)) $user_level = 1; } for($i = 21; $i <= 40; $i++) { $exp_calc = round($i * (176 + ($i * 162))); $tr_class = ($user_level == $i ? "con4":row2color($i)); echo "<tr class='$tr_class'><td align='center'>$i</td><td>$exp_calc</td></tr>"; } ?>
			</table>

			</td>

			<td width='1%'></td>
			<td width='24%'>

			<table class='main' width='100%' cellspacing='1' cellpadding='4'>
			<tr class='bottom'><td width='30%' align='center'>Level</td><td width='70%'>Experience</td></tr>
			<?php for($i = 2; $i <= 80; $i++){ if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i; if(!isset($user_level)) $user_level = 1; } for($i = 41; $i <= 60; $i++) { $exp_calc = round($i * (176 + ($i * 162))); $tr_class = ($user_level == $i ? "con4":row2color($i)); echo "<tr class='$tr_class'><td align='center'>$i</td><td>$exp_calc</td></tr>"; } ?>
			</table>

			</td>

			<td width='1%'></td>
			<td width='25%'>

			<table class='main' width='100%' cellspacing='1' cellpadding='4'>
			<tr class='bottom'><td width='30%' align='center'>Level</td><td width='70%'>Experience</td></tr>
			<?php for($i = 2; $i <= 80; $i++){ if($_SESSION['experience'] >= round($i * (176 + ($i * 162)))) $user_level = $i; if(!isset($user_level)) $user_level = 1; } for($i = 61; $i <= 80; $i++) { $exp_calc = round($i * (176 + ($i * 162))); $tr_class = ($user_level == $i ? "con4":row2color($i)); echo "<tr class='$tr_class'><td align='center'>$i</td><td>$exp_calc</td></tr>"; } ?>
			</table>

			</td></tr></table>
			<br><br><a href="<?= $PHP_SELF ?>">Go back</a>
			</td></tr></table>
		<?php

	break;

	//-----------------------------------------------------------------
	//  Start Game
	//-----------------------------------------------------------------

	default:

		//-----------------------------------------------------------------
		//  Check where they belong
		//-----------------------------------------------------------------

		if(@$_SESSION['race'] == "Human") header("location: $PHP_SELF?a=1");
		if(@$_SESSION['race'] == "Orc") header("location: $PHP_SELF?a=2");

		//-----------------------------------------------------------------
		//  Send the users to home town
		//-----------------------------------------------------------------

		if(isset($_POST['select_race']))
		{
			if($_POST['select_race'] == 1) header("location: $PHP_SELF?a=1");
			else header("location: $PHP_SELF?a=2");
		}

		//-----------------------------------------------------------------
		//  Start Display
		//-----------------------------------------------------------------

		?>
			<table class="main" cellspacing='1' cellpadding='4'>
			<tr class="head"><td>Game Start | <a href="<?= $PHP_SELF ?>?a=3">See Highscores</a></td></tr>
			<tr class="con1"><td>
			Hello!<br><br>
			What do you want to be?<br><table><tr><td></td></tr></table>
			<form method="post" action="<?= $PHP_SELF ?>">
			<select class="box" name="select_race"><option value="1">Human</option><option value="2">Orc</option></select>
			<input type="submit" class="box" name="submit" value="Submit">
			</form>
			</td></tr>
			</table>
		<?php

	break;
}

echo "</div><div id='copyright'>Version 1.5 &copy; 2005 - " . date('Y') . "</div></td></tr></table>";

//-----------------------------------------------------------------
//  Start Debug
//-----------------------------------------------------------------

if($debug == TRUE)
{
	echo "<br><div align='left'><pre><b>SESSION DEBUG:</b><br>";
	var_dump($_SESSION);
	echo "</pre></div></div>";
}

//-----------------------------------------------------------------
//  Script shutdown
//-----------------------------------------------------------------

ob_end_flush();
$db->close();

?>