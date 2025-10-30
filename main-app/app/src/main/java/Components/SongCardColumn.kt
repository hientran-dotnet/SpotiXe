package Components

import android.R.attr.onClick
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Text
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import com.example.spotixe.Data.Song


@Composable
fun SongCardColumn(
    song: Song,
    modifier: Modifier = Modifier
        .fillMaxWidth()
        .height(140.dp),
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .clickable {  }
            .padding(horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = painterResource(song.coverRes),
            contentDescription = null,
            modifier = Modifier
                .size(80.dp)
                .clip(RoundedCornerShape(9.dp)),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.width(15.dp))

        Column(
            modifier = Modifier.widthIn(max = 200.dp),
            verticalArrangement = Arrangement.Center
        ) {
            Text(song.title, fontWeight = FontWeight.SemiBold, maxLines = 1, color = Color.White, fontSize = 20.sp)
            Text("${song.artist} • ${song.year}", fontSize = 13.sp, color = Color.Gray)
        }

        Spacer(modifier = Modifier.weight(1f))

//        FilledIconButton(
//            onClick = {  },
//            modifier = Modifier.size(36.dp),
//            colors = IconButtonDefaults.filledIconButtonColors(
//                containerColor = Color(0xFF1DB954),
//                contentColor = Color.Black
//            )
//        ) {
//            Icon(Icons.Rounded.PlayArrow, contentDescription = null)
//        }
    }

}
