package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Buttons.BackButton
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.scrollable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.spotixe.R

@Composable
fun UserDetailScreen(navController: NavController){
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
            .statusBarsPadding()
    ){
        Column (
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(start = 5.dp)
        ){
            Row (
                modifier = Modifier
                    .fillMaxWidth()
            ){
                BackButton(navController)

                Text(
                    "Hồ sơ người dùng",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47),
                    textAlign = TextAlign.Center
                )
            }

            Spacer(Modifier.height(4.dp))

            Divider(color = Color.White.copy(alpha = 0.2f))

            Spacer(Modifier.height(10.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp),
                contentAlignment = Alignment.Center
            ){
                Image(
                    painter = painterResource(R.drawable.spotixe_logo),
                    "user_avt"
                )
            }

            Row (
                modifier = Modifier
                    .fillMaxWidth()
            ){
                Text(
                    "Tên người dùng: ",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47)
                )

                Spacer(Modifier.width(4.dp))

                Text(
                    "/Username/",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF58Ba47)
                )
            }

            Spacer(Modifier.height(10.dp))

            Row (
                modifier = Modifier
                    .fillMaxWidth()
            ){
                Text(
                    "Email: ",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47)
                )

                Spacer(Modifier.width(8.dp))

                Text(
                    "/Useremail/",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF58Ba47)
                )
            }

            Spacer(Modifier.height(10.dp))

            Row (
                modifier = Modifier
                    .fillMaxWidth()
            ){
                Text(
                    "Số điện thoại: ",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47)
                )

                Spacer(Modifier.width(8.dp))

                Text(
                    "/Userphonenum/",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF58Ba47)
                )
            }
        }
    }
}