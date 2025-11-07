package com.example.spotixe

import Components.SetSystemBars
import android.os.Build
import com.example.spotixe.Pages.Pages.SignInPages.Sign_in1Screen
import com.example.spotixe.Pages.Pages.SignInPages.Sign_in2Screen
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.core.view.WindowCompat
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.spotixe.Pages.Pages.AppMainPages.ExploreScreen
import com.example.spotixe.Pages.Pages.AppMainPages.HomeScreen
import com.example.spotixe.Pages.Pages.AppMainPages.SearchScreen
import com.example.spotixe.Pages.Pages.AppMainPages.UserDetailScreen
import com.example.spotixe.Pages.Pages.AppMainPages.UserScreen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpEmail1Screen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpEmail2Screen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpPhone1Screen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpPhone2Screen
import com.example.spotixe.Pages.Pages.StartPages.Start2Screen
import com.example.spotixe.Pages.Pages.StartPages.Start3Screen
import com.example.spotixe.Pages.Pages.StartPages.StartScreen
import com.example.spotixe.ui.theme.SpotiXeTheme
import androidx.navigation.navigation
import com.example.spotixe.Data.AlbumRepository
import com.example.spotixe.Data.PlaylistRepository
import com.example.spotixe.Data.SongRepository
import com.example.spotixe.Pages.Pages.AppMainPages.AlbumDetailScreen
import com.example.spotixe.Pages.Pages.AppMainPages.PlaylistDetailScreen
import com.example.spotixe.Pages.Pages.AppMainPages.QueueScreen
import com.example.spotixe.Pages.Pages.AppMainPages.SongMoreScreen
import com.example.spotixe.Pages.Pages.AppMainPages.SongViewScreen

class MainActivity : ComponentActivity() {
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        WindowCompat.setDecorFitsSystemWindows(window, false)
        setContent {
            val navController: NavHostController = rememberNavController()
            SpotiXeTheme {
                SetSystemBars()
                NavHost(
                    navController = navController,
                    startDestination = Graph.MAIN
                ) {
                    // START GRAPH
                    navigation(
                        startDestination = StartRoute.Start1,
                        route = Graph.START
                    ) {
                        composable(StartRoute.Start1) { StartScreen(navController) }
                        composable(StartRoute.Start2) { Start2Screen(navController) }
                        composable(StartRoute.Start3) { Start3Screen(navController) }
                    }

                    // AUTH GRAPH
                    navigation(
                        startDestination = AuthRoute.SignIn1,
                        route = Graph.AUTH
                    ) {
                        composable(AuthRoute.SignIn1) { Sign_in1Screen(navController) }
                        composable(AuthRoute.SignIn2) { Sign_in2Screen(navController) }
                        composable(AuthRoute.SignUpEmail1) { Sign_UpEmail1Screen(navController) }
                        composable(AuthRoute.SignUpEmail2) { Sign_UpEmail2Screen(navController) }
                        composable(AuthRoute.SignUpPhone1) { Sign_UpPhone1Screen(navController) }
                        composable(AuthRoute.SignUpPhone2) { Sign_UpPhone2Screen(navController) }
                    }

                    // MAIN GRAPH
                    navigation(
                        startDestination = MainRoute.Home,
                        route = Graph.MAIN
                    ) {
                        composable(MainRoute.Home) { HomeScreen(navController) }
                        composable(MainRoute.Explore) { ExploreScreen(navController) }
                        composable(MainRoute.Search) { SearchScreen(navController) }
                        composable(MainRoute.User) { UserScreen(navController) }
                        composable(MainRoute.UserDetail) { UserDetailScreen(navController) }

                        composable(
                            route = MainRoute.SongView,
                            arguments = listOf(navArgument("songId") { type = NavType.StringType })
                        ) { backStackEntry ->
                            val songId = backStackEntry.arguments?.getString("songId") ?: return@composable

                            // Lấy dữ liệu bài hát theo id (VD gộp 2 list demo hiện có)
                            val song = remember(songId) { SongRepository.get(songId) }

                            if (song != null) {
                                SongViewScreen(navController, song)
                            } else {
                                // fallback đơn giản
                                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                    Text("Song not found", color = Color.White)
                                }
                            }
                        }

                        composable(
                            route = MainRoute.SongViewMore,
                            arguments = listOf(navArgument("songId") { type = NavType.StringType })
                        ) { be ->
                            val songId = be.arguments?.getString("songId") ?: return@composable
                            val song = SongRepository.get(songId)
                            if (song != null) {
                                SongMoreScreen(navController, song)
                            }
                        }

                        composable(
                            route = MainRoute.Playlist,
                            arguments = listOf(navArgument("songId") { type = NavType.StringType })
                        ) { be ->
                            val songId = be.arguments?.getString("songId") ?: return@composable
                            val current = SongRepository.get(songId)
                            val nextList = remember(songId) { SongRepository.all.filter { it.id != songId } }

                            if (current != null) {
                                QueueScreen(
                                    navController = navController,
                                    current = current,
                                    playingNext = nextList
                                )
                            } else {
                                // fallback đơn giản
                                QueueScreen(navController, current = SongRepository.all.first(), playingNext = SongRepository.all.drop(1))
                            }
                        }

                        composable(
                            route = MainRoute.PlaylistDetail,
                            arguments = listOf(navArgument("playlistId") { type = NavType.StringType })
                        ) { be ->
                            val pid = be.arguments?.getString("playlistId") ?: return@composable
                            val pl = remember(pid) { PlaylistRepository.get(pid) }
                            val songs = remember(pl) { pl?.let { PlaylistRepository.songsOf(it) } ?: emptyList() }

                            if (pl != null) {
                                PlaylistDetailScreen(navController, pl, songs)
                            } else {
                                // fallback
                                Text("Playlist not found", color = Color.White)
                            }
                        }

                        composable(
                            route = MainRoute.AlbumDetail,
                            arguments = listOf(navArgument("albumId") { type = NavType.StringType })
                        ) { be ->
                            val albumId = be.arguments?.getString("albumId") ?: return@composable
                            val album = AlbumRepository.get(albumId)
                            val songs = album?.let { AlbumRepository.songsOf(it) } ?: emptyList()
                            if (album != null) {
                                AlbumDetailScreen(navController, album, songs)
                            } else {
                                Text("Album not found", color = Color.White)
                            }
                        }
                    }
                }

            }
        }
    }
}

