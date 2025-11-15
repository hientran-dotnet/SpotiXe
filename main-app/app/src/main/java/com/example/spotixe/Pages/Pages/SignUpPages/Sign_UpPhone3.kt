package com.example.spotixe.Pages.Pages.SignUpPages

import Components.Buttons.BackButton
import Components.Layout.OtpInputField
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.spotixe.R

@Composable
fun Sign_UpPhone3Screen(navController: NavController){
    var green = Color(0xFF58BA47)
    var username by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                color = Color(0xFF121212)
            )
    )
    {
        Row (
            modifier = Modifier
                .padding(start = 15.dp)
                .statusBarsPadding(),
            horizontalArrangement = Arrangement.Start
        ){
            BackButton(navController)
        }

        Column(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth()
                .padding(horizontal = 30.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(50.dp))

            Image(
                painter = painterResource(R.drawable.spotixe_logo),
                contentDescription = null,
                modifier = Modifier.height(180.dp)
            )

            Spacer(Modifier.height(20.dp))

            Text(
                "Enter Username and\nPassword to continue",
                fontSize = 20.sp,
                color = green,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(15.dp))

            // Username label
            Text(
                text = "Username",
                color = green,
                fontSize = 18.sp,
                modifier = Modifier.align(Alignment.Start)
            )

            Spacer(Modifier.height(8.dp))

            // TextField cho username
            TextField(
                value = username,
                onValueChange = {
                    username = it
                },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFF444444),
                    unfocusedContainerColor = Color(0xFF444444),
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    cursorColor = Color.White,
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape = RoundedCornerShape(12.dp))
            )

            Spacer(Modifier.height(20.dp))

            // Password label
            Text(
                text = "Password",
                color = green,
                fontSize = 18.sp,
                modifier = Modifier.align(Alignment.Start)
            )

            Spacer(Modifier.height(8.dp))

            // TextField cho Password
            TextField(
                value = password,
                onValueChange = {
                    password = it
                },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFF444444),
                    unfocusedContainerColor = Color(0xFF444444),
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    cursorColor = Color.White
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape = RoundedCornerShape(12.dp))
            )

            Spacer(Modifier.height(20.dp))

            Button(
                onClick = {},
                modifier = Modifier
                    .width(150.dp)
                    .height(45.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = green,
                    contentColor = Color.Black

                )

            ) {
                Text(
                    text = "Continue",
                    fontSize = 18.sp
                )
            }
        }
    }
}