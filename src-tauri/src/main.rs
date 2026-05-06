#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::<tauri::Wry>::new()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}