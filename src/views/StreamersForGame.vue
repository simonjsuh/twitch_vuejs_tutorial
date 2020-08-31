<template>
  <div class="hello">
    <topNavBarLinks></topNavBarLinks>
    <!-- <h1>{{ this.dataArray.one }}</h1> -->
    <h1>Streamers for '{{ $route.params.game_name }}'</h1>
    <div id="topStreamersForSpecificGame">
      <div class="topStreamerForSpecificGame" v-for='topStreamerForSpecificGame in listOfTopStreamersForSpecificGame' :key='topStreamerForSpecificGame.id'>
        <a :href="`../streamer/${topStreamerForSpecificGame.user_name}?streamerID=${topStreamerForSpecificGame.user_id}`" class="topStreamerForSpecificGameLink">
          <div class="topStreamerForSpecificGameThumbnailContainer">
            <img alt="" class="topStreamerForSpecificGameThumbnail" :src="`${topStreamerForSpecificGame.stream_thumbnail_url}`">
          </div>
          <div class="topStreamerForSpecificGameDescription">
            <div class="username">{{ topStreamerForSpecificGame.user_name }}</div>
            <div class="viewerCount">{{ topStreamerForSpecificGame.stream_viewer_count }} Viewers</div>
          </div>
        </a>
      </div>
    </div>

    <Observer v-on:intersect="intersected"></Observer>
  </div>
</template>

<script>
import topNavBarLinks from '../components/topNavBarLinks';
import Observer from '../components/Observer';

export default {
  name: 'StreamersForGame',
  components: {
    topNavBarLinks,
    Observer,
  },
  props: {
  },
  data: function () {
    return {
      listOfTopStreamersForSpecificGame: [],
      pagination: '',
      // dataArray: [],
      // dataArray2: [],
    }
  },
  methods: {
    fetchTopStreamersForSpecificGame: function (pagination) {
      let fetchLink = 'https://api.twitch.tv/helix/streams?first=30&game_id='+this.$route.query.gameID;

      if (pagination) {
        fetchLink = 'https://api.twitch.tv/helix/streams?first=30&after=' + pagination + '&game_id='+this.$route.query.gameID
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
            this.pagination = data.pagination.cursor;
            let dataListOfTopStreamersForSpecificGame = [];

            for (var key in data.data) {
              dataListOfTopStreamersForSpecificGame.push({
                id: data.data[key].id,
                user_id: data.data[key].user_id,
                user_name: data.data[key].user_name,
                title: data.data[key].title,
                stream_thumbnail_url: data.data[key].thumbnail_url.replace('{width}','440').replace('{height}','248'),
                stream_viewer_count: data.data[key].viewer_count
              });
            }

            this.listOfTopStreamersForSpecificGame = [...this.listOfTopStreamersForSpecificGame, ...dataListOfTopStreamersForSpecificGame];
          }
        );
    },
    intersected: function () {
      this.fetchTopStreamersForSpecificGame(this.pagination);
    }
  },
  mounted () {
    // this.fetchTopStreamersForSpecificGame();
  }
}
</script>

<style>
#topStreamersForSpecificGame {
  display: flex;
  flex-wrap: wrap;
}
.topStreamerForSpecificGame {
  flex-basis: 100%;
  padding: 7px;
  margin-bottom: 7px;
}
.topStreamerForSpecificGameLink {
  text-decoration: none;
}
.topStreamerForSpecificGameThumbnail {
  width: 100%;
}
.topStreamerForSpecificGameDescription .username {
  text-decoration: underline;
}
.topStreamerForSpecificGameDescription .viewerCount {
  color: #505050;
}

@media only screen and (min-width: 600px) {
  #topStreamersForSpecificGame .topStreamerForSpecificGame {
    flex-basis: 50%;
  }
}
@media only screen and (min-width: 900px) {
  #topStreamersForSpecificGame .topStreamerForSpecificGame {
    flex-basis: 33.33333333333%;
  }
}
@media only screen and (min-width: 1200px) {
  #topStreamersForSpecificGame .topStreamerForSpecificGame {
    flex-basis: 25%;
  }
}
@media only screen and (min-width: 1500px) {
  #topStreamersForSpecificGame .topStreamerForSpecificGame {
    flex-basis: 20%;
  }
}
</style>
