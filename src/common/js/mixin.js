import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
	computed: {
		iconMode() {
	  	return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
	 },
	 ...mapGetters(['sequenceList', 'playlist', 'currentSong', 'mode', 'favoriteList'])
	},
	created() {
		// console.log(this.playlist)
	},
	methods: {
		...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList']),
		changeMode() {
	  	const mode = (this.mode + 1) % 3
	  	this.setPlayMode(mode)
	  	let list = null
	  	if (mode === playMode.random) {
	  		list = shuffle(this.sequenceList)
	  	} else {
	  		list = this.sequenceList
	  	}
	  	this.resetCurrentIndex(list)
	  	this.setPlayList(list)
	  },
	  resetCurrentIndex(list) {
	  	let index = list.findIndex((item) => {
	  		return item.id === this.currentSong.id
	  	})
	  	this.setCurrentIndex(index)
	  },
	  getFavoriteIcon(song) {
	  	if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
	  },
	  toggleFavorite(song) {
	  	if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
	  },
	  isFavorite(song) {
	  	const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
	  }
	}
}

export const searchMixin = {
	data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
	computed: {
		...mapGetters(['searchHistory'])
	},
	methods: {
		onQueryChange(query) {
			this.query = query.trim()
		},
		blurInput() {
			this.$refs.searchBox.blur()
		},
		addQuery(query) {
			this.$refs.searchBox.setQuery(query)
		},
		saveSearch() {
			// console.log(this.query)
			this.saveSearchHistory(this.query)
		},
		...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
	}
}

