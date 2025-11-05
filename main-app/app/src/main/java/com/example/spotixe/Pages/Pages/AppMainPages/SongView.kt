package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Buttons.BackButton
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.spotixe.Data.Song
import com.example.spotixe.R
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lyrics
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.PlaylistAddCircle
import com.example.spotixe.MainRoute


@Composable
fun SongViewScreen(
    navController: NavHostController,
    song: Song
) {
    var isPlaying by remember { mutableStateOf(true) }
    var position by remember { mutableFloatStateOf(0.2f) }

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
                    Text(song.title, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.SemiBold, maxLines = 1)
                    Text("${song.artist}", color = Color.White.copy(0.7f), fontSize = 13.sp, maxLines = 1)
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

            // Seekbar + time
            Slider(
                value = position,
                onValueChange = { position = it },
                modifier = Modifier.fillMaxWidth(),
                colors = SliderDefaults.colors(
                    thumbColor = Color(0xFF58BA47),
                    activeTrackColor = Color(0xFF58BA47),
                    inactiveTrackColor = Color.White.copy(0.2f)
                )
            )
            Row(Modifier.fillMaxWidth()) {
                Text(formatTime( (position * 286).toInt() ), color = Color.White.copy(0.7f), fontSize = 12.sp) // demo 4:46 = 286s
                Spacer(Modifier.weight(1f))
                Text("-${formatTime(286 - (position * 286).toInt())}", color = Color.White.copy(0.7f), fontSize = 12.sp)
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
                IconButton(onClick = { /* prev */ }) {
                    Icon(
                        imageVector=Icons.Default.SkipPrevious,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(40.dp)
                    )
                }
                FilledTonalButton(
                    onClick = { isPlaying = !isPlaying },
                    colors = ButtonDefaults.filledTonalButtonColors(containerColor = Color.White),
                    modifier = Modifier.size(64.dp),
                    shape = CircleShape,
                    contentPadding = PaddingValues(0.dp)
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = Color.Black,
                        modifier = Modifier.size(40.dp)
                    )
                }
                IconButton(onClick = { /* next */ }) {
                    Icon(
                        imageVector= Icons.Default.SkipNext,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(40.dp)
                    )
                }
            }

            Spacer(Modifier.height(4.dp))

            // Actions row (like / lyrics / queue)
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                IconButton(onClick = { /* like */ }) {
                    Icon(painterResource(R.drawable.heart), contentDescription = null, tint = Color(0xFF58BA47), modifier = Modifier.size(34.dp))
                }
                IconButton(onClick = { /* lyrics toggle */ }) {
                    Icon(imageVector = Icons.Default.PlaylistAddCircle, contentDescription = null, tint = Color(0xFF58BA47), modifier = Modifier.size(34.dp))
                }
                IconButton(onClick = { /* queue */ }) {
                    Icon(imageVector = Icons.Default.Lyrics, contentDescription = null, tint = Color(0xFF58BA47), modifier = Modifier.size(34.dp))
                }
            }

            Spacer(Modifier.height(8.dp))

            // Lyrics panel (green card)
            Column(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF58BA47))
                    .padding(12.dp)
            ) {
                Text("Lyrics", color = Color.Black, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(8.dp))
                Text(
                    "[Verse 1]\nWhat's in your heart? What's left to give?\nWhen everything's broken, chasin' the wind",
                    color = Color.Black,
                    lineHeight = 18.sp
                )
            }

            Spacer(Modifier.height(12.dp))
        }
    }
}

private fun formatTime(sec: Int): String {
    val m = sec / 60
    val s = sec % 60
    return "%d:%02d".format(m, s)
}
