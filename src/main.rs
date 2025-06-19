use actix_files as fs;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Result};
use serde::{Deserialize, Serialize};
use std::io;

#[derive(Serialize, Deserialize)]
struct ChatMessage {
    message: String,
    timestamp: String,
}

#[derive(Deserialize)]
struct QrData {
    content: String,
}

#[get("/api/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json("Hello from the Rust server!")
}

#[get("/api/chat/ready")]
async fn chat_ready() -> Result<HttpResponse> {
    let message = ChatMessage {
        message: "Ready to receive...".to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    };
    Ok(HttpResponse::Ok().json(message))
}

#[post("/api/chat/qr")]
async fn receive_qr(qr_data: web::Json<QrData>) -> Result<HttpResponse> {
    let message = ChatMessage {
        message: format!("QR Code detected: {}", qr_data.content),
        timestamp: chrono::Utc::now().to_rfc3339(),
    };
    Ok(HttpResponse::Ok().json(message))
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Detect number of CPU cores
    let num_workers = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(2); // Fallback to 2 workers if detection fails
      println!("🚀 Server starting with {} worker processes", num_workers);
    println!("📍 Server starting at http://127.0.0.1:3003");
    println!("🌐 Access the app at http://localhost:3003");    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(chat_ready)
            .service(receive_qr)
            // Serve static files from the "./static" directory
            .service(fs::Files::new("/", "./static").index_file("index.html"))
    })
    .workers(num_workers) // Use all available CPU cores
    .bind("0.0.0.0:3003")? // Bind to 0.0.0.0 to be accessible from outside the container
    .run()
    .await
}