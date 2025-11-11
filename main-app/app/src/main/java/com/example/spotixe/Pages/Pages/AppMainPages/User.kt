package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Bar.BottomBar
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavHostController
import com.example.spotixe.MainRoute
import com.example.spotixe.R
import com.example.spotixe.player.rememberPlayerVMActivity
import androidx.navigation.NavController
@Composable
fun UserScreen(navController: NavHostController) {
    val playerVM = rememberPlayerVMActivity()
    val playlists = listOf(
        PlaylistUi("LoL songs", "17 Songs", R.drawable.spotixe_logo),
        PlaylistUi("Liked songs", "17 Songs", R.drawable.spotixe_logo, liked = true),
        PlaylistUi("Pop", "17 Songs", R.drawable.spotixe_logo),
        PlaylistUi("Rock", "17 Songs", R.drawable.spotixe_logo),
    )
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
    ){

    }
    Scaffold(
        containerColor = Color.Transparent,
        contentWindowInsets = WindowInsets(0),
    ) { inner ->
        // Tất cả phần trên dùng Column
        Column(
            modifier = Modifier
                .padding(inner)
                .fillMaxSize()
                .background(Color(0xFF121212))
                .statusBarsPadding()
        ) {
            // ===== Header gradient + avatar + nút Sửa hồ sơ + thống kê =====
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(320.dp)
                    .background(
                        Brush.linearGradient(
                            listOf(
                                Color(0xFF000000),
                                Color(0xFF031508).copy(alpha = 0.7f),
                                Color(0xFF58BA47).copy(alpha = 0.9f)
                            ),
                            start = Offset(600f, 0f),
                            end = Offset(0f, 800f)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(
                        painter = painterResource(R.drawable.spotixe_logo),
                        contentDescription = null,
                        modifier = Modifier.size(140.dp)
                    )
                    Text(
                        "Nguyễn Văn A",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(top = 8.dp, bottom = 10.dp)
                    )
                    Button(
                        onClick = { navController.navigate(MainRoute.UserDetail) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF545252))
                    ) { Text("Sửa hồ sơ", color = Color.White) }

                    Spacer(Modifier.height(16.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 24.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        StatBlock("23", "Danh sách", Modifier.weight(1f))
                        StatBlock("58", "Theo dõi", Modifier.weight(1f))
                        StatBlock("43", "Đang theo dõi", Modifier.weight(1f))
                    }
                }
            }

            //Title “Danh sách” (vẫn ở Column)
            Text(
                text = "Danh sách",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
            )
            Divider(color = Color.White.copy(alpha = 0.15f))

            //Chỉ phần List dùng LazyColumn
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                items(playlists) { p ->
                    PlaylistRow(
                        data = p,
                        onClick = {
                            // ví dụ: navController.navigate("main/playlist/${id}")
                        }
                    )
                }
                item { Spacer(Modifier.height(16.dp)) }
            }
        }
    }
}

@Composable
private fun StatBlock(value: String, label: String, modifier: Modifier = Modifier) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = modifier) {
        Text(value, color = Color(0xFF58BA47), fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(2.dp))
        Text(label, color = Color.White.copy(alpha = 0.8f), fontSize = 12.sp)
    }
}

private data class PlaylistUi(
    val title: String,
    val subtitle: String,
    val coverRes: Int,
    val liked: Boolean = false
)

@Composable
private fun PlaylistRow(data: PlaylistUi, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = painterResource(data.coverRes),
            contentDescription = null,
            modifier = Modifier.size(44.dp)
        )
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (data.liked) {
                    Icon(
                        imageVector = Icons.Filled.Favorite,
                        contentDescription = null,
                        tint = Color(0xFF58BA47),
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(Modifier.width(6.dp))
                }
                Text(data.title, color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Medium)
            }
            Text(data.subtitle, color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)
        }
        Icon(
            imageVector = Icons.Filled.ChevronRight,
            contentDescription = null,
            tint = Color.White.copy(alpha = 0.7f)
        )
    }
}
