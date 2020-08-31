import Vue from 'vue';
import VueRouter from 'vue-router';
import GetTopGames from '../views/GetTopGames.vue';
import GetTopStreamers from '../views/GetTopStreamers.vue';
import Streamer from '../views/Streamer.vue';
import StreamersForGame from '../views/StreamersForGame.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'GetTopGames',
    component: GetTopGames
  },
  {
    path: '/GetTopStreamers',
    name: 'GetTopStreamers',
    component: GetTopStreamers
  },
  {
    path: '/streamer/:streamer_user_name',
    name: 'Streamer',
    component: Streamer
  },
  {
    // case sensitivity does not matter for main url, but matters for sub-directory urls.
    path: '/StreamersForGame/:game_name',
    name: 'StreamersForGame',
    component: StreamersForGame,
    // props: true,
    // props: {
    //   header: true,
    //   content: true
    // }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
