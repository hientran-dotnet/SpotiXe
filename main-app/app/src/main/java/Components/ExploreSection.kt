package Components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.filled.ArrowBackIosNew
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.spotixe.Data.recentlyPlayed
import com.example.spotixe.Data.topPicks
import Components.ExploreSection
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.Divider
import androidx.compose.material.icons.Icons
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.text.font.FontWeight
import com.example.spotixe.Data.Song
import com.example.spotixe.Data.chunkByFour
import Components.SongCardColumn
import androidx.compose.foundation.background
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.ui.draw.clip

@Composable
fun ExploreSection(
    title: String,
    songs: List<Song>,
    modifier: Modifier = Modifier
) {
    val grouped = songs.chunkByFour()
    val pagerState = rememberPagerState(
        initialPage = 0,
        pageCount = { grouped.size }
    )
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxWidth()) {

        Text(
            text = title,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        Spacer(Modifier.height(10.dp))

        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            pageSpacing = 16.dp
        ) { page ->

            Column(
                modifier = Modifier
                    .width(IntrinsicSize.Max)
            ) {
                val group = grouped[page]

                group.forEachIndexed { index, song ->

                    SongCardColumn(song = song)

                    if (index != group.lastIndex) {
                        Divider(
                            modifier = Modifier
                                .padding(start = 80.dp)
                                .fillMaxWidth(),
                            color = Color(0xFF242424),
                            thickness = 1.dp
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(6.dp))

        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(pagerState.pageCount) { index ->
                Box(
                    modifier = Modifier
                        .padding(3.dp)
                        .size(if (pagerState.currentPage == index) 10.dp else 6.dp)
                        .clip(CircleShape)
                        .background(
                            if (pagerState.currentPage == index)
                                Color.White
                            else Color.Gray.copy(alpha = 0.4f)
                        )
                )
            }
        }
    }
}
