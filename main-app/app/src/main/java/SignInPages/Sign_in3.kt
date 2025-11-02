package SignInPages

import Components.GoogleSignInButtonFirebase
import Components.OtpInputField
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
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
import com.google.firebase.auth.FirebaseUser

@Composable
fun Sign_in3Screen(
    navController: NavController,
    onSignedIn: (FirebaseUser) -> Unit={},
    onError: (String) -> Unit={}
    ){
    var green = Color(0xFF58BA47)
    var otpValue = rememberSaveable { mutableStateOf("") }
    val context = LocalContext.current
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
                    tint = Color(0xFFFFFFFF)
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

            Spacer(Modifier.height(20.dp))

            Text(
                "Sign in your account",
                fontSize = 35.sp,
                fontWeight = FontWeight.Bold,
                color = green,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(10.dp))

            Text(
                "Enter your OTP",
                fontSize = 25.sp,
                color = green,
                fontWeight = FontWeight.Bold
                )

            Spacer(Modifier.height(15.dp))
            OtpInputField(
                otp = otpValue,
                count = 5,
                mask = true,
                onFilled = { code ->
                    if (code == "123456") {
                        // OK -> màn hình mk mới
//                        navController.navigate(Routes.)
                        println("inputOTP11@=${otpValue}")
                    } else {
                        // Sai mã -> báo lỗi
                        Toast.makeText(context, "Mã OTP không đúng", Toast.LENGTH_SHORT).show()
                    }
                }
            )

            Spacer(Modifier.height(10.dp))

            Text(
                text = "Forgot password",
                color = Color.White,
                fontStyle = FontStyle.Italic,
                modifier = Modifier
                    .align(Alignment.Start)
                    .clickable {}
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

            Spacer(modifier = Modifier.height(40.dp))

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

            Spacer(modifier = Modifier.height(15.dp))

            GoogleSignInButtonFirebase(
                onSuccess = { user: FirebaseUser ->
                    navController.navigate("") {
                        popUpTo("login") { inclusive = true }
                        launchSingleTop = true
                    } },
                onError = { e -> onError(e.message ?: "Unknown error") }
            )

            Spacer(modifier = Modifier.height(25.dp))

            Text(
                text = buildAnnotatedString {
                    withStyle(style = SpanStyle(color = green)) {append("Don't have account ?\n")}
                    withStyle(style = SpanStyle(color = green)) { append("Click here to ") }
                    withStyle(style = SpanStyle(color = Color.White, fontStyle = FontStyle.Italic)) { append("sign up") }
                },
                fontSize = 16.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.clickable { println("Navigate to Sign Up") }
            )


        }

    }
}