package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Bar.BottomBar
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.spotixe.Data.Playlist
import com.example.spotixe.Data.Song
import com.example.spotixe.MainRoute
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.material.icons.filled.PlayArrow
import Components.Bar.MiniPlayerBar
import Components.Layout.PlaylistSongRow

@Composable
fun PlaylistDetailScreen(
    navController: NavHostController,
    playlist: Playlist,
    songs: List<Song>
) {
    Scaffold(
        containerColor = Color(0xFF121212),
        contentWindowInsets = WindowInsets(0),
        bottomBar = { BottomBar(navController) } // hiển thị BottomBar vì screen này thuộc MAIN
    ) { inner ->
        Box(
            Modifier
                .padding(inner)
                .fillMaxSize()
                .background(Color(0xFF121212))
        ) {
            Column(Modifier.fillMaxSize()) {

                // ===== Header lớn (gradient + tiêu đề + nút Play) =====
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF1B5E20), Color(0xFF121212))
                            )
                        )
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    // back
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, tint = Color.White)
                    }

                    Column(
                        Modifier
                            .align(Alignment.BottomStart)
                            .padding(bottom = 8.dp)
                    ) {
                        Text(playlist.title, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(4.dp))
                        Text("${songs.size} songs", color = Color.White.copy(0.8f), fontSize = 13.sp)
                    }

                    // nút Play nổi
                    FilledIconButton(
                        onClick = { /* play all */ },
                        modifier = Modifier.align(Alignment.BottomEnd),
                        colors = IconButtonDefaults.filledIconButtonColors(
                            containerColor = Color(0xFF1DB954),
                            contentColor = Color.Black
                        )
                    ) {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, tint = Color.Black)
                    }
                }

                // ===== Danh sách bài hát trong playlist =====
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentPadding = PaddingValues(bottom = 96.dp) // chừa chỗ cho mini-player + bottom bar
                ) {
                    items(songs) { s ->
                        PlaylistSongRow(
                            song = s,
                            onClick = { navController.navigate(MainRoute.songView(s.id)) }
                        )
                    }
                }
            }

            // ===== Mini player màu xanh (overlay) =====
//            MiniPlayerBar(
//                modifier = Modifier
//                    .align(Alignment.BottomCenter)
//                    .padding(
//                        start = 16.dp,
//                        end   = 16.dp,
//                    )
//            )
        }
    }
}

