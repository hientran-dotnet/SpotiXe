// Components/Bar/MiniPlayerBar.kt
package Components.Bar

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotixe.R
import com.example.spotixe.player.PlayerViewModel
import kotlinx.coroutines.flow.StateFlow
import androidx.compose.runtime.collectAsState

@Composable
fun MiniPlayerBar(
    state: StateFlow<com.example.spotixe.player.PlayerUiState>,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier
) {
    val ui by state.collectAsState()

    // Ẩn nếu chưa có bài nào
    val song = ui.current ?: return

    val percent =
        if (ui.durationSec == 0) 0f else ui.positionSec.toFloat() / ui.durationSec

    Column(
        modifier = modifier
            .fillMaxWidth()
    ) {
        LinearProgressIndicator(
            progress = { ui.progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(2.dp)
                .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)),
            color = Color(0xFF1DB954),
            trackColor = Color.Black.copy(0.2f)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .clip(RoundedCornerShape(bottomStart = 12.dp, bottomEnd = 12.dp))
                .background(Color(0xFF1DB954))
                .padding(horizontal = 12.dp),
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
                Text(song.artist, color = Color.Black.copy(0.8f), fontSize = 12.sp, maxLines = 1)
            }
            IconButton(onClick = onToggle) {
                Icon(
                    imageVector = if (ui.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = null,
                    tint = Color.Black
                )
            }
        }
    }
}
