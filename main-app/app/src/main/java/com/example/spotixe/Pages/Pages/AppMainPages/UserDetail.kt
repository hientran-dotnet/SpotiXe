package com.example.spotixe.Pages.Pages.AppMainPages

import Components.Buttons.BackButton
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.spotixe.R
import java.time.*
import java.time.format.DateTimeFormatter
import androidx.compose.material3.TextFieldDefaults

@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserDetailScreen(navController: NavController) {
    val formatter = remember { DateTimeFormatter.ofPattern("dd/MM/yyyy") }

    // State mẫu (sau này bind từ ViewModel)
    var name by remember { mutableStateOf("Tran Thanh") }
    var email by remember { mutableStateOf("tranthanh123@gmail.com") }
    var dob by remember { mutableStateOf(LocalDate.of(1987, 2, 5)) }
    var joinDate by remember { mutableStateOf(LocalDate.of(2025, 10, 1)) }

    // Toggle edit cho từng dòng
    var editName by remember { mutableStateOf(false) }
    var editEmail by remember { mutableStateOf(false) }
    var showDobPicker by remember { mutableStateOf(false) }
    var showJoinPicker by remember { mutableStateOf(false) }

    // DatePicker state
    val dobState = rememberDatePickerState(
        initialSelectedDateMillis = dob.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli()
    )
    val joinState = rememberDatePickerState(
        initialSelectedDateMillis = joinDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli()
    )

    // Validate nhỏ cho email
    fun isValidEmail(s: String) =
        android.util.Patterns.EMAIL_ADDRESS.matcher(s).matches()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF121212))
            .statusBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 10.dp)
        ) {
            // Top bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BackButton(navController)
                Spacer(Modifier.width(8.dp))
                Text(
                    "Hồ sơ người dùng",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF58BA47),
                    textAlign = TextAlign.Start
                )
            }

            Spacer(Modifier.height(10.dp))
            Divider(color = Color.White.copy(alpha = 0.2f))
            Spacer(Modifier.height(12.dp))

            // Avatar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(150.dp),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(R.drawable.spotixe_logo),
                    contentDescription = "avatar"
                )
            }

            // ----- Lines -----
            EditableTextLine(
                label = "Name",
                value = name,
                onValueChange = { name = it },
                editing = editName,
                onToggleEdit = { editName = !editName }
            )

            EditableDateLine(
                label = "Date of birth",
                date = dob,
                formatted = dob.format(formatter),
                onClickEdit = { showDobPicker = true }
            )

            EditableTextLine(
                label = "Email",
                value = email,
                onValueChange = { email = it },
                editing = editEmail,
                onToggleEdit = { editEmail = !editEmail },
                keyboardType = KeyboardType.Email
            )

            EditableDateLine(
                label = "Joining date",
                date = joinDate,
                formatted = joinDate.format(formatter),
                onClickEdit = { showJoinPicker = true }
            )

            // Save button
            Button(
                onClick = {
                    if (name.isBlank()) return@Button
                    if (!isValidEmail(email)) return@Button
                    // TODO: call ViewModel.save(...)
                    navController.popBackStack()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp)
                    .imePadding(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF58BA47))
            ) {
                Text("Save", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
            }
        }

        //DOB Picker
        if (showDobPicker) {
            DatePickerDialog(
                onDismissRequest = { showDobPicker = false },
                confirmButton = {
                    TextButton(onClick = {
                        dobState.selectedDateMillis?.let {
                            dob = Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault()).toLocalDate()
                        }
                        showDobPicker = false
                    }) { Text("OK") }
                },
                dismissButton = {
                    TextButton(onClick = { showDobPicker = false }) { Text("Cancel") }
                }
            ) { DatePicker(state = dobState) }
        }

        //Joining Picker
        if (showJoinPicker) {
            DatePickerDialog(
                onDismissRequest = { showJoinPicker = false },
                confirmButton = {
                    TextButton(onClick = {
                        joinState.selectedDateMillis?.let {
                            joinDate = Instant.ofEpochMilli(it).atZone(ZoneId.systemDefault()).toLocalDate()
                        }
                        showJoinPicker = false
                    }) { Text("OK") }
                },
                dismissButton = {
                    TextButton(onClick = { showJoinPicker = false }) { Text("Cancel") }
                }
            ) { DatePicker(state = joinState) }
        }
    }
}

//  Tiny reusable lines

@Composable
private fun EditableTextLine(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    editing: Boolean,
    onToggleEdit: () -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text
) {
    Column(Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(label, color = Color.White.copy(alpha = 0.7f), fontSize = 13.sp)
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (editing) {
                OutlinedTextField(
                    value = value,
                    onValueChange = onValueChange,
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = keyboardType
                    ),
                    modifier = Modifier.weight(1f),
                    colors = TextFieldDefaults.colors(
                        focusedIndicatorColor = Color(0xFF58BA47),
                        unfocusedIndicatorColor = Color.White.copy(alpha = 0.25f),
                        cursorColor = Color.White,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent
                    )
                )
            } else {
                Text(
                    text = value,
                    color = Color.White,
                    fontSize = 16.sp,
                    modifier = Modifier.weight(1f)
                )
            }
            IconButton(onClick = onToggleEdit) {
                Icon(Icons.Outlined.Edit, contentDescription = null, tint = Color.White)
            }
        }
        Divider(color = Color.White.copy(alpha = 0.12f))
    }
}

@Composable
private fun EditableDateLine(
    label: String,
    date: LocalDate,
    formatted: String,
    onClickEdit: () -> Unit
) {
    Column(Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(label, color = Color.White.copy(alpha = 0.7f), fontSize = 13.sp)
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = formatted,
                color = Color.White,
                fontSize = 16.sp,
                modifier = Modifier.weight(1f)
            )
            IconButton(onClick = onClickEdit) {
                Icon(Icons.Outlined.Edit, contentDescription = null, tint = Color.White)
            }
        }
        Divider(color = Color.White.copy(alpha = 0.12f))
    }
}
