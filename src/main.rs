use actix_files as fs;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, Result};
use serde::{Deserialize, Serialize};
use std::io;
use std::fs::File;
use std::io::BufReader;
use rustls::{Certificate, PrivateKey, ServerConfig};
use rustls_pemfile::{certs, private_key};

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

fn load_rustls_config() -> rustls::ServerConfig {
    // Check if SSL files exist
    let cert_file_path = "./ssl/cert.pem";
    let key_file_path = "./ssl/key.pem";
    
    if !std::path::Path::new(cert_file_path).exists() || !std::path::Path::new(key_file_path).exists() {
        panic!("SSL files not found! Please run the deployment script to generate certificates.");
    }

    // Load TLS key/cert files
    let cert_file = &mut BufReader::new(File::open(cert_file_path).unwrap());
    let key_file = &mut BufReader::new(File::open(key_file_path).unwrap());

    // Parse certificates and key
    let cert_chain = certs(cert_file)
        .unwrap()
        .into_iter()
        .map(Certificate)
        .collect();
    
    let private_key = private_key(key_file)
        .unwrap()
        .unwrap();

    ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth()
        .with_single_cert(cert_chain, PrivateKey(private_key.secret_der().to_vec()))
        .expect("bad certificate/key")
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Detect number of CPU cores
    let num_workers = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(2); // Fallback to 2 workers if detection fails
    
    println!("🚀 Server starting with {} worker processes", num_workers);
    
    // Check if we should run in HTTPS mode
    let ssl_enabled = std::path::Path::new("./ssl/cert.pem").exists() && 
                     std::path::Path::new("./ssl/key.pem").exists();
      if ssl_enabled {
        println!("🔐 HTTPS mode enabled");
        println!("📍 Server starting at https://0.0.0.0:3003");
        println!("🌐 Access the app at https://localhost:3003");
        
        let config = load_rustls_config();
        
        HttpServer::new(|| {
            App::new()
                .service(hello)
                .service(chat_ready)
                .service(receive_qr)
                // Serve static files from the "./static" directory
                .service(fs::Files::new("/", "./static").index_file("index.html"))
        })
        .workers(num_workers)
        .bind_rustls("0.0.0.0:3003", config)?
        .run()
        .await
    } else {
        println!("📍 Server starting at http://0.0.0.0:3003");
        println!("🌐 Access the app at http://localhost:3003");
        println!("💡 For HTTPS/camera access, run deployment script to generate SSL certificates");
        
        HttpServer::new(|| {
            App::new()
                .service(hello)
                .service(chat_ready)
                .service(receive_qr)
                // Serve static files from the "./static" directory
                .service(fs::Files::new("/", "./static").index_file("index.html"))
        })
        .workers(num_workers)
        .bind("0.0.0.0:3003")?
        .run()
        .await
    }
}