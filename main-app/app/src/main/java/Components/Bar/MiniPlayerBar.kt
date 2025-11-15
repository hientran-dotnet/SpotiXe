package Components.Bar

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.zIndex
import com.example.spotixe.player.PlayerUiState
import kotlinx.coroutines.flow.StateFlow
import androidx.compose.ui.res.painterResource

@Composable
fun MiniPlayerBar(
    state: StateFlow<PlayerUiState>,
    onToggle: () -> Unit,
    onSeek: (Float) -> Unit,
    onSeekStart: () -> Unit,
    onSeekEnd: () -> Unit,
    onOpenSongView: () -> Unit,
    modifier: Modifier = Modifier
) {
    val ui by state.collectAsState()
    val song = ui.current ?: return

    Column(
        modifier.fillMaxWidth()
            .background(Color(0xFF222222), shape = RoundedCornerShape(12.dp))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .padding(horizontal = 12.dp)
                .clickable { onOpenSongView() },
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(song.coverRes),
                contentDescription = null,
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(6.dp))
            )
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f)) {
                Text(song.title, color = Color.Black, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, maxLines = 1)
                Text(song.artist, color = Color.Black.copy(0.8f), fontSize = 12.sp, maxLines = 1, fontWeight = FontWeight.SemiBold)
            }
            IconButton(onClick = onToggle) {
                Icon(
                    imageVector = if (ui.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = null,
                    tint = Color.Black
                )
            }
        }

        ScrubbableProgressBar(
            progress    = ui.progress,
            onSeek      = onSeek,
            onSeekStart = onSeekStart,
            onSeekEnd   = onSeekEnd,
            height      = 8.dp,
            modifier    = Modifier
                .fillMaxWidth()
                .zIndex(1f)
        )
    }
}
