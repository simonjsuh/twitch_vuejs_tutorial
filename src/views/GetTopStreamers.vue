<template>
  <div id="topStreamersDiv">
    <topNavBarLinks></topNavBarLinks>
    <h1>List of Top Streamers</h1>    
    <div id="topStreamers">
      <div class="topStreamer" v-for='topStreamer in listOfTopStreamers' :key='topStreamer.id'>
        <a class='topStreamerLink' :href="`streamer/${topStreamer.user_name}?streamerID=${topStreamer.user_id}`">
          <div class="topStreamerThumbnailContainer">
            <img class='topStreamerThumbnail' :src="`${topStreamer.thumbnail_url}`" alt="">
          </div>
          <div class="topStreamerDescription">
            <span class="streamTitle"><strong>{{ topStreamer.stream_title }}</strong></span>
            <span class='username'>Streamer Name:{{ topStreamer.user_name }}</span>
            <span class='streamViewerCount'>Viewers: {{ topStreamer.viewer_count }}</span>
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
  name: 'GetTopStreamers',
  components: {
    topNavBarLinks,
    Observer,
  },
  data: function () {
    return {
      listOfTopStreamers: [],
      pagination: '',
    }
  },
  methods: {
    fetchTopStreamers: function (pagination) {
      let fetchLink = 'https://api.twitch.tv/helix/streams?first=30';

      if (pagination) {
        fetchLink = 'https://api.twitch.tv/helix/streams?first=30&after=' + pagination;
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
            let dataListOfTopStreamers = [];

            for (var key in data.data) {
              dataListOfTopStreamers.push({
                id: data.data[key].id,
                user_id: data.data[key].user_id,
                user_name: data.data[key].user_name,
                game_id: data.data[key].game_id,
                stream_title: data.data[key].title,
                viewer_count: data.data[key].viewer_count,
                thumbnail_url: data.data[key].thumbnail_url.replace('{width}', '440').replace('{height}', '248'),
                // 440w x 248h
              });
            }

            this.listOfTopStreamers = [...this.listOfTopStreamers, ...dataListOfTopStreamers];
          }
        );
    },
    intersected: function () {
      this.fetchTopStreamers(this.pagination);
    }
  },
  mounted () {
    // this.fetchTopStreamers();
  }
}
</script>

<style>
#topStreamers {
  display: flex;
  flex-wrap: wrap;
}
.topStreamer {
  flex-basis: 100%;
  padding: 7px;
  margin-bottom: 7px;
}
.topStreamer a {
  text-decoration: none;
}
.topStreamerThumbnail {
  width: 100%;
}
.topStreamerDescription span {
  display: block;
}
.topStreamerDescription .username {
  text-decoration: underline;
}
.topStreamerDescription .streamTitle {
  color: black;
}

@media only screen and (min-width: 700px) {
  #topStreamers .topStreamer {
    flex-basis: 50%;
  }
}
@media only screen and (min-width: 1000px) {
  #topStreamers .topStreamer {
    flex-basis: 33.33333333%;
  }
}
@media only screen and (min-width: 1300px) {
  #topStreamers .topStreamer {
    flex-basis: 25%;
  }
}
@media only screen and (min-width: 1600px) {
  #topStreamers .topStreamer {
    flex-basis: 20%;
  }
}
</style>
