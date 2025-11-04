package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Buttons.BackButton
import Components.BottomBar
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
import Components.Card.ExploreSection
import androidx.compose.foundation.background
import androidx.compose.material3.Divider
import androidx.compose.ui.text.font.FontWeight
import androidx.navigation.NavHostController

@Composable
fun ExploreScreen(navController: NavHostController) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
    ){
        Scaffold (
            containerColor = Color.Transparent,
            contentWindowInsets = WindowInsets(0),
            bottomBar = { BottomBar(navController) }
        ) { innerPadding ->
            Column(
                modifier = Modifier
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .background(Color(0xFF121212))
                    .fillMaxSize()
                    .statusBarsPadding()
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp, start = 8.dp, end = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {

                    BackButton(navController)

                    Spacer(Modifier.width(120.dp))

                    Text(
                        text = "Explore",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF58BA47)
                    )
                }

                Spacer(Modifier.height(4.dp))
                Divider(color = Color.White.copy(alpha = 0.2f))

                // Section 1
                ExploreSection(
                    title = "Hit mới hôm nay",
                    songs = recentlyPlayed,
                    modifier = Modifier
                        .padding(top = 12.dp)
                )

                Spacer(Modifier.height(20.dp))

                // Section 2
                ExploreSection(
                    title = "Mới phát hành",
                    songs = topPicks
                )

                Spacer(Modifier.height(32.dp))
            }
        }
    }
}
