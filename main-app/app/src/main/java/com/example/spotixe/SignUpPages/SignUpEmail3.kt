package com.example.spotixe.SignUpPages

import Components.TermsAndPolicyCheck
import Components.policyText
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
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
fun Sign_UpEmail3Screen(navController: NavController){
    val green = Color(0xFF58BA47)
    var agreed by rememberSaveable { mutableStateOf(false) }
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
    ) {
        Row(
            modifier = Modifier
                .padding(start = 15.dp)
                .statusBarsPadding(),
            horizontalArrangement = Arrangement.Start
        ) {
            Box(
                modifier = Modifier
                    .padding(start = 8.dp, top = 8.dp)
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF000000))
                    .clickable { navController.popBackStack() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }
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

            Spacer(Modifier.height(10.dp))

            Text(
                "Create your account",
                fontSize = 35.sp,
                fontWeight = FontWeight.Bold,
                color = green,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(16.dp))


            val scrollState = rememberScrollState()
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .border(1.dp, Color(0xFF58BA47), RoundedCornerShape(12.dp))
                    .background(Color(0xFF2B2B2B), RoundedCornerShape(12.dp))
                    .padding(12.dp)
                    .verticalScroll(rememberScrollState()),
                contentAlignment = Alignment.TopStart
            ) {
                Text(
                    text = policyText,
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 15.sp,
                    lineHeight = 20.sp
                )
            }

            Spacer(Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TermsAndPolicyCheck(
                    checked = agreed,
                    onCheckedChange = { agreed = it },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(Modifier.height(16.dp))



            Button(
                onClick = {
                    // thực hiện signup
                },
                enabled = agreed,
                modifier = Modifier
                    .width(150.dp)
                    .height(45.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (agreed) green else Color(0xFF2F2F2F),
                    contentColor = if (agreed) Color.Black else Color(0xFF9E9E9E)
                )
            ) {
                Text(text = "Sign up", fontSize = 18.sp)
            }

            Spacer(Modifier.height(20.dp))

            Text(
                text = buildAnnotatedString {
                    append("Or ")
                    withStyle(style = SpanStyle(color = Color.White)) { append("sign in") }
                    append(" with")
                },
                color = green,
                fontSize = 16.sp,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(15.dp))

            Box(
                modifier = Modifier
                    .size(width = 100.dp, height = 50.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFFEDEDED))
                    .clickable { /* Google sign-in */ },
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.google_logo),
                    contentDescription = "Google Logo",
                    modifier = Modifier.size(30.dp)
                )
            }

            Spacer(Modifier.height(15.dp))

            Text(
                text = buildAnnotatedString {
                    withStyle(style = SpanStyle(color = green)) { append("Already have account ?\n") }
                    withStyle(style = SpanStyle(color = green)) { append("Click here to ") }
                    withStyle(style = SpanStyle(color = Color.White, fontStyle = FontStyle.Italic)) { append("sign in") }
                },
                fontSize = 16.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.clickable { /* Navigate to Sign In */ }
            )
        }
    }
}
