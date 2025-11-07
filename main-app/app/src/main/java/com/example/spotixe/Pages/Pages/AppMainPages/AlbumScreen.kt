package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Bar.BottomBar
import Components.Bar.MiniPlayerBar
import Components.Buttons.BackButton
import Components.Layout.PlaylistSongRow
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.spotixe.Data.Album
import com.example.spotixe.Data.Song
import com.example.spotixe.MainRoute

// AlbumDetailScreen.kt
@Composable
fun AlbumDetailScreen(
    navController: NavHostController,
    album: Album,
    songs: List<Song>
) {
    Scaffold(
        containerColor = Color(0xFF121212),
        contentWindowInsets = WindowInsets(0),
        bottomBar = { BottomBar(navController) }
    ) { inner ->
        Box(
            Modifier
                .padding(inner)
                .fillMaxSize()
                .background(Color(0xFF121212))
        ) {

            Column(modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
            ) {
                BackButton(navController)
                // ===== Header lớn (gradient + tiêu đề + nút Play) =====
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(350.dp)
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF1B5E20), Color(0xFF121212))
                            )
                        )
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {

                    Column(
                        Modifier
                            .align(Alignment.BottomStart)
                            .padding(bottom = 8.dp)
                    ) {
                        Text(album.title, color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
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
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    // chừa chỗ cho mini player + bottom bar
                    contentPadding = PaddingValues(bottom = inner.calculateBottomPadding() + 96.dp)
                ) {
                    items(songs, key = { it.id }) { s ->
                        PlaylistSongRow(
                            song = s,
                            onClick = { navController.navigate(MainRoute.songView(s.id)) }
                            // nếu component của bạn có trailing slot thì truyền thêm:
                            // trailing = { Icon(Icons.Default.MoreVert, null, tint = Color.White.copy(0.7f)) }
                        )
                    }
                }
            }

            // Mini player nằm ngay trên BottomBar (không hard-code dp)
            MiniPlayerBar(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(
                        start = 16.dp,
                        end = 16.dp,
                    )
            )
        }
    }
}
