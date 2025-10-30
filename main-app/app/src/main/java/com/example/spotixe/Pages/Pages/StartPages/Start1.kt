package com.example.spotixe.Pages.Pages.StartPages

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.example.spotixe.R
import com.example.spotixe.Routes

@Composable
fun StartScreen(navController: NavController){
    var green = Color(0xFF58BA47)
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF000000),
                        Color(0xFF031508),
                        green
                    ),
                    start = Offset(1000f, 0f),
                    end = Offset(0f, 1800f)
                )
            )
    )
    {
        Column (modifier = Modifier
            .fillMaxHeight()
            .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        )
        {
            Spacer(Modifier.height(80.dp))

            Image(
                painter = painterResource(R.drawable.spotixe_logo),
                contentDescription = null,
                modifier = Modifier
                    .height(250.dp)

            )

            Spacer(Modifier.height(25.dp))

            Text(
                "Melody comes\nwith you all along",
                color = Color.White,
                fontSize = 40.sp,
                fontWeight = FontWeight.Bold,

                textAlign = TextAlign.Center,
                lineHeight = 50.sp
            )

            Spacer(Modifier.height(140.dp))

            Button(
                onClick = {navController.navigate(Routes.Start2)},
                modifier = Modifier
                    .fillMaxWidth()
                    .height(65.dp)
                    .padding(bottom = 10.dp)
                    .padding(start = 20.dp)
                    .padding(end = 20.dp)
                    .imePadding(),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDDDDDD))
            ) {
                Text(
                    "I already have account",
                    color = Color.Black,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )
            }

            Spacer(Modifier.height(10.dp))

            Button(
                onClick = {navController.navigate(Routes.Start3)},
                modifier = Modifier
                    .fillMaxWidth()
                    .height(65.dp)
                    .padding(bottom = 10.dp)
                    .padding(start = 20.dp)
                    .padding(end = 20.dp)
                    .imePadding(),
                shape = RoundedCornerShape(28.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDDDDDD))
            ) {
                Text(
                    "Sign up free",
                    color = Color.Black,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}