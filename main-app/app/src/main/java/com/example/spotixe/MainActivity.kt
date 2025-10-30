package com.example.spotixe

import com.example.spotixe.Pages.Pages.SignInPages.Sign_in1Screen
import com.example.spotixe.Pages.Pages.SignInPages.Sign_in2Screen
import com.example.spotixe.Pages.Pages.SignInPages.Sign_in3Screen
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.spotixe.Pages.Pages.AppMainPages.ExploreScreen
import com.example.spotixe.Pages.Pages.AppMainPages.HomeScreen
import com.example.spotixe.Pages.Pages.AppMainPages.SearchScreen
import com.example.spotixe.Pages.Pages.AppMainPages.UserScreen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpEmail1Screen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpEmail2Screen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpPhone1Screen
import com.example.spotixe.Pages.Pages.SignUpPages.Sign_UpPhone2Screen
import com.example.spotixe.Pages.Pages.StartPages.Start2Screen
import com.example.spotixe.Pages.Pages.StartPages.Start3Screen
import com.example.spotixe.Pages.Pages.StartPages.StartScreen
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
                    startDestination = "user"
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
                    composable("home"){ HomeScreen(navController) }
                    composable("explore"){ ExploreScreen(navController) }
                    composable("search"){ SearchScreen(navController) }
                    composable("user"){ UserScreen(navController) }
                }
            }
        }
    }
}

