fn main() {
    let proto_files = vec![
        "calculator.proto",
        "hero.proto",
    ];
    
    tonic_build::configure()
        .build_server(true)
        .out_dir("./src")
        .compile(&proto_files, &["/home/runner/work/grpc-codegen/grpc-codegen/proto"])
        .unwrap_or_else(|e| panic!("protobuf compile error: {}", e));
        
    for proto_file in &proto_files {
        println!("cargo:rerun-if-changed=/home/runner/work/grpc-codegen/grpc-codegen/proto/{}", proto_file);
    }
}