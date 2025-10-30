package com.example.spotixe

import SignInPages.Sign_in1Screen
import SignInPages.Sign_in2Screen
import SignInPages.Sign_in3Screen
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.spotixe.SignUpPages.Sign_UpEmail1Screen
import com.example.spotixe.SignUpPages.Sign_UpEmail2Screen
import com.example.spotixe.SignUpPages.Sign_UpPhone1Screen
import com.example.spotixe.SignUpPages.Sign_UpPhone2Screen
import com.example.spotixe.StartPages.Start2Screen
import com.example.spotixe.StartPages.Start3Screen
import com.example.spotixe.StartPages.StartScreen
import com.example.spotixe.ui.theme.SpotiXeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val navController = rememberNavController()
            SpotiXeTheme {
                NavHost(
                    navController = navController,
                    startDestination = "sign_upEmail1"
                ) {
                    composable("start1"){ StartScreen(navController) }
                    composable("start2"){Start2Screen(navController)}
                    composable("start3"){ Start3Screen(navController) }
                    composable("sign_in1"){Sign_in1Screen(navController)}
                    composable("sign_in2"){Sign_in2Screen(navController)}
                    composable("sign_in3"){Sign_in3Screen(navController) }
                    composable ("sign_upEmail1"){ Sign_UpEmail1Screen(navController) }
                    composable ("sign_upEmail2"){ Sign_UpEmail2Screen(navController) }
                    composable ("sign_upPhone1"){ Sign_UpPhone1Screen(navController) }
                    composable ("sign_upPhone2"){ Sign_UpPhone2Screen(navController) }
                }
            }
        }
    }
}

