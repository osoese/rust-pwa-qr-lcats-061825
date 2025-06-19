use actix_files as fs;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use std::io;

#[get("/api/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json("Hello from the Rust server!")
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    // Detect number of CPU cores
    let num_workers = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(2); // Fallback to 2 workers if detection fails
    
    println!("🚀 Server starting with {} worker processes", num_workers);
    println!("📍 Server starting at http://127.0.0.1:8080");
    println!("🌐 Access the app at http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            .service(hello)
            // Serve static files from the "./static" directory
            .service(fs::Files::new("/", "./static").index_file("index.html"))
    })
    .workers(num_workers) // Use all available CPU cores
    .bind("0.0.0.0:8080")? // Bind to 0.0.0.0 to be accessible from outside the container
    .run()
    .await
}