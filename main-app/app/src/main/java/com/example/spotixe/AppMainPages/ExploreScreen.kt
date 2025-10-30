package com.example.spotixe.AppMainPages

import Components.GoogleSignInButtonFirebase
import Components.RecentlyPlayedItem
import Components.SongCardColumn
import Components.TermsAndPolicyCheck
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.scrollable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.filled.ArrowBackIosNew
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.graphics.Paint
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
import com.example.spotixe.Routes
import com.google.firebase.auth.FirebaseUser
import com.example.spotixe.Data.topPicks
import com.example.spotixe.Data.recentlyPlayed
import com.example.spotixe.Data.Song
import androidx.compose.material.icons.rounded.ArrowBack

@Composable
fun ExploreScreen(navController: NavController) {
    Scaffold { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .statusBarsPadding()
        ) {

            Row (
                modifier = Modifier
                    .fillMaxWidth(),
            ){
                Box(
                    modifier = Modifier
                        .align(Alignment.Top)
                        .padding(start = 8.dp, top = 8.dp)
                        .size(40.dp)
                        .clickable { navController.popBackStack() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowBackIosNew,
                        contentDescription = "Back",
                        tint = Color(0xFF58BA47)
                    )
                }

                Spacer(Modifier.width(80.dp))

                Text(
                    "Explore",
                    fontSize = 35.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47),
                    textAlign = TextAlign.Center
                )
            }

            Spacer(Modifier.height(5.dp))

            Divider(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                color = Color(0xFFFFFFFF),
                thickness = 1.dp
            )

            Spacer(Modifier.height(5.dp))

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(vertical = 8.dp),
            ) {

                items(recentlyPlayed, key = { it.id }) { song ->
                    SongCardColumn(
                        song = song,
//                        onClick = { /* nav to detail */ },
//                        onPlayClick = { /* start player */ }
                    )
                    Divider(
                        modifier = Modifier
                            .padding(start = 80.dp) // kéo vạch xuống dưới chữ, chừa chỗ cover
                            .fillMaxWidth(),
                        color = Color(0xFF242424),
                        thickness = 1.dp
                    )
                }
            }
        }
    }
}
