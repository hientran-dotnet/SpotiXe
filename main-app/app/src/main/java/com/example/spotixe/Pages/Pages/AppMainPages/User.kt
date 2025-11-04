package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Buttons.BackButton
import Components.BottomBar
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotixe.R
import androidx.navigation.NavHostController

@Composable
fun UserScreen(
    navController: NavHostController,
){
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
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 12.dp, start = 8.dp, end = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(navController)

                Text(
                    text = "Tài khoản",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47),
                    textAlign = TextAlign.Center
                )
            }

            Spacer(Modifier.height(4.dp))

            Divider(color = Color.White.copy(alpha = 0.2f))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(350.dp)
                    .background(
                        Brush.linearGradient(
                            listOf(
                                Color(0xFF000000),
                                Color(0xFF031508).copy(alpha = 0.7f),
                                Color(0xFF58BA47).copy(alpha = 0.9f)
                            ),
                            start = Offset(600f, 0f),
                            end   = Offset(0f, 800f)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Image(
                        painter = painterResource(R.drawable.spotixe_logo),
                        contentDescription = null,
                        modifier = Modifier
                            .size(200.dp)
                    )

                    Button(
                        onClick = {},
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF545252),
                        )
                    ) {
                        Text(
                            "Sửa hồ sơ",
                            color = Color.White
                            )
                        }
                    }
                }
            }
        }
    }
}
