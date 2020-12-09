<template>
  <div class="home">
    <v-app-bar fixed v-if="showToolbar">
      <v-btn text tile @click="selectAll">select all</v-btn>
      <v-btn text tile @click="deselectAll">deselect all</v-btn>
      <v-btn text tile @click="hideAll">hide</v-btn>
      <v-btn text tile @click="showAll">show</v-btn>
      <v-btn text tile @click="addAll">run all</v-btn>
    </v-app-bar>
    <v-col cols="12">
      <v-row justify="space-around">
        {{search}}
        <poster
          ref="posters"
          v-for="item of items"
          :key="item.id"
          :item="item"
          :keyphrase="item.keyphrase"
          :src="imgURL(item.poster_path)"
          width="138"
          :title="item.name"
          :date="item.date"
          @select="select"
          @deselect="deselect"
          iconSize="23"
        >
          <template v-slot:tr="{prop: {iconsize, load}}">
            <v-icon :size="iconsize" @click="load(add,{item})">mdi-plus</v-icon>
          </template>

          <template v-slot:body>
            <v-col cols="12" class="text-center" align-self="center">
                <v-icon v-if="!hoverPlay" @mouseover="hoverPlay = true" @mouseleave="hoverPlay = false" size="60">mdi-play-circle-outline</v-icon>
                <v-icon v-if="hoverPlay" @mouseover="hoverPlay = true" @mouseleave="hoverPlay = false"  size="60">mdi-play-circle</v-icon>
            </v-col>
          </template>

          <template v-slot:bl="{prop: {iconsize}}">
            <v-icon :size="iconsize">mdi-pencil</v-icon>
          </template>

          <template v-slot:br="{prop: {iconsize}}">
            <v-icon :size="iconsize">mdi-dots-vertical</v-icon>
          </template>
          <template v-slot:footer>
              <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                      <div v-on="on" v-bind="attrs" class="font-weight-medium text-truncate">{{item.title}}</div>
                  </template>
                  <span>{{item.title}}</span>
              </v-tooltip>
              <div class="blue-grey--text">{{year(item.release_date)}}</div>
          </template>
        </poster>
      </v-row>
    </v-col>
  </div>
</template>

<script>
// @ is an alias to /src
import poster from '@/components/poster.vue'

export default {
  name: 'Home',
  components: {
    poster
  },
  data: () => ({
    hoverPlay:false,
    showToolbar: false,
    search: null,
    items: [],
    exitems: [],
    selected: [],
  }),
  computed: {
    localItems(){
      return !this.search ? this.items : this.items.filter(i => i.keyphrase.includes(this.search))
    }
  },
  watch: {
    selected(){
      this.showToolbar = this.selected.length > 0
    }
  },
  methods: {
    select(item){
      this.selected.push(item)
      console.log('select',item)
    },
    deselect(item){
      const index = this.selected.indexOf(item)
      this.selected.splice(index, 1)
    },

    async add({item}){
      console.log(item)
      return await this.$http.get('/movies')
    },

    async getMovies(){
      return await this.$http.get('/movies')
    },
    
    async searchTmdbMovies(key){
      return await this.$http.get(`/movies?source=tmdb&search=${key}`)
    },

    selectAll(){
      this.$refs.posters.map(p => p.select())
    },

    deselectAll(){
      this.$refs.posters.map(p => p.deselect())
    },

    hideAll(){
      this.$refs.posters.filter(e => e.isSelected).map(p => p.hide())
    },

    showAll(){
      this.$refs.posters.filter(e => e.isSelected).map(p => p.show())
    },

    addAll(){
        this.$refs.posters.filter(e => e.isSelected).map(p => p.load(this.add,{item:5}))
    },
    year(date){ return date ? new Date(date).getFullYear().toString() : '' },
    imgURL(uri){ return this.$config.api.tmdb.imgURL + uri }
  },
  async mounted(){
    const { data } = await this.getMovies()
    this.items = data

    this.$root.$on('search', key => this.$refs.posters.map(e => {
        e.keyphrase.includes(key) ? e.show() : e.hide()
    }))
  }
}
</script>