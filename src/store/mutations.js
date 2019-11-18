// vuex的mutation方法模块

import {
	SAVESONGLIST,
	GETSONGS,
	SAVEPLAY,
	SAVEPLAYLIST,
	SAVEDETAIL
} from './mutations-types.js'

export default {
	[SAVESONGLIST] (state, songList) {
		state.songList = songList
	},
	[GETSONGS] (state) {
		return state.songList
	},
	[SAVEPLAY] (state, play) {
		state.play = play
	},
	[SAVEPLAYLIST] (state, playList) {
		if (playList.length) {
			state.playList = state.playList.concat(playList)
		} else {
			state.playList = playList
		}
		
	},
	[SAVEDETAIL] (state, detail) {
		state.detail = detail
	}
}