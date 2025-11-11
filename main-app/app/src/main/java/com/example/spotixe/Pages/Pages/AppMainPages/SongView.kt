// SongViewScreen.kt
package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Bar.ScrubbableProgressBar
import Components.Buttons.BackButton
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.navigation.NavHostController
import com.example.spotixe.Data.Song
import com.example.spotixe.MainRoute
import com.example.spotixe.player.rememberPlayerVMActivity
import kotlin.math.max

@Composable
fun SongViewScreen(
    navController: NavHostController,
    song: Song
) {
    val playerVM = rememberPlayerVMActivity()
    val ui by playerVM.ui.collectAsState()

    // (Tuỳ chọn) đảm bảo vào SongView là đang play đúng bài
    LaunchedEffect(song.id) {
        if (ui.current?.id != song.id) {
            playerVM.play(song)
        }
    }

    var isLiked by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = Color(0xFF121212),
        contentWindowInsets = WindowInsets(0)
    ) { inner ->
        Column(
            Modifier
                .padding(inner)
                .fillMaxSize()
                .statusBarsPadding()
                .padding(horizontal = 16.dp)
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp, bottom = 8.dp)
            ) {
                BackButton(navController)
                Spacer(Modifier.width(4.dp))
            }

            // Cover
            Image(
                painter = painterResource(song.coverRes),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .clip(RoundedCornerShape(12.dp))
            )

            Spacer(Modifier.height(14.dp))

            // Title + artist + more
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.weight(1f)) {
                    Text(
                        song.title,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        modifier = Modifier.padding(bottom = 4.dp)
                    )
                    Text(
                        song.artist,
                        color = Color.White.copy(0.7f),
                        fontSize = 13.sp,
                        maxLines = 1,
                        modifier = Modifier.padding(bottom = 10.dp)
                    )
                }
                IconButton(onClick = { navController.navigate(MainRoute.songViewMore(song.id)) }) {
                    Icon(
                        imageVector = Icons.Filled.MoreHoriz,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(34.dp)
                    )
                }
            }

            //ScrubbableProgressBar
            ScrubbableProgressBar(
                progress    = ui.progress,
                onSeek      = { p -> playerVM.seekTo(p) },
                onSeekStart = { playerVM.beginSeek() },
                onSeekEnd   = { playerVM.endSeek() },
                height      = 8.dp,
                modifier    = Modifier
                    .fillMaxWidth()
                    .zIndex(1f)
            )
            Row(Modifier.fillMaxWidth()) {
                Text(
                    formatTime(ui.positionSec),
                    color = Color.White.copy(0.7f),
                    fontSize = 12.sp
                )
                Spacer(Modifier.weight(1f))
                val remain = max(0, ui.durationSec - ui.positionSec)
                Text(
                    "-${formatTime(remain)}",
                    color = Color.White.copy(0.7f),
                    fontSize = 12.sp
                )
            }

            Spacer(Modifier.height(8.dp))

            // Controls
            Row(
                Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { playerVM.prev() }) {
                    Icon(
                        imageVector = Icons.Default.SkipPrevious,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(40.dp)
                    )
                }
                FilledTonalButton(
                    onClick = { playerVM.toggle() },
                    colors = ButtonDefaults.filledTonalButtonColors(containerColor = Color.White),
                    modifier = Modifier.size(64.dp),
                    shape = CircleShape,
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        imageVector = if (ui.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                        contentDescription = if (ui.isPlaying) "Pause" else "Play",
                        tint = Color.Black,
                        modifier = Modifier.size(40.dp)
                    )
                }
                IconButton(onClick = { playerVM.next() }) {
                    Icon(
                        imageVector = Icons.Default.SkipNext,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(40.dp)
                    )
                }
            }

            Spacer(Modifier.height(4.dp))

            // Actions (like / queue)
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                IconButton(onClick = { isLiked = !isLiked }) {
                    Icon(
                        imageVector = if (isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = if (isLiked) "Liked" else "Not liked",
                        tint = Color(0xFF58BA47),
                        modifier = Modifier.size(34.dp)
                    )
                }
                Image(
                    painter = painterResource(com.example.spotixe.R.drawable.list),
                    contentDescription = "playlist",
                    modifier = Modifier
                        .size(34.dp)
                        .clickable { navController.navigate(MainRoute.playlist(song.id)) }
                        .offset(y = 8.dp)
                )
            }

            Spacer(Modifier.height(8.dp))
        }
    }
}

private fun formatTime(sec: Int): String {
    val m = sec / 60
    val s = sec % 60
    return "%d:%02d".format(m, s)
}
