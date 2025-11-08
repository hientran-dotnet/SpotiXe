package Components.Buttons

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import com.example.spotixe.Data.Song
import com.example.spotixe.Graph
import com.example.spotixe.player.PlayerViewModel

@Composable
fun rememberPlayerVM(navController: NavHostController): PlayerViewModel {
    val owner = remember(navController) { navController.getBackStackEntry(Graph.MAIN) }
    return viewModel(owner)
}

// Component
@Composable
fun PlayButton(
    song: Song,
    navController: NavHostController,
    modifier: Modifier = Modifier,
    size: Dp = 36.dp,
    onPlay: () -> Unit
) {
    val playerVM = rememberPlayerVM(navController)

    FilledIconButton(
        onClick = onPlay,
        modifier = modifier.size(size),
        colors = IconButtonDefaults.filledIconButtonColors(
            containerColor = Color(0xFF1DB954),
            contentColor   = Color.Black
        )
    ) { Icon(Icons.Rounded.PlayArrow, contentDescription = null) }
}