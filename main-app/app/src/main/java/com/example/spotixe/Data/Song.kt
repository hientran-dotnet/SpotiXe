package com.example.spotixe.Data

import com.example.spotixe.R

data class Song(
    val id: String,
    val title: String,
    val artist: String,
    val year: String,
    val coverRes: Int // R.drawable.*
)

val topPicks = listOf(
    Song("1","Escape of the Phoenix","Evergrey","2021", R.drawable.spotixe_logo),
    Song("2","A Hunter’s Tale","Evergrey","2020", R.drawable.spotixe_logo),
    Song("3","Powerslave","Iron Maiden","1984", R.drawable.spotixe_logo),
)

val recentlyPlayed: List<Song> = listOf(
    Song("rp1","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
    Song("rp2","Leviathan","Mastodon","2020", R.drawable.spotixe_logo),
    Song("rp3","Blackbird","Alter Bridge","2007", R.drawable.spotixe_logo),
)
