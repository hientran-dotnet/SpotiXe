package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Card.AlbumTile
import Components.Bar.BottomBar
import Components.Card.PlaylistCard
import Components.Card.RecentlyPlayedItem
import Components.Layout.SongCardRow
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.example.spotixe.Data.PlaylistRepository
import com.example.spotixe.Data.topPicks
import com.example.spotixe.Data.recentlyPlayed
import com.example.spotixe.MainRoute

@Composable
fun HomeScreen(navController: NavHostController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
    ){
        Scaffold (
            containerColor = Color.Transparent,
            contentWindowInsets = WindowInsets(0),
            bottomBar = { BottomBar(navController) }
        ){ innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .background(Color(0xFF121212))
                    .fillMaxSize()
                    .statusBarsPadding()
            ) {


                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp)
                        .padding(horizontal = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "Listen Now",
                        fontSize = 35.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    Box(
                        modifier = Modifier
                            .padding(start = 8.dp)
                            .size(40.dp)
                            .clickable {navController.navigate(MainRoute.User) },
                        contentAlignment = Alignment.Center
                    ){
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = "Profile",
                            tint = Color.White,
                            modifier = Modifier
                                .size(40.dp)
                        )
                    }

                }

                Divider(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    color = Color(0xFF161616),
                    thickness = 1.dp
                )


                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Start
                ) {
                    Text(
                        "Top Pick",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier
                            .padding(start = 8.dp, end = 8.dp)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Start
                ) {
                    Text(
                        "More from everyday",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.Gray,
                        modifier = Modifier
                            .padding(start = 8.dp, end = 8.dp)
                    )
                }

                Spacer(Modifier.height(6.dp))

                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp)
                ) {
                    items(topPicks.size) { i ->
                        SongCardRow(song = topPicks[i], navController = navController)
                    }
                }

                Spacer(Modifier.height(18.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Recently Played",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "See All",
                        color = Color(0xFF1DB954),
                        modifier = Modifier.clickable { /* navController.navigate("recently_all") */ }
                    )
                }

                Spacer(Modifier.height(10.dp))

                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp)
                ) {
                    items(
                        items = recentlyPlayed,
                        key = { it.id }
                    ) { song ->
                        RecentlyPlayedItem(
                            song = song,
                            onClickItem = { navController.navigate(MainRoute.songView(song.id)) },
                            onPlayClick  = { navController.navigate(MainRoute.songView(song.id))}
                        )
                    }
                }


                Spacer(Modifier.height(18.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Playlist",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "See All",
                        color = Color(0xFF1DB954),
                        modifier = Modifier.clickable { /* navController.navigate("recently_all") */ }
                    )
                }

                Spacer(Modifier.height(10.dp))

                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp)
                ) {
                    items(
                        items = PlaylistRepository.all,
                        key = { it.id }
                    ) { pl ->
                        PlaylistCard(
                            playlist = pl,
                            onClick = { navController.navigate(MainRoute.playlistDetail(pl.id)) }
                        )
                    }
                }


                Spacer(Modifier.height(18.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Albums",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "See All",
                        color = Color(0xFF1DB954),
                        modifier = Modifier.clickable { /* navController.navigate("recently_all") */ }
                    )
                }

                Spacer(Modifier.height(10.dp))

                // Hiển thị một hàng album
                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp)
                ) {
                    items(
                        items = com.example.spotixe.Data.AlbumRepository.all,
                        key = { it.id }
                    ) { album ->
                        AlbumTile (
                            album = album,
                            onClick = { navController.navigate(MainRoute.albumDetail(album.id)) }
                        )
                    }
                }

            }
        }
    }
}
