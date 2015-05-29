'use strict';

// Declare app level module which depends on views, and components
(function () {
    var app = angular.module('myApp', []);
    var api_key = '';

    app.controller('PlayerSearchController', ['$http', function ($http) {
        var search = this;
        search.player_match = {};

        search.player_name = '';

        search.player_summoner_info = {};

        search.match_history = [];

        search.champion_list = {
            "keys": {
                "35": "Shaco",
                "36": "DrMundo",
                "33": "Rammus",
                "34": "Anivia",
                "157": "Yasuo",
                "39": "Irelia",
                "37": "Sona",
                "154": "Zac",
                "38": "Kassadin",
                "150": "Gnar",
                "43": "Karma",
                "42": "Corki",
                "41": "Gangplank",
                "40": "Janna",
                "201": "Braum",
                "22": "Ashe",
                "23": "Tryndamere",
                "24": "Jax",
                "25": "Morgana",
                "26": "Zilean",
                "27": "Singed",
                "28": "Evelynn",
                "29": "Twitch",
                "161": "Velkoz",
                "3": "Galio",
                "2": "Olaf",
                "1": "Annie",
                "30": "Karthus",
                "7": "Leblanc",
                "6": "Urgot",
                "5": "XinZhao",
                "32": "Amumu",
                "4": "TwistedFate",
                "31": "Chogath",
                "9": "FiddleSticks",
                "8": "Vladimir",
                "19": "Warwick",
                "17": "Teemo",
                "18": "Tristana",
                "15": "Sivir",
                "16": "Soraka",
                "13": "Ryze",
                "14": "Sion",
                "11": "MasterYi",
                "12": "Alistar",
                "21": "MissFortune",
                "20": "Nunu",
                "107": "Rengar",
                "106": "Volibear",
                "105": "Fizz",
                "104": "Graves",
                "103": "Ahri",
                "99": "Lux",
                "102": "Shyvana",
                "101": "Xerath",
                "412": "Thresh",
                "98": "Shen",
                "222": "Jinx",
                "96": "KogMaw",
                "92": "Riven",
                "91": "Talon",
                "90": "Malzahar",
                "429": "Kalista",
                "10": "Kayle",
                "421": "RekSai",
                "89": "Leona",
                "79": "Gragas",
                "117": "Lulu",
                "114": "Fiora",
                "78": "Poppy",
                "115": "Ziggs",
                "77": "Udyr",
                "112": "Viktor",
                "113": "Sejuani",
                "110": "Varus",
                "111": "Nautilus",
                "119": "Draven",
                "432": "Bard",
                "82": "Mordekaiser",
                "83": "Yorick",
                "80": "Pantheon",
                "81": "Ezreal",
                "86": "Garen",
                "84": "Akali",
                "85": "Kennen",
                "67": "Vayne",
                "126": "Jayce",
                "69": "Cassiopeia",
                "127": "Lissandra",
                "68": "Rumble",
                "121": "Khazix",
                "122": "Darius",
                "120": "Hecarim",
                "72": "Skarner",
                "236": "Lucian",
                "74": "Heimerdinger",
                "238": "Zed",
                "75": "Nasus",
                "76": "Nidalee",
                "134": "Syndra",
                "59": "JarvanIV",
                "133": "Quinn",
                "58": "Renekton",
                "57": "Maokai",
                "56": "Nocturne",
                "55": "Katarina",
                "64": "LeeSin",
                "62": "MonkeyKing",
                "268": "Azir",
                "63": "Brand",
                "131": "Diana",
                "60": "Elise",
                "267": "Nami",
                "266": "Aatrox",
                "61": "Orianna",
                "143": "Zyra",
                "48": "Trundle",
                "45": "Veigar",
                "44": "Taric",
                "51": "Caitlyn",
                "53": "Blitzcrank",
                "54": "Malphite",
                "254": "Vi",
                "50": "Swain",
            }};

        search.champion_image_data = {};

        search.blue_team = [];

        search.red_team = [];

        search.match_detail_info = false;

        search.red_player_stats_focus = {};

        search.blue_player_stats_focus = {};

        search.champion_name_lookup = function(id){
            return search.champion_list.keys[id];
        };



        search.summoner_info_lookup = function(summonerName) {
            $('#loading_bar').modal('show');
            summonerName = summonerName.toLowerCase();
            var query_url = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'+ summonerName +'?api_key='+api_key;
            $http.get(query_url).success(function (data) {
                search.player_summoner_info = data;
                search.player_name = summonerName.toLowerCase();
                var player_summoner_id = data[search.player_name].id;

                //var query_url = 'https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/'+ summonerId +'?api_key='+api_key;
                $http.get('components/StaticData/match_history_sample_data.json').success(function(data){
                    search.match_history = data.matches;

                    $('#loading_bar').modal('hide');

                    console.debug('Summoner Match History call successful');
                    console.debug(data);

                    for(var i = 0; i < search.match_history.length; i++){
                        var match = search.match_history[i];
                        match.matchDuration = (match.matchDuration / 60).toFixed(2);
                        match.participants[0].championId = search.champion_name_lookup(match.participants[0].championId);
                        console.log(match.participants[0].championId);

                    }

                });

            });

        };

        search.match_detail_pull = function(matchId, champion){
            $('#player_stats_container').hide();
            $('#loading_bar').modal('show');
            search.red_team = [];
            search.blue_team = [];
            $http.get('https://na.api.pvp.net/api/lol/na/v2.2/match/'+matchId+'?includeTimeline=True&api_key='+api_key).success(function(data){
                search.match_detail_info = data;
                $('#loading_bar').modal('hide');
                console.debug("Match Detail Call successful");
                for(var i = 0; i < search.match_detail_info.participants.length; i++){
                    var player = search.match_detail_info.participants[i];
                    var champId = player.championId;
                    var name = search.champion_name_lookup(champId);
                    player.championName = name;
                    if(player.championName === champion){
                        player.mainCharacter = true;
                    }else{
                        player.mainChater = false;
                    }
                    if(player.teamId === 100){
                        search.red_team.push(player);
                    }else{
                        search.blue_team.push(player);
                    }

                }
                $('#player_stats_container').show();
                //compute total damage taken
            });

            search.player_to_player_compare = function(team, participantId){

              if(team === 'redTeam'){
                  for(var i = 0; i < Search.red_team.length; i++){
                      if(Search.red_team[i].participantId === participantId){
                          Search.red_player_stats_focus = Search.red_team[i];
                          break;
                      }
                  }
              }else if(team === 'blueTeam'){
                  for(var i = 0; i < Search.blue_team.length; i++){
                      if(Search.blue_team[i].participantId === participantId){
                          Search.blue_player_stats_focus = Search.blue_team[i];
                          break;
                      }
                  }
              }
            };
        };

    }]);





})();

