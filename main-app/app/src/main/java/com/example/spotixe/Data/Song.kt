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
    Song("4","Escape of the Phoenix","Evergrey","2021", R.drawable.spotixe_logo),
    Song("5","A Hunter’s Tale","Evergrey","2020", R.drawable.spotixe_logo),
    Song("6","Powerslave","Iron Maiden","1984", R.drawable.spotixe_logo),
    Song("7","Escape of the Phoenix","Evergrey","2021", R.drawable.spotixe_logo),
    Song("8","A Hunter’s Tale","Evergrey","2020", R.drawable.spotixe_logo),
    Song("9","Powerslave","Iron Maiden","1984", R.drawable.spotixe_logo),
    Song("10","Escape of the Phoenix","Evergrey","2021", R.drawable.spotixe_logo),
    Song("11","A Hunter’s Tale","Evergrey","2020", R.drawable.spotixe_logo),
    Song("12","Powerslave","Iron Maiden","1984", R.drawable.spotixe_logo),
)

val recentlyPlayed: List<Song> = listOf(
    Song("rp1","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
    Song("rp2","Leviathan","Mastodon","2020", R.drawable.spotixe_logo),
    Song("rp3","Blackbird","Alter Bridge","2007", R.drawable.spotixe_logo),
    Song("rp4","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
    Song("rp5","Leviathan","Mastodon","2020", R.drawable.spotixe_logo),
    Song("rp6","Blackbird","Alter Bridge","2007", R.drawable.spotixe_logo),
    Song("rp7","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
    Song("rp8","Leviathan","Mastodon","2020", R.drawable.spotixe_logo),
    Song("rp9","Blackbird","Alter Bridge","2007", R.drawable.spotixe_logo),
    Song("rp11","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
    Song("rp12","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
    Song("rp13","Forever Outsider","Evergrey","2021", R.drawable.spotixe_logo),
)
