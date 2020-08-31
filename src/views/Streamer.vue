<template>
  <div id="streamer">
    <topNavBarLinks></topNavBarLinks>    
    <h1>{{ this.streamTitle }}</h1>

    <!-- Add a placeholder for the Twitch embed -->
    <div id="twitch-embed"></div>
    <div class='streamerNameContainer'>
      <h2 class='streamerName'>{{ $route.params.streamer_user_name }}</h2>
      <h3 class="viewerCount">Viewers: {{ this.streamViewerCount }}</h3>
    </div>


    <div id="twitch_embed_script_link"></div>
  </div>
</template>

<!-- this script tag needs to be inserted here or else twitch embed sript won't load -->
<script></script>

<script>
import topNavBarLinks from '../components/topNavBarLinks';

export default {
  name: 'Streamer',
  components: {
    topNavBarLinks,
  },
  data: function () {
    return {
      streamID: 0,
      streamerName: '',
      gameID: '',
      gameName: '',
      streamTitle: '',
      streamViewerCount: 0,
      // TwitchEmbedScriptReady: false,
    }
  },
  methods: {
    fetchStreamInformation: function () {
      // GET https://api.twitch.tv/helix/channels
      fetch('https://api.twitch.tv/helix/channels?broadcaster_id=' + this.$route.query.streamerID, {
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
            // console.log(data.data[0].title);
            this.streamID = data.data[0].broadcaster_id;
            this.streamerName = data.data[0].broadcaster_name;
            this.gameID = data.data[0].game_id;
            this.gameName = data.data[0].game_name;
            this.streamTitle = data.data[0].title;
          }
        );
    },
    fetchStreamViewerCount: function () {
      fetch('https://api.twitch.tv/helix/streams?user_id=' + this.$route.query.streamerID, {
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
            this.streamViewerCount = data.data[0].viewer_count;
            console.log(this.streamViewerCount);
          }
        );
    },
    // set the setInterval time to 2 minutes. It take sabout 3 to 5 minutes for the twitch api to update the viewercount.
    fetchStreamViewerCountSetInterval: function () {
      setInterval(() => {
        this.fetchStreamViewerCount();
      }, 120000);
    },
    insertTwitchEmbedScript: function () {
      let twitchEmbedDiv = document.querySelector('#twitch_embed_script_link');
      let twitch_embed_script = document.createElement('script')
      twitch_embed_script.setAttribute('src', 'https://embed.twitch.tv/embed/v1.js')
      twitchEmbedDiv.appendChild(twitch_embed_script);
    },
    runTwitchEmbed: function () {
      var embed = new Twitch.Embed("twitch-embed", {
        width: '100%',
        height: 502,
        channel: this.$route.params.streamer_user_name,
        // channel: 'juansguarnizo',
        layout: "video-with-chat",
        autoplay: false,
      });

      embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
        var player = embed.getPlayer();
        player.play();
      });
    }
  },
  mounted () {
    this.fetchStreamInformation();

    this.fetchStreamViewerCount();
    this.fetchStreamViewerCountSetInterval();

    this.insertTwitchEmbedScript();

    // setTimeout here is necessary to wait for Twitch embed to work.
    setTimeout(() => this.runTwitchEmbed(), 500);
  }
}
</script>

<style>
.streamerNameContainer {
  padding-left: 5%;
  text-align: left;
}
.streamerNameContainer .streamerName,
.streamerNameContainer .viewerCount {
  font-weight: 100;
}
</style>
