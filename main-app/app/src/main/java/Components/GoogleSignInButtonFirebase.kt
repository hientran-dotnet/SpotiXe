package Components

import android.app.Activity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.spotixe.R
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider

@Composable
fun GoogleSignInButtonFirebase(
    modifier: Modifier = Modifier,
    containerColor: Color = Color(0xFFE7ECF5),
    cornerRadius: Int = 12,
    onSuccess: (FirebaseUser) -> Unit,
    onError: (Throwable) -> Unit = {}
) {
    val context = LocalContext.current
    val activity = context as Activity
    val auth = remember { FirebaseAuth.getInstance() }
    var loading by remember { mutableStateOf(false) }

    // Build GoogleSignInClient with default_web_client_id
    val webClientId = stringResource(id = R.string.default_web_client_id)
    val gso = remember(webClientId) {
        GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(webClientId)
            .requestEmail()
            .build()
    }
    val googleClient = remember { GoogleSignIn.getClient(activity, gso) }

    // Launcher for the Google sign-in Intent
    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode != Activity.RESULT_OK) {
            loading = false
            onError(IllegalStateException("Sign-in cancelled"))
            return@rememberLauncherForActivityResult
        }
        val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
        try {
            val account = task.getResult(ApiException::class.java)
            val credential = GoogleAuthProvider.getCredential(account.idToken, null)
            auth.signInWithCredential(credential)
                .addOnCompleteListener(activity) { signInTask ->
                    loading = false
                    if (signInTask.isSuccessful) {
                        auth.currentUser?.let(onSuccess)
                            ?: onError(IllegalStateException("User is null after sign-in"))
                    } else {
                        onError(signInTask.exception ?: RuntimeException("Firebase sign-in failed"))
                    }
                }
        } catch (e: Exception) {
            loading = false
            onError(e)
        }
    }

    // UI Button
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius.dp))
            .clickable(enabled = !loading) {
                loading = true
                launcher.launch(googleClient.signInIntent)
            },
        color = containerColor,
        shadowElevation = 0.dp
    ) {
        Box(
            modifier = Modifier
                .background(containerColor)
                .padding(horizontal = 16.dp, vertical = 10.dp)
                .defaultMinSize(minHeight = 44.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier.width(75.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                if (loading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp,
                        color = MaterialTheme.colorScheme.primary
                    )
                } else {
                    Image(
                        painter = painterResource(id = R.drawable.google_logo),
                        contentDescription = "Google Logo",
                        modifier = Modifier
                            .size(45.dp)
                            .padding(start = 6.dp)
                    )
                }
                Spacer(Modifier.width(6.dp))
                Text(
                    text = if (loading) "Signing in..." else "",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF202124)
                )
            }
        }
    }
}

/** Optional helpers for reuse elsewhere */
object GoogleAuthUtils {
    fun signOut(onComplete: (Boolean) -> Unit = {}) {
        FirebaseAuth.getInstance().signOut()
        onComplete(true)
    }
}
