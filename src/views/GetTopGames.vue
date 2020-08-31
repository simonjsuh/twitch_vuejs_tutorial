<template>
  <div class="GetTopGamesContainer">
    <topNavBarLinks></topNavBarLinks>
    <h1>List of Top Games</h1>
    <!-- pagination code: {{ this.pagination }} -->
    <div id="topGames">
      <div class='topGame' v-for="topGame in listOfTopGames" :key='topGame.gameID'>
        <!-- <a :href="`StreamersForGame/${topGame.gameName}`"> -->
        <a href="" v-on:click="goToSpecificGameStreamsPage(topGame.gameID, topGame.gameName)">
          <div class="topGameThumbnailContainer">
            <img class='topGameThumbnail' :src="`${topGame.gameBoxArtURL}`" alt="">
          </div>
          <div class="topGameDescription">
            {{ topGame.gameName }}
          </div>
        </a>
        <!-- </a> -->
      
        <!-- <a class="gameImageBox" v-bind:href="topGame.gameBoxArtURL" :style='{backgroundImage: `url(${topGame.gameBoxArtURL})`}'></a>
        <a href="" class="gameTitle">{{ topGame.gameName }}</a> -->
      </div>
    </div>
    
    <Observer v-on:intersect="intersected"></Observer>
  </div>
</template>

<script>
import topNavBarLinks from '../components/topNavBarLinks';
import Observer from '../components/Observer';

export default {
  name: 'GetTopGames',
  components: {
    topNavBarLinks,
    Observer,
  },
  data: function () {
    return {
      listOfTopGames: [],
      pagination: '',
      // dataArray: [
      //   {
      //     one: 'oneNumber',
      //     two: 'twoNumber'
      //   }
      // ],
      // dataArray2: [
      //   {
      //     one: 'oneNumber',
      //     two: 'twoNumber',
      //     three: 'threeNumber',
      //     four: 'fourNumber',
      //     five: 'fiveNumber'
      //   }
      // ]
    }
  },
  methods: {
    fetchTopGames: function (pagination) {
      let fetchLink = 'https://api.twitch.tv/helix/games/top?first=30';
      
      if (pagination) {
        fetchLink = 'https://api.twitch.tv/helix/games/top?first=30&after=' + pagination;
      }

      fetch(fetchLink, {
        method: 'get',
        headers: new Headers({
          'Authorization': 'Bearer pfukpwo5ylssr7omkoiad97b7bwei3',
          'Client-ID': 'ghd3mxpkmize56qm2ny87aeux9ke02'
        })
      })
        .then(
          function (response) {
            return response.json();
          }
        )
        .then(
          data => {
            // console.log(data);
            this.pagination = data.pagination.cursor;
            let dataListOfTopGames = [];

            for (var key in data.data) {
              dataListOfTopGames.push({
                gameID: data.data[key].id,
                gameName: data.data[key].name,
                gameBoxArtURL: data.data[key].box_art_url.replace('{width}', '213').replace('{height}', '285'),
                // 285w x 380h on official twich.tv browse page
              });
            }

            this.listOfTopGames = [...this.listOfTopGames, ...dataListOfTopGames];
          }
        );
    },
    goToSpecificGameStreamsPage: function (gameID, gameName) {

      this.$router.push({
        // path: 'StreamersForGame/' + gameName,
        // must use 'name', 'path' doesn't allow params to be passed on
        name: 'StreamersForGame',
        params: {
          // game_name is for the url path paramater defined in the router/index.js file
          game_name: gameName,
        },
        query: {
          gameID: gameID,
          // dataArray: this.dataArray,
          // dataArray2: this.dataArray2,
        }
      });
    },
    intersected: function () {
      // console.log('intersection complete');
      this.fetchTopGames(this.pagination);
    }
  },
  mounted () {
    // this.fetchTopGames();
  }
}
</script>

<style>
#topGames {
  display: flex;
  flex-wrap: wrap;
}
.topGameThumbnail {
  width: 100%;
}
.topGame {
  flex-basis: 100%;
  padding: 7px;
  margin-bottom: 7px;
}

@media only screen and (min-width: 350px) {
  .topGame {
    flex-basis: 50%;
  }
}
@media only screen and (min-width: 650px) {
  .topGame {
    flex-basis: 33.33333333333%;
  }
}
@media only screen and (min-width: 950px) {
  .topGame {
    flex-basis: 25%;
  }
}
@media only screen and (min-width: 1250px) {
  .topGame {
    flex-basis: 20%;
  }
}
@media only screen and (min-width: 1550px) {
  .topGame {
    flex-basis: 16.6666666666666666667%;
  }
}
@media only screen and (min-width: 1850px) {
  .topGame {
    flex-basis: 14.28571428571%;
  }
}
</style>
