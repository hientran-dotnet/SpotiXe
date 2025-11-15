package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Buttons.BackButton
import Components.Bar.BottomBar
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotixe.Data.recentlyPlayed
import com.example.spotixe.Data.topPicks
import Components.Layout.ExploreSection
import androidx.compose.foundation.background
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Divider
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavHostController
import com.example.spotixe.player.rememberPlayerVMActivity

@Composable
fun ExploreScreen(navController: NavHostController) {
    val playerVM = rememberPlayerVMActivity()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
    ) {
        Scaffold(
            containerColor = Color.Transparent,
            contentWindowInsets = WindowInsets(0),
        ) { innerPadding ->

            LazyColumn(
                modifier = Modifier
                    .padding(innerPadding)
                    .background(Color(0xFF121212))
                    .fillMaxSize()
                    .statusBarsPadding(),
                contentPadding = PaddingValues(bottom = 16.dp)
            ) {

                // ---------- HEADER ----------
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 12.dp, start = 8.dp, end = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        BackButton(navController)

                        Text(
                            text = "Khám phá",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF58BA47)
                        )
                    }

                    Spacer(Modifier.height(4.dp))
                    Divider(color = Color.White.copy(alpha = 0.2f))
                }

                // ---------- SECTION 1: HIT MỚI HÔM NAY ----------
                item {
                    ExploreSection(
                        title = "Hit mới hôm nay",
                        songs = recentlyPlayed,
                        modifier = Modifier.padding(top = 12.dp),
                        navController = navController
                    )

                    Spacer(Modifier.height(20.dp))
                }

                // ---------- SECTION 2: MỚI PHÁT HÀNH ----------
                item {
                    ExploreSection(
                        title = "Mới phát hành",
                        songs = topPicks,
                        navController = navController
                    )

                    Spacer(Modifier.height(32.dp))
                }
            }
        }
    }
}

