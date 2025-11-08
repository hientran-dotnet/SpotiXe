// PlayerViewModel.kt
package com.example.spotixe.player

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.spotixe.Data.Song
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class PlayerUiState(
    val queue: List<Song> = emptyList(),
    val index: Int = -1,
    val isPlaying: Boolean = false,
    val positionSec: Int = 0,
    val durationSec: Int = 286
) {
    val current: Song? get() = queue.getOrNull(index)
    val progress: Float get() =
        if (durationSec == 0) 0f else positionSec.toFloat() / durationSec
}

class PlayerViewModel : ViewModel() {
    private val _ui = MutableStateFlow(PlayerUiState())
    val ui: StateFlow<PlayerUiState> = _ui

    private var ticker: Job? = null

    /** Play 1 bài trong 1 danh sách (queue). */
    fun playFromList(list: List<Song>, startIndex: Int) {
        if (list.isEmpty() || startIndex !in list.indices) return
        _ui.value = PlayerUiState(
            queue = list,
            index = startIndex,
            isPlaying = true,
            positionSec = 0
        )
        startTicker()
    }

    /** Play 1 bài với queue gợi ý. Nếu queue không chứa bài -> chèn lên đầu. */
    fun play(song: Song, queueHint: List<Song> = emptyList()) {
        val q = if (queueHint.any { it.id == song.id }) queueHint
        else listOf(song) + queueHint.filterNot { it.id == song.id }
        val idx = q.indexOfFirst { it.id == song.id }.coerceAtLeast(0)
        playFromList(q, idx)
    }

    fun toggle() {
        val s = _ui.value
        _ui.value = s.copy(isPlaying = !s.isPlaying)
        if (_ui.value.isPlaying) startTicker() else stopTicker()
    }

    fun seekTo(percent: Float) {
        val dur = _ui.value.durationSec
        val sec = (percent.coerceIn(0f, 1f) * dur).toInt()
        _ui.value = _ui.value.copy(positionSec = sec)
    }

    fun next() {
        val s = _ui.value
        val nextIdx = (s.index + 1).takeIf { it < s.queue.size } ?: return
        _ui.value = s.copy(index = nextIdx, positionSec = 0, isPlaying = true)
    }

    fun prev() {
        val s = _ui.value
        val prevIdx = (s.index - 1).takeIf { it >= 0 } ?: return
        _ui.value = s.copy(index = prevIdx, positionSec = 0, isPlaying = true)
    }

    private fun startTicker() {
        if (ticker?.isActive == true) return
        ticker = viewModelScope.launch {
            while (true) {
                delay(1000)
                val st = _ui.value
                if (st.isPlaying && st.current != null) {
                    val next = (st.positionSec + 1).coerceAtMost(st.durationSec)
                    _ui.value = st.copy(
                        positionSec = next,
                        isPlaying = next < st.durationSec
                    )
                }
            }
        }
    }
    private fun stopTicker() { ticker?.cancel(); ticker = null }
}
