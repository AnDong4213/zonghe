<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic} from 'common/js/song'
  import musicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters(['singer']),
      title() {
      	return this.singer.name
      },
      bgImage() {
      	return this.singer.avatar
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
    	_getDetail() {
    		if (!this.singer.id) {
    			this.$router.push('/singer')
    			return
    		}
    		getSingerDetail(this.singer.id).then((res) => {
    			// console.log(res)
    			if (res.code === ERR_OK) {
    				this.songs = this._normalizeSongs(res.data.list)
    				// console.log(this.songs)
    			}
    		})
    	},
    	_normalizeSongs(list) {
    		let ret = []
    		list.forEach((item) => {
    			let {musicData} = item
    			if (isValidMusic(musicData)) {
    				ret.push(createSong(musicData))
    			}
    		})
    		return ret
    	}
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
		
	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
	
</style>